import {Response, ResponseVendor} from '../Backbone/Response'
import {PEA} from '../ModuleAutomation/PEA'
import {Importer} from '../Converter/Importer'

abstract class APEAStore implements PEAStore {
    private initialized: boolean;
    protected importerChainFirstElement: Importer | undefined;
    protected peas: PEA[]
    protected responseVendor: ResponseVendor;

    constructor() {
        this.initialized = false;
        this.peas = []
        this.importerChainFirstElement = undefined;
        this.responseVendor = new ResponseVendor();
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
        return this.responseVendor.buyErrorResponse();
    }
    deletePEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
    getPEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
}

export class CommandLinePEAStore extends APEAStore {
    addPEA(any: object) {
        return this.responseVendor.buyErrorResponse();
    }
    deletePEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
    getPEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
}

export class DependencyPEAStore extends APEAStore {
    addPEA(any: object) {
        return this.responseVendor.buyErrorResponse();
    }
    deletePEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
    getPEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
}

interface PEAStore {
    addPEA(any: object): Response;
    deletePEA(tag: string): Response;
    getPEA(tag: string): Response;
    initialize(firstChainElement: Importer): boolean;
}

/* Factory */

abstract class APEAStoreFactory implements PEAStoreFactory {
    abstract create(): PEAStore;
}

export class WebPEAStoreFactory extends APEAStoreFactory {
    create(): PEAStore {
        return new WebPEAStore();
    }
}
export class CommandLinePEAStoreFactory extends APEAStoreFactory {
    create(): PEAStore {
        return new CommandLinePEAStore();
    }
}
export class DependencyPEAStoreFactory extends APEAStoreFactory {
    create(): PEAStore {
        return new DependencyPEAStore();
    };
}

interface PEAStoreFactory {
    create(): PEAStore;
}