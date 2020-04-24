import {FErrorResponse, FSuccessResponse, Response} from '../Backbone/Response';
import {Gate} from './Gate';

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
    abstract convertFrom(source: object): Response;
    initialize(nextImporter: Importer, gate: Gate): boolean {
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
    convertFrom(source: object): Response {
        return this.errorResponseFactory.create();
    }
    /*
    initialize(nextImporter: IImporter, gate: IGate): boolean {
        return false;
    }*/
}

export interface Importer {
    convertFrom(source: object): Response;
    initialize(nextImporter: Importer, gate: Gate): boolean;
}

/* Factory */

abstract class AImporterFactory implements ImporterFactory {
    abstract create(): Importer;
}

export class FLastChainElementImporter extends AImporterFactory {
    create(): Importer {
        return new LastChainLinkImporter();
    }
}

export interface ImporterFactory {
    create(): Importer;
}