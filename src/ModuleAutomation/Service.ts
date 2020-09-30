import {Parameter} from './Parameter';
import {logger} from '../Utils';
import {Procedure} from './Procedure';
import { Attribute } from './Attribute';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import {ModuleAutomation} from './DataAssembly';
import DataAssembly = ModuleAutomation.DataAssembly;
import {AModuleAutomationObject, ModuleAutomationObject} from './ModuleAutomationObject';

export interface Service extends ModuleAutomationObject {
    /**
     * Get a specific attribute of the service object.
     * @param name - The name of the attribute.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getAttribute(name: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * Getter for this.attributes of the service object.
     * @returns A response object.
     */
    getAllAttributes(): PiMAdResponse;
    /**
     * Getter for this.procedures of the service object.
     * @returns A response object.
     */
    getAllProcedures(): PiMAdResponse;
    /**
     * Getter for this.parameters of the service object.
     * @returns A response object.
     */
    getAllParameters(): PiMAdResponse;
    /**
     * Getter for this.dataAssembly of the service object.
     * @returns A response object.
     */
    getDataAssembly(): PiMAdResponse;

    /**
     * Get a specific parameter of the service object.
     * @param name - The name of the attribute.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getParameter(name: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * Get a specific procedure of the service object.
     * @param name - The name of the procedure.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getProcedure(name: string, callback: (response: PiMAdResponse) => void): void;
    /**
     * Initialize the service object with data. This one works like a constructor.
     * @param attributes - An Array with attributes of the service object..
     * @param dataAssembly - The data assembly of the service object.. F. ex. with the communication interface data.
     * @param dataSourceIdentifier - This variable stores the local identifier of the previous data source.
     * @param metaModelRef - A reference to a metamodel describing the service object.
     * @param name - The name of the service object.
     * @param parameter - An Array with service parameters.
     * @param pimadIdentifier - A unique identifier in the PiMAd-core data model.
     * @param procedure - An Array with service procedures.
     * @returns True for a successful initialisation. False for a not successful initialisation.
     */
    initialize(attributes: Attribute[], dataAssembly: DataAssembly, dataSourceIdentifier: string, metaModelRef: string, name: string, parameter: Parameter[], pimadIdentifier: string, procedure: Procedure[]): boolean;
}

abstract class AService extends AModuleAutomationObject implements Service {
    protected attributes: Attribute[];
    protected dataAssembly: DataAssembly;
    protected procedures: Procedure[];
    protected parameters: Parameter[];
    protected responseVendor: PiMAdResponseVendor; // TODO > in future deprecated

    constructor() {
        super();
        this.attributes = [];
        this.dataAssembly = {} as DataAssembly;
        //this.identifier = 'identifier: not initialized';
        this.metaModelRef = 'metaModelRef: not initialized';
        this.name = 'name: not initialized';
        this.procedures = [];
        this.parameters = [];
        this.initialized = false;
        this.responseVendor = new PiMAdResponseVendor();
    };

    getAttribute(name: string, callback: (response: PiMAdResponse) => void): void {
        this.attributes.forEach((attribute: Attribute) => {
            if((attribute.getName().getContent() as {data: string}).data === name) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', attribute);
                callback(response);
            }
            if(attribute === this.attributes[this.attributes.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find attribute <' + name + '> in service <' + this.name + '>', {});
                callback(response);
            }
        });
    }

    getAllAttributes(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.attributes});
        return response;
    };

    getAllProcedures(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.procedures});
        return response;
    }

    getAllParameters(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.parameters});
        return response;
    }

    getDataAssembly(): PiMAdResponse {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.dataAssembly});
        return response;
    };

    getParameter(name: string, callback: (response: PiMAdResponse) => void): void {
        this.parameters.forEach((parameter: Parameter) => {
            if(parameter.getName() === name) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', parameter);
                callback(response);
            }
            if(parameter === this.parameters[this.parameters.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find attribute <' + parameter.getName() + '> in service <' + this.name + '>', {});
                callback(response);
            }
        });
    };

    getProcedure(name: string, callback: (response: PiMAdResponse) => void): void {
        this.procedures.forEach((procedure: Procedure) => {
            if(procedure.getName() === name) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', procedure);
                callback(response);
            }
            if(procedure === this.procedures[this.procedures.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find procedure <' + procedure.getName() + '> in service <' + this.name + '>', {});
                callback(response);
            }
        });
    }

    initialize(attributes: Attribute[], dataAssembly: DataAssembly, dataSourceIdentifier: string, metaModelRef: string, name: string, parameter: Parameter[], pimadIdentifier: string, procedure: Procedure[]): boolean {
        if(!this.initialized) {
            this.attributes = attributes;
            this.dataAssembly = dataAssembly;
            this.dataSourceIdentifier = dataSourceIdentifier;
            this.metaModelRef = metaModelRef;
            this.name = name;
            this.parameters = parameter;
            this.pimadIdentifier = pimadIdentifier;
            this.procedures = procedure;
            this.initialized = (JSON.stringify(this.attributes) === JSON.stringify(attributes) &&
                    JSON.stringify(this.dataAssembly) === JSON.stringify(dataAssembly) &&
                    this.dataSourceIdentifier === dataSourceIdentifier &&
                    this.metaModelRef === metaModelRef &&
                    this.name === name &&
                    JSON.stringify(this.parameters) === JSON.stringify(parameter) &&
                    this.pimadIdentifier === pimadIdentifier &&
                    JSON.stringify(this.procedures) === JSON.stringify(procedure)
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}

class BaseService extends AService {

}

export interface ServiceFactory {
    create(): Service;
}

abstract class AServiceFactory implements ServiceFactory {
    abstract create(): Service;
}

export class BaseServiceFactory extends AServiceFactory {
    create(): Service{
        const service = new BaseService();
        logger.debug(this.constructor.name + ' creates a ' + service.constructor.name);
        return service;
    }
}
