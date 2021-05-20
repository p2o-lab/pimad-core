import {FEA} from './FEA';
import {ServiceModel} from './ServiceModel';
import {Backbone, BasicSemanticVersion, SemanticVersion} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;
import {ModuleAutomation} from './DataAssemblyModel';
import DataAssembly = ModuleAutomation.DataAssembly;
import {AML} from '@p2olab/pimad-types';
import Attribute = AML.Attribute;

export interface PEAModel {
    /**
     * NOT YET IMPLEMENTED
     * Get a specific actuator of the PEAModel object.
     * @param tag - The tag of the actuator.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getActuator(tag: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * NOT YET IMPLEMENTED
     * Getter for all actuators  within this.dataAssemblies of the PEAModel object.
     * @returns A response object.
     */
    getAllActuators(callback: (response: PiMAdResponse) => void): void;
    /**
     * Getter for this.dataAssemblies of the PEAModel object.
     * @returns A response object.
     */
    getAllDataAssemblies(): PiMAdResponse;
    /**
     * Getter for this.feas of the PEAModel object.
     * @returns A response object.
     */
    getAllFEAs(): PiMAdResponse;
    /**
     * NOT YET IMPLEMENTED
     * Getter for all sensors within this.dataAssemblies of the PEAModel object.
     * @returns A response object.
     */
    getAllSensors(callback: (response: PiMAdResponse) => void): void;
    /**
     * Getter for this.services of the PEAModel object.
     * @returns A response object.
     */
    getAllServices(): PiMAdResponse;
    /**
     * Getter for this.dataModel of the PEAModel object.
     * @returns A response object.
     */
    getDataModel(): PiMAdResponse;
    /**
     * Getter for this.dataModelVersion of the PEAModel object.
     * @returns A response object.
     */
    getDataModelVersion(): PiMAdResponse;
    /**
     * Get a specific dataAssembly of the PEAModel object.
     * @param tag - The tag of the dataAssembly.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getDataAssembly(tag: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * NOT YET IMPLEMENTED
     * Get a specific FEA of the PEAModel object.
     * @param tag - The tag of the FEA.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getFEA(tag: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * Getter for this.identifier of the PEAModel object.
     * @returns The identifier of the PEAModel.
     */
    getPiMAdIdentifier(): string;
    /**
     * Getter for this.name of the PEAModel object.
     * @returns The name of the PEAModel..
     */
    getName(): string;
    /**
     * NOT YET IMPLEMENTED
     * Get a specific sensor of the PEAModel object.
     * @param tag - The tag of the sensor.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getSensor(tag: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * Get a specific service of the PEAModel object.
     * @param identifier - The PiMAd-identifier of the service.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getService(identifier: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * Initialize the PEAModel object with data. This one works like a constructor.
     * @param data - Various data for initialization of the PEAModel.
     * @returns True for a successful initialisation. False for a not successful initialisation.
     * */
    initialize(data: PEAInitializeDataType): boolean;
}

abstract class APEA implements PEAModel {
    protected dataAssemblies: DataAssembly[];
    protected dataModel: string; // PiMAd-core DataModel
    protected dataModelVersion: SemanticVersion;
    protected feas: FEA[];
    protected pimadIdentifier: string;
    protected name: string;
    protected responseHandler: PiMAdResponseHandler;
    protected responseVendor: PiMAdResponseVendor;
    protected services: ServiceModel[];
    protected endpoint: {};
    protected initialized: boolean;

    constructor() {
        this.dataAssemblies = [];
        this.dataModel = '';
        this.dataModelVersion = new BasicSemanticVersion();
        this.feas = [];
        this.name = 'name: undefined';
        this.endpoint = {};
        this.pimadIdentifier = 'identifier: undefined';
        this.responseHandler = new PiMAdResponseHandler();
        this.responseVendor = new PiMAdResponseVendor();
        this.services = [];
        this.initialized = false;
    }

