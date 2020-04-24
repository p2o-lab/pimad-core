import {Response, FSuccessResponse, FErrorResponse, ResponseVendor} from '../Backbone/Response'
import {PEA} from '../ModuleAutomation/PEA'
import {Importer} from '../Converter/Importer'

abstract class APEAStore implements PEAStore {
    private initialized: boolean;
    protected importerChainFirstElement: Importer | undefined;
    protected PEAs: PEA[]
    //protected responseVendor: ResponseVendor;
    // TODO: Need ResponseBuilder
    protected successResponseFactory: FSuccessResponse
    protected errorResponseFactory: FErrorResponse

    constructor() {
        this.initialized = false;
        this.successResponseFactory = new FSuccessResponse();
        this.errorResponseFactory = new FErrorResponse();
        this.PEAs = []
        this.importerChainFirstElement = undefined;
    }

    initialize(firstChainElement: Importer): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.importerChainFirstElement = firstChainElement;
            return (JSON.stringify(this.importerChainFirstElement) == JSON.stringify(firstChainElement))
        } else {
            return false;
        }
    }

    abstract addPEA(any: object): Response;
    abstract deletePEA(tag: string): Response;
    abstract getPEA(tag: string): Response;
}

export class WebPEAStore extends APEAStore {
    addPEA(any: object): Response {
        return this.errorResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.errorResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.errorResponseFactory.create()
    }
}

export class CommandLinePEAStore extends APEAStore {
    addPEA(any: object) {
        return this.errorResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.errorResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.errorResponseFactory.create()
    }
}

export class DependencyPEAStore extends APEAStore {
    addPEA(any: object) {
        return this.errorResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.errorResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.errorResponseFactory.create()
    }
}

interface PEAStore {
    addPEA(any: object): Response;
    deletePEA(tag: string): Response;
    getPEA(tag: string): Response;
    initialize(firstChainElement: Importer): boolean;
}

/* Factory */

abstract class PEAStoreFactory {}

export class WebPEAStoreFactory extends PEAStoreFactory {}
export class CommandLinePEAStoreFactory extends PEAStoreFactory {}
export class DependencyPEAStoreFactory extends PEAStoreFactory {}