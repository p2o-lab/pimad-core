import {IResponse, FSuccessResponse, FErrorResponse, ResponseVendor} from '../Backbone/Response'
import {IPEA} from '../ModuleAutomation/PEA'
import {Importer} from '../Converter/Importer'

interface IPEAStore {
    addPEA(any: object): IResponse;
    deletePEA(tag: string): IResponse;
    getPEA(tag: string): IResponse;
    initialize(firstChainElement: Importer): boolean;
}

abstract class PEAStore implements IPEAStore {
    private initialized: boolean = false;
    protected importerChainFirstElement: Importer | undefined;
    protected PEAs: IPEA[]
    //protected responseVendor: ResponseVendor;
    // TODO: Need ResponseBuilder
    protected successResponseFactory: FSuccessResponse
    protected errorResponseFactory: FErrorResponse

    constructor() {
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

    abstract addPEA(any: object): IResponse;
    abstract deletePEA(tag: string): IResponse;
    abstract getPEA(tag: string): IResponse;
}

export class WebPEAStore extends PEAStore {
    addPEA(any: object): IResponse {
        return this.errorResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.errorResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.errorResponseFactory.create()
    }
}

export class CommandLinePEAStore extends PEAStore {
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

export class DependencyPEAStore extends PEAStore {
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

/* Factory */

abstract class PEAStoreFactory {}

export class WebPEAStoreFactory extends PEAStoreFactory {}
export class CommandLinePEAStoreFactory extends PEAStoreFactory {}
export class DependencyPEAStoreFactory extends PEAStoreFactory {}