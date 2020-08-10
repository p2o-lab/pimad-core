import {logger} from '../Utils';
import {Parameter} from './Parameter';
import {DataAssembly} from './DataAssembly';
import {Response, ResponseVendor} from '../Backbone';
import {Attribute} from './Attribute';

export interface Procedure {
    /**
     * Get all attributes of this procedure.
     */
    getAllAttributes(): Attribute[];

    /**
     * Get all parameters of this procedure.
     */
    getAllParameters(): Parameter[];

    /**
     * Get a specific attribute of this procedure.
     * @param name - The name of the attribute.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getAttribute(name: string, callback: (response: Response) => void): void;

    /**
     * Get the DataAssembly-object of this procedure.
     */
    getDataAssembly(): DataAssembly;

    /**
     * Get the identifier of this procedure.
     */
    getIdentifier(): string;

    /**
     * Get the metamodel reference of this procedure.
     */
    getMetaModelRef(): string;

    /**
     * Get the name of this procedure.
     */
    getName(): string;

    /**
     * Get a specific parameter of this procedure.
     * @param name - The name of the parameter.
     * @param callback - A callback function. Use an instance of the interface PiMAd-core/src/Backbone/Response as input.
     */
    getParameter(name: string, callback: (response: Response) => void): void;
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
        this.identifier = 'identifier: not-initialized';
        this.metaModelRef = 'metaModelRef: not-initialized';
        this.name = 'name: not-initialized';
        this.parameters = [];
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
    }
    getAllAttributes(): Attribute[] {
        return this.attributes;
    }
    getAllParameters(): Parameter[] {
        return this.parameters;
    }
    getAttribute(name: string, callback: (response: Response) => void): void {
        this.attributes.forEach((attribute: Attribute) => {
            if((attribute.getName().getContent() as {data: string}).data === name) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', attribute);
                callback(response);
            }
            if(attribute === this.attributes[this.attributes.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find attribute <' + name + '> in procedure <' + this.name + '>', {});
                callback(response);
            }
        });
    }
    getDataAssembly(): DataAssembly {
        return this.dataAssembly;
    }
    getIdentifier(): string {
        return this.identifier;
    }
    getMetaModelRef(): string {
        return this.metaModelRef;
    }
    getName(): string {
        return this.name;
    }
    getParameter(tag: string, callback: (response: Response) => void): void {
        this.parameters.forEach((parameter: Parameter) => {
            if(parameter.getName() === tag) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', parameter);
                callback(response);
            }
            if(parameter === this.parameters[this.parameters.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find parameter <' + tag + '> in procedure <' + this.name + '>', {});
                callback(response);
            }
        });
    }
    initialize(dataAssembly: DataAssembly, identifier: string, metaModelRef: string, name: string, attributes: Attribute[], para: Parameter[]): boolean {
        if(!this.initialized)  {
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
        } else {
            return false;
        }
    }
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
