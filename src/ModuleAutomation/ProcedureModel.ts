import {logger} from '../Utils';
import {Parameter} from './Parameter';
import {Attribute} from './Attribute';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import {ModuleAutomation} from './DataAssemblyModel';
import DataAssembly = ModuleAutomation.DataAssembly;
import {
    AModuleAutomationObject,
    InitializeModuleAutomationObject,
    ModuleAutomationObject
} from './ModuleAutomationObject';

export interface ProcedureModel extends ModuleAutomationObject {

    /**
     * TODO
     * @param callback - TODO
     * @returns TODO
     */
    getAttribute(name: string, callback: (response: PiMAdResponse, attribute: Attribute) => void): void;

    /**
     * TODO
     * @param callback - TODO
     * @returns TODO
     */
    getAllAttributes(callback: (response: PiMAdResponse, attributes: Attribute[]) => void): void;

    /**
     * TODO
     * @param callback - TODO
     * @returns TODO
     */
    getAllParameters(callback: (response: PiMAdResponse, parameters: Parameter[]) => void): void;

    /**
     * TODO
     * @param callback - TODO
     * @returns TODO
     */
    getDataAssembly(callback: (response: PiMAdResponse, dataAssembly: DataAssembly) => void): void;

    /**
     * TODO
     * @param callback - TODO
     * @returns TODO
     */
    getParameter(name: string, callback: (response: PiMAdResponse, parameter: Parameter) => void): void;

    /**
     * Initialize the parameter object with data. This one works like a constructor.
     * @param instructions - TODO
     * @returns True for a successful initialisation. False for a not successful initialisation.
     */
    initialize(instructions: InitializeProcedureType): boolean;
}

export abstract class AProcedure extends AModuleAutomationObject implements ProcedureModel {

    protected attributes: Attribute[];
    protected dataAssembly: DataAssembly;
    protected parametersOld: Parameter[];
    protected parameters: DataAssembly[];


    constructor() {
        super();
        this.attributes = [];
        this.dataAssembly = {} as DataAssembly;
        this.metaModelRef = 'metaModelRef: not initialized';
        this.name = 'name: not initialized';
        this.parametersOld = [];
        this.parameters = [];

        this.initialized = false;
    }

    /**
     * @inheritDoc {@link Parameter.getAttribute}
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
     * @inheritDoc {@link Parameter.getAllAttributes}
     */
    getAllAttributes(callback: (response: PiMAdResponse, attributes: Attribute[]) => void): void {
        this.genericPiMAdGetter<Attribute[]>(this.attributes, callback);
    }

    /**
     * @inheritDoc {@link Parameter.getAllParameters}
     */
    getAllParameters(callback: (response: PiMAdResponse, parameters: Parameter[]) => void): void {
        this.genericPiMAdGetter<Parameter[]>(this.parametersOld, callback);
    }

    /**
     * @inheritDoc {@link Parameter.getDataAssembly}
     */
    getDataAssembly(callback: (response: PiMAdResponse, dataAssembly: DataAssembly) => void): void {
        this.genericPiMAdGetter<DataAssembly>(this.dataAssembly, callback);
    }

    /**
     *  @inheritDoc {@link Parameter.getParameter}
     */
    getParameter(name: string, callback: (response: PiMAdResponse, parameter: Parameter) => void): void {
        const localParameter: Parameter | undefined = this.parametersOld.find(parameter => name === parameter.getName());
        if(localParameter === undefined) {
            this.genericPiMAdGetter<Parameter>({} as Parameter, callback);
        } else {
            this.genericPiMAdGetter<Parameter>(localParameter, callback);
        }
    }

    /**
     * @inheritDoc {@link Parameter.initialize}
     */
    initialize(instructions: InitializeProcedureType): boolean {
        if(!this.initialized) {
            this.attributes = instructions.attributes;
            this.dataAssembly = instructions.dataAssembly;
            this.parameters = instructions.parameter;
            // TODO why is this check necessary
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
    }
}

export type InitializeProcedureType = InitializeModuleAutomationObject & {
    attributes: Attribute[];
    dataAssembly: DataAssembly;
    parameter: DataAssembly[];
}

class BaseProcedure extends AProcedure {
}

export interface ProcedureFactory {
    create(): ProcedureModel;
}
abstract class AProcedureFactory implements ProcedureFactory {
    abstract create(): ProcedureModel;
}
export class BaseProcedureFactory extends AProcedureFactory {
    create(): ProcedureModel {
        const procedure = new BaseProcedure();
        logger.debug(this.constructor.name + ' creates a ' + procedure.constructor.name);
        return procedure;
    }
}
