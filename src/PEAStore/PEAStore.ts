import {IResponse, FSuccessResponse, FErrorResponse} from "../Backbone/Response"
import {IPEA} from "../ModuleAutomation/PEA"
import {IImporter} from "../Converter/Importer"

interface IPEAStore {
    addPEA(any: object): IResponse;
    deletePEA(tag: string): IResponse;
    getPEA(tag: string): IResponse;
}

abstract class PEAStore implements IPEAStore {
    protected importerChainFirstElement: IImporter | undefined;
    protected PEAs: IPEA[]
    protected successResponseFactory: FSuccessResponse
    protected errorResponseFactory: FErrorResponse

    constructor() {
        this.successResponseFactory = new FSuccessResponse();
        this.errorResponseFactory = new FErrorResponse();
        this.PEAs = []
        this.importerChainFirstElement = undefined;
    }

    abstract addPEA(any: object): IResponse;
    abstract deletePEA(tag: string): IResponse;
    abstract getPEA(tag: string): IResponse;
}

class WebPEAStore extends PEAStore {
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

class CommandLinePEAStore extends PEAStore {
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

class DependencyPEAStore extends PEAStore {
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

class WebPEAStoreFactory extends PEAStoreFactory {}
class CommandLinePEAStoreFactory extends PEAStoreFactory {}
class DependencyPEAStoreFactory extends PEAStoreFactory {}