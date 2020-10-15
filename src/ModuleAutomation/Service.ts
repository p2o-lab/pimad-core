import {Parameter} from './Parameter';
import {logger} from '../Utils';
import {Procedure} from './Procedure';
import {Attribute} from './Attribute';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import {ModuleAutomation as ModuleAutomationNamespace } from './DataAssembly';
import DataAssembly = ModuleAutomationNamespace.DataAssembly;
import {AModuleAutomationObject, ModuleAutomationObject} from './ModuleAutomationObject';

abstract class AService extends AModuleAutomationObject implements Service {
    protected attributes: Attribute[];
    protected dataAssembly: DataAssembly;
    protected procedures: Procedure[];
    protected parameters: Parameter[];

    constructor() {
        super();
        this.attributes = [];
        this.dataAssembly = {} as DataAssembly;
        this.metaModelRef = 'metaModelRef: not initialized';
        this.name = 'name: not initialized';
        this.procedures = [];
        this.parameters = [];
        this.initialized = false;
    };

    /**
     * @inheritDoc {@link Service.getAttribute}
     */
    getAttribute(name: string, callback: (response: PiMAdResponse, attribute: Attribute) => void): void {
        const localAttribute: Attribute | undefined = this.attributes.find(attribute => (attribute.getName().getContent() as {data: string}).data === name);
        if(localAttribute === undefined) {
            this.genericPiMAdGetter<Attribute>({} as Attribute, callback);
        } else {
            this.genericPiMAdGetter<Attribute>(localAttribute, callback);
        }
    }

    /**
     * @inheritDoc {@link Service.getAllAttributes}
     */
    getAllAttributes(callback: (response: PiMAdResponse, attributes: Attribute[]) => void): void {
        this.genericPiMAdGetter<Attribute[]>(this.attributes, callback);
    };

    /**
     * @inheritDoc {@link Service.getAllProcedures}
     */
    getAllProcedures(callback: (response: PiMAdResponse, procedures: Procedure[]) => void): void {
        this.genericPiMAdGetter<Procedure[]>(this.procedures, callback);
    }

    /**
     * @inheritDoc {@link Service.getAllParameters}
     */
    getAllParameters(callback: (response: PiMAdResponse, parameters: Parameter[]) => void): void {
        this.genericPiMAdGetter<Parameter[]>(this.parameters, callback);
    }

    /**
     * @inheritDoc {@link Service.getDataAssembly}
     */
    getDataAssembly(callback: (response: PiMAdResponse, dataAssembly: DataAssembly) => void): void {
        this.genericPiMAdGetter<DataAssembly>(this.dataAssembly, callback);
    };

    /**
     *  @inheritDoc {@link Service.getParameter}
     */
    getParameter(name: string, callback: (response: PiMAdResponse, parameter: Parameter) => void): void {
        const localParameter: Parameter | undefined = this.parameters.find(parameter => name === parameter.getName());
        if(localParameter === undefined) {
            this.genericPiMAdGetter<Parameter>({} as Parameter, callback);
        } else {
            this.genericPiMAdGetter<Parameter>(localParameter, callback);
        }
    };

    /**
     *  @inheritDoc {@link Service.getProcedure}
     */
    getProcedure(name: string, callback: (response: PiMAdResponse, procedure: Procedure) => void): void {
        const localProcedure: Procedure | undefined = this.procedures.find(procedure => name === procedure.getName());
        if(localProcedure === undefined) {
            this.genericPiMAdGetter<Procedure>({} as Procedure, callback);
        } else {
            this.genericPiMAdGetter<Procedure>(localProcedure, callback);
        }
    }

    /**
     * @inheritDoc {@link Service.initialize}
     */
    initialize(instructions: InitializeServiceType): boolean {
        if(!this.initialized) {
            this.attributes = instructions.attributes;
            this.dataAssembly = instructions.dataAssembly;
            this.dataSourceIdentifier = instructions.dataSourceIdentifier;
            this.metaModelRef = instructions.metaModelRef;
            this.name = instructions.name;
            this.parameters = instructions.parameter;
            this.pimadIdentifier = instructions.pimadIdentifier;
            this.procedures = instructions.procedure;
            this.initialized = (JSON.stringify(this.attributes) === JSON.stringify(instructions.attributes) &&
                    JSON.stringify(this.dataAssembly) === JSON.stringify(instructions.dataAssembly) &&
                    this.dataSourceIdentifier === instructions.dataSourceIdentifier &&
                    this.metaModelRef === instructions.metaModelRef &&
                    this.name === instructions.name &&
                    JSON.stringify(this.parameters) === JSON.stringify(instructions.parameter) &&
                    this.pimadIdentifier === instructions.pimadIdentifier &&
                    JSON.stringify(this.procedures) === JSON.stringify(instructions.procedure)
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

export type InitializeServiceType = {
    attributes: Attribute[];
    dataAssembly: DataAssembly;
    dataSourceIdentifier: string;
    metaModelRef: string;
    name: string; parameter: Parameter[];
    pimadIdentifier: string; procedure: Procedure[];
}

export interface Service extends ModuleAutomationObject {
    /**
     * Get a specific attribute of the service object.
     * @param name - The name of the attribute.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getAttribute(name: string, callback: (response: PiMAdResponse, attribute: Attribute) => void): void;

    /**
     * Getter for this.attributes of the service object.
     * @returns A response object.
     */
    getAllAttributes(callback: (response: PiMAdResponse, attributes: Attribute[]) => void): void;

    /**
     * Getter for this.procedures of the service object.
     * @returns A response object.
     */
    getAllProcedures(callback: (response: PiMAdResponse, procedures: Procedure[]) => void): void;

    /**
     * Getter for this.parameters of the service object.
     * @returns A response object.
     */
    getAllParameters(callback: (response: PiMAdResponse, parameters: Parameter[]) => void): void;

    /**
     * Getter for this.dataAssembly of the service object.
     * @returns
     */
    getDataAssembly(callback: (response: PiMAdResponse, dataAssembly: DataAssembly) => void): void;

    /**
     * Get a specific parameter of the service object.
     * @param name - The name of the attribute.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getParameter(name: string, callback: (response: PiMAdResponse, parameter: Parameter) => void): void;

    /**
     * Get a specific procedure of the service object.
     * @param name - The name of the procedure.
     * @param callback - A callback function. The response object shows the status (success if object was initialized
     * || error if not initialized or no match) of the function call via the object-type. The procedure-object is the
     * requested data.
     */
    getProcedure(name: string, callback: (response: PiMAdResponse, procedure: Procedure) => void): void;

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
    initialize(instructions: InitializeServiceType): boolean;
}

export enum Services {
    BaseService
}

export class ServiceVendor {
    private baseServiceFactory: BaseServiceFactory;

    buy(serviceType: Services): Service {
        switch (serviceType) {
            case Services.BaseService:
                return this.baseServiceFactory.create();
        }
    }

    constructor() {
        this.baseServiceFactory = new BaseServiceFactory();
    }
}

