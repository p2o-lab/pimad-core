import {Parameter} from './Parameter';
import {Response, ResponseVendor} from '../Backbone/Response';
import {logger} from '../Utils/Logger';
import {DataAssembly} from './DataAssembly';
import {Procedure} from './Procedure';
import { Attribute } from 'AML';

export interface Service {
    /*getAllAttributes(): Response;
    getAllProcedures(): Response;
    getAllParameters(): Response;
    getAttribute(tag: string, callback: (response: Response) => void): void;
    getParameter(tag: string, callback: (response: Response) => void): void;
    getProcedure(tag: string, callback: (response: Response) => void): void;
    getDataAssembly(): Response; */
    /**
     * Getter for this.name of the service object.
     * @returns A response object. {content: {data: <name>}}
     */
    getName(): Response;
    /**
     * Getter for this.metaModelRef of the service object.
     * @returns A response object. {content: {data: <metamodel reference>>}}
     */
    getMetaModelReference(): Response;
    /**
     * Initialize the service object with data. This one works like a constructor.
     * @param attributes - An Array with attributes of the service object..
     * @param dataAssembly - The data assembly of the service object.. F. ex. with the communication interface data.
     * @param identifier - A general identifier of the service object.
     * @param metaModelRef - A reference to a metamodel describing the service object.
     * @param name - The name of the service object.
     * @param parameter - An Array with service parameters.
     * @param procedure - An Array with service procedures.
     * @returns True for a successful initialisation. False for a not successful initialisation.
     */
    initialize(attributes: Attribute[], dataAssembly: DataAssembly, identifier: string, metaModelRef: string, name: string, parameter: Parameter[], procedure: Procedure[]): boolean;
}

abstract class AService implements Service{
    protected attributes: Attribute[];
    protected dataAssembly: DataAssembly;
    protected identifier: string;
    protected metaModelRef: string;
    protected name: string;
    protected procedures: Procedure[];
    protected parameters: Parameter[];
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.attributes = [];
        this.dataAssembly = {} as DataAssembly;
        this.identifier = 'identifier: not initialized';
        this.metaModelRef = 'metaModelRef: not initialized';
        this.name = 'name: not initialized';
        this.procedures = [];
        this.parameters = [];
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
    }
    /*getAllCommunicationInterfaceData(): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getAllProcedures(): Response{
        return this.responseVendor.buyErrorResponse();
        //return this.procedures;
    }
    getAllParameters(): Parameter[]{
        return this.parameters;
    }
    getCommunicationInterfaceData(tag: string): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getProcedure(tag: string): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getParameter(tag: string): Response{
        return this.responseVendor.buyErrorResponse();
    }*/
    getMetaModelReference(): Response {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.metaModelRef});
        return response
    };
    getName(): Response {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.name});
        return response
    };
    initialize(attributes: Attribute[], dataAssembly: DataAssembly, identifier: string, metaModelRef: string, name: string, parameter: Parameter[], procedure: Procedure[]): boolean {
        if(!this.initialized) {
            this.attributes = attributes;
            this.dataAssembly = dataAssembly;
            this.identifier = identifier
            this.metaModelRef = metaModelRef;
            this.name = name;
            this.parameters = parameter;
            this.procedures = procedure;
            this.initialized = (JSON.stringify(this.attributes) === JSON.stringify(attributes) &&
                    JSON.stringify(this.dataAssembly) === JSON.stringify(dataAssembly) &&
                    this.identifier === identifier &&
                    this.metaModelRef === metaModelRef &&
                    this.name === name &&
                    JSON.stringify(this.parameters) === JSON.stringify(parameter) &&
                    JSON.stringify(this.procedures) === JSON.stringify(procedure)
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}
export class BaseService extends AService {
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
        return service;}
}
