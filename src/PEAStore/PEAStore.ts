import { IResponse } from "../Backbone/Response"
interface IPEAStore {
    addPEA(any: object): IResponse;
    deletePEA(tag: string): IResponse;
    getPEA(tag: string): IResponse;
}

abstract class PEAStore implements IPEAStore {
    protected importerChainFirstElement;
    protected PEAs;

    abstract addPEA(any: object);
    abstract deletePEA(tag: string);
    abstract getPEA(tag: string);
}

class WebPEAStore extends PEAStore {
    addPEA(any: object) {}
    deletePEA(tag: string) {}
    getPEA(tag: string) {}
}

class CommandLinePEAStore extends PEAStore {
    addPEA(any: object) {}
    deletePEA(tag: string) {}
    getPEA(tag: string) {}
}

class DependencyPEAStore extends PEAStore {
    addPEA(any: object) {}
    deletePEA(tag: string) {}
    getPEA(tag: string) {}
}

abstract class PEAStoreFactory {

}

class WebPEAStoreFactory extends PEAStoreFactory {

}

class CommandLinePEAStoreFactory extends PEAStoreFactory {

}

class DependencyPEAStoreFactory extends PEAStoreFactory {

}