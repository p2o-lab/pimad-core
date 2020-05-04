import {Response, ResponseVendor} from '../Backbone/Response'
import {PEA} from '../ModuleAutomation/PEA'
import {Importer} from '../Converter/Importer'

abstract class APEAPool implements PEAPool {
    private initialized: boolean;
    protected running: boolean;
    protected importerChainFirstElement: Importer | undefined;
    protected peas: PEA[]
    protected responseVendor: ResponseVendor;

    constructor() {
        this.initialized = false;
        this.running = false;
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
    start(): Response {
        if (!this.running) {
            /* all start logic here */
            console.log('Hello world!');
            this.running = true;
            return this.responseVendor.buySuccessResponse();
        } else {
            return this.responseVendor.buyErrorResponse();
        }
    };
    stop(): Response {
        if (this.running) {
            /* all stop logic here */
            this.running = false;
            return this.responseVendor.buySuccessResponse();
        } else {
            return this.responseVendor.buyErrorResponse();
        }
    };
}

export class WebPEAPool extends APEAPool {
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

export class CommandLinePEAPool extends APEAPool {
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

export class DependencyPEAPool extends APEAPool {
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
    start(): Response;
    stop(): Response;
}

/* Factory */

abstract class APEAPoolFactory implements PEAPoolFactory {
    abstract create(): PEAPool;
}

export class WebPEAPoolFactory extends APEAPoolFactory {
    create(): PEAPool {
        return new WebPEAPool();
    }
}
export class CommandLinePEAPoolFactory extends APEAPoolFactory {
    create(): PEAPool {
        return new CommandLinePEAPool();
    }
}
export class DependencyPEAPoolFactory extends APEAPoolFactory {
    create(): PEAPool {
        return new DependencyPEAPool();
    };
}

interface PEAPoolFactory {
    create(): PEAPool;
}