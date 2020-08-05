import {Response, ResponseHandler, ResponseVendor} from '../Backbone/Response';
import {PEA} from '../ModuleAutomation/PEA';
import {Importer} from '../Converter/Importer/Importer';
import {logger} from '../Utils/Logger';

abstract class APEAPool implements PEAPool {
    private initialized: boolean;
    protected importerChainFirstElement: Importer | undefined;
    protected peas: PEA[];
    protected responseVendor: ResponseVendor;
    protected responseHandler: ResponseHandler;

    constructor() {
        this.initialized = false;
        this.peas = [];
        this.importerChainFirstElement = undefined;
        this.responseVendor = new ResponseVendor();
        this.responseHandler = new ResponseHandler();
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

    abstract addPEA(instructions: object, callback: (response: Response) => void): void;
    abstract deletePEA(identifier: string): Response;
    getPEA(identifier: string, callback: (response: Response) => void): void {
        const localPEA: PEA | undefined = this.peas.find(pea => identifier === pea.getIdentifier());
        if (localPEA === undefined)  {
            this.responseHandler.handleCallbackWithResponse('error', 'PEA <' + identifier + '> is not part of the pool party!', {}, callback);
        } else {
            this.responseHandler.handleCallbackWithResponse('success', 'Success!', localPEA, callback);
        }
    };
}

export class BasePEAPool extends APEAPool {
    addPEA(any: object) {
        return this.responseVendor.buyErrorResponse();
    }
    deletePEA(tag: string) {
        return this.responseVendor.buyErrorResponse();
    }
}

interface PEAPool {
    addPEA(instructions: object, callback: (response: Response) => void): void;
    deletePEA(identifier: string): Response;
    getPEA(identifier: string, callback: (response: Response) => void): void;
    initialize(firstChainElement: Importer): boolean;
}

/* Factory */

abstract class APEAPoolFactory implements PEAPoolFactory {
    abstract create(): PEAPool;
}

export class BasePEAPoolFactory extends APEAPoolFactory {
    create(): PEAPool {
        logger.debug('BasePEAPool generated via Factory')
        return new BasePEAPool();
    };
}

interface PEAPoolFactory {
    create(): PEAPool;
}

/* Vendor */

export class PEAPoolVendor {

    private dependencyPEAPoolFactory: BasePEAPoolFactory;

    constructor() {
        this.dependencyPEAPoolFactory = new BasePEAPoolFactory();
    }
    buyDependencyPEAPool(): PEAPool {
        return new  BasePEAPool();
    }
}