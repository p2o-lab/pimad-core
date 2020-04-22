import { IResponse, FSuccessResponse, FErrorResponse } from "../Backbone/Response"
interface IPEAStore {
    addPEA(any: object): IResponse;
    deletePEA(tag: string): IResponse;
    getPEA(tag: string): IResponse;
}

abstract class PEAStore implements IPEAStore {
    protected importerChainFirstElement = null;
    protected PEAs = null;
    protected successResponseFactory: FSuccessResponse
    protected errorSuccessFactory: FErrorResponse

    constructor() {
        this.successResponseFactory = new FSuccessResponse();
        this.errorSuccessFactory = new FErrorResponse();
    }

    abstract addPEA(any: object): IResponse;
    abstract deletePEA(tag: string): IResponse;
    abstract getPEA(tag: string): IResponse;
}

class WebPEAStore extends PEAStore {
    addPEA(any: object): IResponse {
        return this.successResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.successResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.successResponseFactory.create()
    }
}

class CommandLinePEAStore extends PEAStore {
    addPEA(any: object) {
        return this.successResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.successResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.successResponseFactory.create()
    }
}

class DependencyPEAStore extends PEAStore {
    addPEA(any: object) {
        return this.successResponseFactory.create()
    }
    deletePEA(tag: string) {
        return this.successResponseFactory.create()
    }
    getPEA(tag: string) {
        return this.successResponseFactory.create()
    }
}

abstract class PEAStoreFactory {

}

class WebPEAStoreFactory extends PEAStoreFactory {

}

class CommandLinePEAStoreFactory extends PEAStoreFactory {

}

class DependencyPEAStoreFactory extends PEAStoreFactory {

}