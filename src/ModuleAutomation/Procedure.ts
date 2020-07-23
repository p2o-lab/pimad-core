import {logger} from '../Utils/Logger';
import {Parameter} from './Parameter';
import {DataAssembly} from './DataAssembly';
import { Attribute } from 'AML';
import {Response, ResponseVendor} from '../Backbone/Response';

export interface Procedure {
    getAllAttributes(): Attribute[];
    getAllParameters(): Parameter[];
    getAttribute(name: string, callback: (response: Response) => void): void;
    getDataAssembly(): DataAssembly;
    getIdentifier(): string;
    getName(): string;
    getParameter(tag: string, callback: (response: Response) => void): void;
    initialize(dataAssembly: DataAssembly, identifier: string, metaModelRef: string, name: string, attributes: Attribute[], para: Parameter[]): boolean;
}

abstract class AProcedure implements Procedure {
    protected attributes: Attribute[];
    protected dataAssembly: DataAssembly;
    protected identifier: string;
    protected metaModelRef: string;
    protected name: string;
    protected parameters: Parameter[];
    protected initialized: boolean;
    protected responseVendor: ResponseVendor

    constructor() {
        this.attributes = [];
        this.dataAssembly = {} as DataAssembly;
        this.identifier = '';
        this.metaModelRef = '';
        this.name= '';
        this.parameters= [];
        this.initialized= false;
        this.responseVendor = new ResponseVendor();
    }
    getAllAttributes(): Attribute[] {
        return this.attributes
    }
    getAllParameters(): Parameter[] {
        return this.parameters;
    }
    getAttribute(name: string, callback: (response: Response) => void) {
        this.attributes.forEach((attribute: Attribute) => {
            if(attribute.Name === name) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', attribute);
                callback(response);
            }
            if(attribute === this.attributes[this.attributes.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('', {})
                callback(response)
            }
        })
    }
    getDataAssembly(): DataAssembly {
        return this.dataAssembly;
    }
    getIdentifier(): string {
        return this.identifier;
    }
    getName(): string {
        return this.name;
    }
    getParameter(tag: string, callback: (response: Response) => void) {

    }
    initialize(dataAssembly: DataAssembly, identifier: string, metaModelRef: string, name: string, attributes: Attribute[], para: Parameter[]): boolean {
        this.attributes = attributes;
        this.dataAssembly = dataAssembly;
        this.identifier = identifier;
        this.metaModelRef = metaModelRef;
        this.name = name;
        this.parameters = para;
        this.initialized = (
            JSON.stringify(this.attributes) === JSON.stringify(attributes) &&
            JSON.stringify(this.dataAssembly) === JSON.stringify(dataAssembly) &&
            this.identifier === identifier &&
            this.metaModelRef === metaModelRef &&
            this.name === name &&
            JSON.stringify(this.parameters) === JSON.stringify(para)
        );
        return this.initialized;
    }
}

export class BaseProcedure extends AProcedure {
}

export interface ProcedureFactory {
    create(): Procedure;
}
abstract class AProcedureFactory implements ProcedureFactory {
    abstract create(): Procedure;
}
export class BaseProcedureFactory extends AProcedureFactory {
    create(): Procedure{
        const procedure = new BaseProcedure();
        logger.debug(this.constructor.name + ' creates a ' + procedure.constructor.name);
        return procedure;
    }
}
