import {logger} from '../Utils';
import {Parameter} from './Parameter';
import {Attribute} from './Attribute';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import {ModuleAutomation} from './DataAssembly';
import DataAssembly = ModuleAutomation.DataAssembly;
import {
    AModuleAutomationObject,
    InitializeModuleAutomationObject,
    ModuleAutomationObject
} from './ModuleAutomationObject';

export interface Procedure extends ModuleAutomationObject {

    /**
     * Get all attributes of this procedure.
     */
    //getAllAttributes(): Attribute[];

    /**
     * Get all parameters of this procedure.
     */
    //getAllParameters(): Parameter[];

    /**
     * Get a specific attribute of this procedure.
     * @param name - The name of the attribute.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    //getAttribute(name: string, callback: (response: PiMAdResponse) => void): void;

    /**
     * Get the DataAssembly-object of this procedure.
     */
    //getDataAssembly(): DataAssembly;

    /**
     * Get the identifier of this procedure.
     */
    //getIdentifier(): string;

    /**
     * Get the metamodel reference of this procedure.
     */
    //getMetaModelRef(): string;

    /**
     * Get the name of this procedure.
     */
    //getName(): string;

    /**
     * Get a specific parameter of this procedure.
     * @param name - The name of the parameter.
     * @param callback - A callback function. Use an instance of the interface PiMAd-core/src/Backbone/Response as input.
     */
    //getParameter(name: string, callback: (response: PiMAdResponse) => void): void;
    //initialize(dataAssembly: DataAssembly, identifier: string, metaModelRef: string, name: string, attributes: Attribute[], para: Parameter[]): boolean;
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
    initialize(instructions: InitializeProcedureType): boolean;
}

export abstract class AProcedure extends AModuleAutomationObject implements Procedure {

    protected attributes: Attribute[];
    protected dataAssembly: DataAssembly;
    protected parameters: Parameter[];

    constructor() {
        super();
        this.attributes = [];
        this.dataAssembly = {} as DataAssembly;
        this.metaModelRef = 'metaModelRef: not initialized';
        this.name = 'name: not initialized';
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
     * @inheritDoc {@link Service.initialize}
     */
    initialize(instructions: InitializeProcedureType): boolean {
        if(!this.initialized) {
            this.attributes = instructions.attributes;
            this.dataAssembly = instructions.dataAssembly;
            this.parameters = instructions.parameter;
            this.initialized = (JSON.stringify(this.attributes) === JSON.stringify(instructions.attributes)
                && JSON.stringify(this.dataAssembly) === JSON.stringify(instructions.dataAssembly)
                && JSON.stringify(this.parameters) === JSON.stringify(instructions.parameter)
                && this.moduleAutomationObjectInitialize({
                    dataSourceIdentifier: instructions.dataSourceIdentifier,
                    metaModelRef: instructions.metaModelRef,
                    name: instructions.name,
                    pimadIdentifier: instructions.pimadIdentifier
                })
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}

export type InitializeProcedureType = InitializeModuleAutomationObject & {
    attributes: Attribute[];
    dataAssembly: DataAssembly;
    parameter: Parameter[];
}

class BaseProcedure extends AProcedure {
}

export interface ProcedureFactory {
    create(): Procedure;
}
abstract class AProcedureFactory implements ProcedureFactory {
    abstract create(): Procedure;
}
export class BaseProcedureFactory extends AProcedureFactory {
    create(): Procedure {
        const procedure = new BaseProcedure();
        logger.debug(this.constructor.name + ' creates a ' + procedure.constructor.name);
        return procedure;
    }
}
