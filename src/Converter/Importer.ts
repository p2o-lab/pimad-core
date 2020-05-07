import {ErrorResponseFactory, SuccessResponseFactory, Response} from '../Backbone/Response';
import {Gate} from './Gate';

abstract class AImporter implements  Importer {

    protected initialized: boolean;
    protected nextImporter: Importer | undefined;
    protected successResponseFactory: SuccessResponseFactory
    protected errorResponseFactory: ErrorResponseFactory

    constructor() {
        this.nextImporter = undefined;
        this.initialized = false;
        this.successResponseFactory = new SuccessResponseFactory();
        this.errorResponseFactory = new ErrorResponseFactory();
    }
    abstract convertFrom(source: object): Response;
    initialize(nextImporter: Importer | undefined, gate: Gate): boolean {
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
    initialize(nextImporter: Importer, gate: Gate): boolean {
        if (!this.initialized) {
            this.initialized = true;
            return true
        } else {
            return false;
        }
    };
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

