import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

abstract class AModuleAutomationObject implements ModuleAutomationObject {
    protected dataSourceIdentifier: string;
    protected initialized: boolean;
    protected metaModelRef: string;
    protected name: string;
    protected pimadIdentifier: string;
    protected responseHandler: PiMAdResponseHandler;

    getDataSourceIdentifier(callback: (response: Backbone.PiMAdResponse, identifier: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.dataSourceIdentifier);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.dataSourceIdentifier);
        }
    };

    getMetaModelRef(callback: (response: Backbone.PiMAdResponse, metaModelRef: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.metaModelRef);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.metaModelRef);
        }
    };

    getName(callback: (response: Backbone.PiMAdResponse, name: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.name);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.name);
        }
    };

    getPiMAdIdentifier(callback: (response: Backbone.PiMAdResponse, identifier: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.pimadIdentifier);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.pimadIdentifier);
        }
    };

    constructor() {
        this.dataSourceIdentifier = 'dataSourceIdentifier: undefined';
        this.name='name: undefined';
        this.initialized = false;
        this.metaModelRef = 'metaModelRef: undefined';
        this.pimadIdentifier = 'pimadIdentifier: undefined';
        this.responseHandler = new PiMAdResponseHandler();
    }
}

interface ModuleAutomationObject {
    /**
     * Getter for this.dataSourceIdentifier. This variable contains the identifier of the previous data source. It's
     * mostly for debugging purpose and an assembling reference while importing the data.
     * @param callback - Accessing the identifier via callback function.
     */
    getDataSourceIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void;

    /**
     * Getter for this.name. The name of this instance.
     * @param callback - Accessing the name via callback function.
     */
    getName(callback: (response: PiMAdResponse, name: string) => void): void;

    /**
     * Getter for this.pimadIdentifier. A unique identifier in the PiMAd-core data model. Use this one while
     * interacting with PiMAd-objects.
     * @param callback - Accessing the identifier via callback function.
     */
    getPiMAdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void;

    /**
     * Getter for this.metaModelRef. It's a link to the meta model description of the instance.
     * @param callback - Accessing the meta model reference via callback function.
     */
    getMetaModelRef(callback: (response: PiMAdResponse, metaModelRef: string) => void): void;
}
