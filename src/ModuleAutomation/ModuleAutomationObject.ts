import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

export type InitializeModuleAutomationObject = {
    dataSourceIdentifier?: string;
    defaultValue?: string;
    description?: string;
    metaModelRef?: string;
    name: string;
    pimadIdentifier: string;
    value?: string;

}

export abstract class AModuleAutomationObject implements ModuleAutomationObject {
    protected dataSourceIdentifier: string;
    protected initialized: boolean;
    protected metaModelRef: string;
    protected name: string;
    protected pimadIdentifier: string;
    protected responseHandler: PiMAdResponseHandler;
    protected defaultValue: string;
    protected description: string;
    protected value: string;

    getDataSourceIdentifier(callback: (response: Backbone.PiMAdResponse, identifier: string) => void): void {
        this.genericPiMAdGetter<string>(this.dataSourceIdentifier, callback);
    }

    getMetaModelRef(callback: (response: Backbone.PiMAdResponse, metaModelRef: string) => void): void {
        this.genericPiMAdGetter<string>(this.metaModelRef, callback);
    }

    getName(callback: (response: Backbone.PiMAdResponse, name: string) => void): void {
        this.genericPiMAdGetter<string>(this.name, callback);
    }

    getPiMAdIdentifier(callback: (response: Backbone.PiMAdResponse, identifier: string) => void): void {
        this.genericPiMAdGetter<string>(this.pimadIdentifier, callback);
    }

    protected genericPiMAdGetter<DataType>(data: DataType , callback: (response: Backbone.PiMAdResponse, responseGetter: DataType) => void): void {
        if(this.initialized) {
            if(JSON.stringify(data) === '{}') {
                callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'Data is empty.', {}), data);
            } else {
                callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), data);
            }
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), data);
        }
    }

    protected moduleAutomationObjectInitialize(instructions: InitializeModuleAutomationObject): boolean {
        // WP
        if(instructions.dataSourceIdentifier != undefined) this.dataSourceIdentifier = instructions.dataSourceIdentifier;
        if(instructions.metaModelRef != undefined) this.metaModelRef = instructions.metaModelRef;
        if(instructions.value != undefined) this.value = instructions.value;
        if(instructions.defaultValue != undefined) this.defaultValue = instructions.defaultValue;
        if(instructions.description != undefined) this.description = instructions.description;

        this.name = instructions.name;
        this.pimadIdentifier = instructions.pimadIdentifier;
        //TODO: e.g. TAGName doesn't has datasourceidentifier...
        return (
            //this.dataSourceIdentifier === instructions.dataSourceIdentifier &&
           // this.metaModelRef === instructions.metaModelRef &&
            this.name === instructions.name &&
            this.pimadIdentifier === instructions.pimadIdentifier
        );
    }

    constructor() {
        this.dataSourceIdentifier = 'dataSourceIdentifier: undefined';
        this.name='name: undefined';
        this.defaultValue = 'defaultValue: undefined';
        this.value = 'value: undefined';
        this.description = 'description: undefined';
        this.initialized = false;
        this.metaModelRef = 'metaModelRef: undefined';
        this.pimadIdentifier = 'pimadIdentifier: undefined';
        this.responseHandler = new PiMAdResponseHandler();
    }
}

export interface ModuleAutomationObject {
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
