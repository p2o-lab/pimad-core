import {PEAModel} from '../ModuleAutomation';
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
    protected peas: PEAModel[];
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
                // identifier is already used, so try again
                // TODO: how to test that?
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

    /**
     * Add PEAModel to Pool
     * @param instructions - parsing instructions including the filepath of uploaded file
     * @param callback
     */
    public addPEA(instructions: {source: string}, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            this.generateUniqueIdentifier(identifier => {
                this.importerChainFirstElement.convertFrom({source: instructions.source, identifier: identifier}, (response) => {
                    if(response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                        this.peas.push(response.getContent() as PEAModel);
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

    /**
     * Delete PEAModel from PiMad-Pool by given Identifier
     * @param identifier - individual identifier of PEAModel
     * @param callback - contains Success/Failure message with Reason of Failure
     */
    public deletePEA(identifier: string, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            // find pea by id
            const localPEA: PEAModel | undefined  = this.peas.find(pea => identifier === pea.getPiMAdIdentifier());
            // check if PEA exists
            if(!localPEA) {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEA not found', {}, callback);
            } else{
                // get index of pea
                const index = this.peas.indexOf(localPEA as PEAModel,0);
                // delete PEA
                this.peas.splice(index, 1);
                // check if deletion was successful
                if(this.peas.find(pea => identifier === pea.getPiMAdIdentifier()) == undefined){
                    this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.SUCCESS, 'Success!', {}, callback);
                }else{
                    this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'Deletion was unsuccessful!', {}, callback);
                }
            }
        } else {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    }

    /**
     * Get PEAModel by given Identifier
     * @param identifier - individual identifier of PEAModel
     * @param callback - contains Success/Failure message with Reason of Failure
     */
    public getPEA(identifier: string, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            const localPEA: PEAModel | undefined = this.peas.find(pea => identifier === pea.getPiMAdIdentifier());
            if (localPEA === undefined)  {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEAModel <' + identifier + '> is not part of the pool party!', {}, callback);
            } else {
                this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.SUCCESS, 'Success!', localPEA, callback);
            }
        } else {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'PEAPool is not initialized!', {}, callback);
        }
    }

    /**
     * get All PEAs from PiMad-Pool
     * @param callback
     */
    public getAllPEAs(callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success!', this.peas));
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This PEAPool is not initialized', {}));
        }
    }
}

class BasePEAPool extends APEAPool {

}

/**
 * This interface describes the functions of PEAPool, which can be called from backend
 */
export interface PEAPool {
    addPEA(instructions: object, callback: (response: PiMAdResponse) => void): void;
    deletePEA(identifier: string, callback: (response: PiMAdResponse) => void): void;
    getPEA(identifier: string, callback: (response: PiMAdResponse) => void): void;
    getAllPEAs(callback: (response: PiMAdResponse) => void): void;
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
