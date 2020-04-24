import {FErrorResponse, FSuccessResponse, IResponse} from '../Backbone/Response';
import {IGate} from './Gate';

abstract class AImporter implements  Importer {

    private initialized: boolean;
    protected nextImporter: Importer | undefined;
    protected successResponseFactory: FSuccessResponse
    protected errorResponseFactory: FErrorResponse

    constructor() {
        this.nextImporter = undefined;
        this.initialized = false;
        this.successResponseFactory = new FSuccessResponse();
        this.errorResponseFactory = new FErrorResponse();
    }
    abstract convertFrom(source: object): IResponse;
    initialize(nextImporter: Importer, gate: IGate): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.nextImporter = nextImporter;
            return (JSON.stringify(this.nextImporter) == JSON.stringify(nextImporter))
        } else {
            return false;
        }
    };
}

export class LastChainLinkImporter extends AImporter {
    convertFrom(source: object): IResponse {
        return this.errorResponseFactory.create();
    }
    /*
    initialize(nextImporter: IImporter, gate: IGate): boolean {
        return false;
    }*/
}

export interface Importer {
    convertFrom(source: object): IResponse;
    initialize(nextImporter: Importer, gate: IGate): boolean;
}

/* Factory */

abstract class FImporter implements IFImporter {
    abstract create(): Importer;
}

export class FLastChainElementImporter extends FImporter {
    create(): Importer {
        return new LastChainLinkImporter();
    }
}

export interface IFImporter {
    create(): Importer;
}