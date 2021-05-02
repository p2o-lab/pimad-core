import {PEA} from '../ModuleAutomation';
import {Importer, LastChainElementImporterFactory, MTPFreeze202001ImporterFactory} from '../Converter/Importer/Importer';
import {logger} from '../Utils';
import { v4 as uuidv4 } from 'uuid';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

abstract class APEAPool implements PEAPool {
    private initialized: boolean;
    protected importerChainFirstElement: Importer;
    protected peas: PEA[];
    protected responseVendor: PiMAdResponseVendor;
    protected responseHandler: PiMAdResponseHandler;

    constructor() {
        this.initialized = false;
        this.peas = [];
        this.importerChainFirstElement = {} as Importer;
        this.responseVendor = new PiMAdResponseVendor();
        this.responseHandler = new PiMAdResponseHandler();
    }

    private generateUniqueIdentifier(callback: (identifier: string) => void): void {
        const identifier = uuidv4();
        this.getPEA(identifier, response => {
            if(response.constructor.name === this.responseVendor.buyErrorResponse().constructor.name) {
                callback(identifier);
            } else {
                this.generateUniqueIdentifier(callback);
            }
        });
    }

    public initialize(firstChainElement: Importer): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.importerChainFirstElement = firstChainElement;
            return (JSON.stringify(this.importerChainFirstElement) == JSON.stringify(firstChainElement));
        } else {
            return false;
        }
    }

    public initializeMTPFreeze202001Importer(): boolean{
        if (!this.initialized) {
            this.initialized = true;
            const fImporter = new LastChainElementImporterFactory();
            const mtpFreeze202001Importer = new MTPFreeze202001ImporterFactory().create();
            mtpFreeze202001Importer.initialize(fImporter.create());
            this.importerChainFirstElement = mtpFreeze202001Importer;
            return true;
        } else {
            return false;
        }
    }

    public addPEA(instructions: {source: string}, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            this.generateUniqueIdentifier(identifier => {
                this.importerChainFirstElement.convertFrom({source: instructions.source, identifier: identifier}, (response) => {
                    if(response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                        this.peas.push(response.getContent() as PEA);
                        callback(response);
                    } else {
                        callback(response);
                    }
                });
            });
        } else {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    }

    public deletePEA(identifier: string, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            // find pea by id
            const localPEA: PEA | undefined  = this.peas.find(pea => identifier === pea.getPiMAdIdentifier());
            // find index of pea
            const index = this.peas.indexOf(localPEA as PEA,0);
            if (index > -1) {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.SUCCESS, 'Success!', {}, callback);
            }else {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'Index of PEA is lower than 0!', {}, callback);
            }
        } else {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    }

    public getPEA(identifier: string, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            const localPEA: PEA | undefined = this.peas.find(pea => identifier === pea.getPiMAdIdentifier());
            if (localPEA === undefined)  {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEA <' + identifier + '> is not part of the pool party!', {}, callback);
            } else {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.SUCCESS, 'Success!', localPEA, callback);
            }
        } else {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    }

    public getAllPEAs(callback: (response: PiMAdResponse, peas: PEA[]) => void): void {
        //TODO: this.peas already gets passed via callback content, so maybe remove peas param
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success!', this.peas), this.peas);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This PEAPool is not initialized', {}), []);
        }
    }
}

class BasePEAPool extends APEAPool {

}

export interface PEAPool {
    addPEA(instructions: object, callback: (response: PiMAdResponse) => void): void;
    deletePEA(identifier: string, callback: (response: PiMAdResponse) => void): void;
    getPEA(identifier: string, callback: (response: PiMAdResponse) => void): void;
    getAllPEAs(callback: (response: PiMAdResponse, peas: PEA[]) => void): void;
    initialize(firstChainElement: Importer): boolean;
    initializeMTPFreeze202001Importer(): boolean;
}

/* Factory */

abstract class APEAPoolFactory implements PEAPoolFactory {
    abstract create(): PEAPool;
}

class BasePEAPoolFactory extends APEAPoolFactory {
    create(): PEAPool {
        logger.debug('BasePEAPool generated via Factory');
        return new BasePEAPool();
    }
}

export interface PEAPoolFactory {
    create(): PEAPool;
}

/* Vendor */

export class PEAPoolVendor {

    private dependencyPEAPoolFactory: BasePEAPoolFactory;

    constructor() {
        this.dependencyPEAPoolFactory = new BasePEAPoolFactory();
    }
    buyDependencyPEAPool(): PEAPool {
        return this.dependencyPEAPoolFactory.create();
    }
}
