import {Response, ResponseVendor} from '../Backbone/Response'
import {PEA} from '../ModuleAutomation/PEA'
import {Importer} from '../Converter/Importer'

abstract class APEAPool implements PEAPool {
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

export class BasePEAPool extends APEAPool {
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

interface PEAPool {
    addPEA(any: object): Response;
    deletePEA(tag: string): Response;
    getPEA(tag: string): Response;
    initialize(firstChainElement: Importer): boolean;
}

/* Factory */

abstract class APEAPoolFactory implements PEAPoolFactory {
    abstract create(): PEAPool;
}

export class DependencyPEAPoolFactory extends APEAPoolFactory {
    create(): PEAPool {
        return new BasePEAPool();
    };
}

interface PEAPoolFactory {
    create(): PEAPool;
}

/* Vendor */

export class PEAPoolVendor {

    private dependencyPEAPoolFactory: DependencyPEAPoolFactory;

    constructor() {
        this.dependencyPEAPoolFactory = new DependencyPEAPoolFactory();
    }
    buyDependencyPEAPool(): PEAPool {
        return new  BasePEAPool();
    }
}