    getActuator(tag: string, callback: (response: PiMAdResponse) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    }
    getAllActuators(callback: (response: PiMAdResponse) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    }
    getAllDataAssemblies(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data:this.dataAssemblies});
        return response;
    }
    getAllFEAs(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.feas});
        return response;
    }
    getAllSensors(callback: (response: PiMAdResponse) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    }
    getAllServices(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.services});
        return response;
    }
    getDataAssembly(tag: string, callback: (response: PiMAdResponse) => void): void {
        this.dataAssemblies.forEach((dataAssembly: DataAssembly) => {
            dataAssembly.getName((response, name) => {
                if(name === tag) {
                    this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.SUCCESS, 'Success!', dataAssembly, callback);
                }
                if(dataAssembly === this.dataAssemblies[this.dataAssemblies.length -1]) {
                    this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'Could not find dataAssembly <' + tag + '> in PEAModel <' + this.name + '>', {}, callback);
                }
            });
        });
    }
    getDataModel(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.dataModel});
        return response;
    }
    getDataModelVersion(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.dataModelVersion});
        return response;
    }
    getFEA(tag: string, callback: (response: PiMAdResponse) => void): void {
        this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, '', {}, callback);
    }
    getPiMAdIdentifier(): string {
        return this.pimadIdentifier;
    }
    getName(): string {
        return this.name;
    }
    getSensor(tag: string, callback: (response: PiMAdResponse) => void): void {
        this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, '', {}, callback);
    }
    getService(identifier: string, callback: (response: PiMAdResponse) => void): void {
        const localService: ServiceModel | undefined = this.services.find(service => {
                let testCondition = false;
                service.getPiMAdIdentifier((response, pimadIdentifier) => {
                    testCondition = (pimadIdentifier === identifier);
                });
                return testCondition;
            }
        );
        /*const localService: ServiceModel | undefined = this.services.find(service =>
            service.getName() === name
        );*/
        if(localService == undefined) {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.ERROR, 'Could not find service <' + identifier + '> in PEAModel <' + this.name + '>', {}, callback);
        } else {
            this.responseHandler.handleCallbackWithResponse(PiMAdResponseTypes.SUCCESS, 'Success!', localService, callback);
        }
    }

    initialize(data: PEAInitializeDataType): boolean {
        if (!this.initialized) {
            this.dataAssemblies = data.DataAssemblies;
            this.dataModel = data.DataModel;
            this.dataModelVersion = data.DataModelVersion;
            this.feas = data.FEAs;
            this.pimadIdentifier = data.PiMAdIdentifier;
            this.name = data.Name;
            this.services = data.Services;
            this.endpoint = data.Endpoint;
            this.initialized = (JSON.stringify(this.dataAssemblies) === JSON.stringify(data.DataAssemblies) &&
                    this.dataModel === data.DataModel &&
                    this.dataModelVersion === data.DataModelVersion &&
                    this.feas === data.FEAs &&
                    this.name === data.Name &&
                    this.pimadIdentifier != undefined &&
                    JSON.stringify(this.services) === JSON.stringify(data.Services)
            );
            return this.initialized;
        } else {
            return false;
        }
    }
}

class BasePEA extends APEA {

}

/* Factories */
abstract class APEAFactory implements PEAFactory {
    abstract create(): PEAModel;
}

export class BasePEAFactory extends APEAFactory {
    create(): PEAModel {
        return new BasePEA();
    }
}

export interface PEAFactory {
    create(): PEAModel;
}

export type PEAInitializeDataType = {
    /**
     * The data assembly of the PEAModel object.. F. ex. with the communication interface data.
     */
    DataAssemblies: DataAssembly[];
    /**
     * A reference to a data-model describing the PEAModel object.
     */
    DataModel: string; // PiMAd-core DataModel
    /**
     * A reference to a data-model describing the PEAModel object.
     */
    DataModelVersion: SemanticVersion;
    /**
     * The identifier for the PiMAd-Database.
     */
    PiMAdIdentifier: string;
    /**
     * An Array with the PEAModel related FEAs.
     */
    FEAs: FEA[];
    /**
     * The name of the PEAModel object.
     */
    Name: string;
    /**
     * An Array with the PEAModel related Services.
     */
    Services: ServiceModel[];
    /**
     * OPCUAServerURL
     */
    Endpoint: {};
}
