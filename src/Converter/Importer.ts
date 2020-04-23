import {FErrorResponse, FSuccessResponse, IResponse} from "../Backbone/Response";
import {IGate} from "./Gate";

abstract class Importer implements  IImporter {

    private initialized: boolean;
    protected nextImporter: IImporter | undefined;
    protected successResponseFactory: FSuccessResponse
    protected errorResponseFactory: FErrorResponse

    constructor() {
        this.nextImporter = undefined;
        this.initialized = false;
        this.successResponseFactory = new FSuccessResponse();
        this.errorResponseFactory = new FErrorResponse();
    }
    abstract convertFrom(source: object): IResponse;
    initialize(nextImporter: IImporter, gate: IGate): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.nextImporter = nextImporter;
            return (JSON.stringify(this.nextImporter) == JSON.stringify(nextImporter))
        } else {
            return false;
        }
    };
}

class LastChainLinkImporter extends Importer {
    convertFrom(source: object): IResponse {
        return this.errorResponseFactory.create();
    }
    initialize(nextImporter: IImporter, gate: IGate): boolean {
        return false;
    }
}

export interface IImporter {
    convertFrom(source: object): IResponse;
    initialize(nextImporter: IImporter, gate: IGate): boolean;
}

/* Factory */

abstract class FImporter implements IFImporter {
    abstract create(): IImporter;
}

export class FLastChainElementImporter extends FImporter {
    create(): IImporter {
        return new LastChainLinkImporter();
    }
}

export interface IFImporter {
    create(): IImporter;
}