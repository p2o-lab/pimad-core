import {Response, ResponseHandler, ResponseVendor, ResponseTypes} from '../Backbone/Response';
import {PEA} from '../ModuleAutomation/PEA';
import {Importer} from '../Converter/Importer/Importer';
import {logger} from '../Utils/Logger';
import * as crypto from 'crypto';

abstract class APEAPool implements PEAPool {
    private initialized: boolean;
    protected importerChainFirstElement: Importer;
    protected peas: PEA[];
    protected responseVendor: ResponseVendor;
    protected responseHandler: ResponseHandler;

    constructor() {
        this.initialized = false;
        this.peas = [];
        this.importerChainFirstElement = {} as Importer;
        this.responseVendor = new ResponseVendor();
        this.responseHandler = new ResponseHandler();
    }

    private generateUniqueIdentifier(callback: (identifier: string) => void): void {
        const identifier = crypto.randomBytes(16).toString('hex');
        this.getPEA(identifier, response => {
            if(response.constructor.name === this.responseVendor.buyErrorResponse().constructor.name) {
                callback(identifier);
            } else {
                this.generateUniqueIdentifier(callback)
            }
        })
    }

    public initialize(firstChainElement: Importer): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.importerChainFirstElement = firstChainElement;
            return (JSON.stringify(this.importerChainFirstElement) == JSON.stringify(firstChainElement))
        } else {
            return false;
        }
    }

    public addPEA(instructions: {source: string}, callback: (response: Response) => void): void {
        if(this.initialized) {
            this.generateUniqueIdentifier(identifier => {
                this.importerChainFirstElement.convertFrom({
                    source: instructions.source,
                    identifier: identifier
                }, callback);
            })
        } else {
            this.responseHandler.handleCallbackWithResponse(ResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    };

    public deletePEA(identifier: string, callback: (response: Response) => void): void {
        if(this.initialized) {
            this.responseHandler.handleCallbackWithResponse(ResponseTypes.ERROR, '', {}, callback);
        } else {
            this.responseHandler.handleCallbackWithResponse(ResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    };

    public getPEA(identifier: string, callback: (response: Response) => void): void {
        if(this.initialized) {
            const localPEA: PEA | undefined = this.peas.find(pea => identifier === pea.getPiMAdIdentifier());
            if (localPEA === undefined)  {
                this.responseHandler.handleCallbackWithResponse(ResponseTypes.ERROR, 'PEA <' + identifier + '> is not part of the pool party!', {}, callback);
            } else {
                this.responseHandler.handleCallbackWithResponse(ResponseTypes.SUCCESS, 'Success!', localPEA, callback);
            }
        } else {
            this.responseHandler.handleCallbackWithResponse(ResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    };
}

export class BasePEAPool extends APEAPool {

}

interface PEAPool {
    addPEA(instructions: object, callback: (response: Response) => void): void;
    deletePEA(identifier: string, callback: (response: Response) => void): void;
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