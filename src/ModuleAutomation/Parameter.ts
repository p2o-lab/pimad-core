//import { CommunicationInterfaceData } from './CommunicationInterfaceData';
import {logger} from '../Utils/Logger';
import {Response, ResponseVendor} from '../Backbone/Response';

export interface Parameter {
    getAllCommunicationInterfaceData(): Response;//CommunicationInterfaceData[];
    getName(): string;
    getInterfaceClass(): Response; //any; //not defined yet
    getCommunicationInterfaceData(tag: string): Response; //CommunicationInterfaceData;
    initialize(): boolean;
}

abstract class AParameter implements Parameter {
    protected communication: any; //CommunicationInterfaceData[];
    protected interfaceClass: any; //not defined yet
    protected name: string;
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.communication=[];
        this.interfaceClass= null;
        this.name='';
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
    }
    getAllCommunicationInterfaceData(): Response {
        // returns CommunicationInterfaceData[]
        // return this.communication
        return this.responseVendor.buyErrorResponse();
    }
    getName(): string {
        return this.name;
    }
    getInterfaceClass(): Response{
        return this.interfaceClass;
    }
    getCommunicationInterfaceData(tag: string): Response{
            // returns CommunicationInterfaceData
            // add Operations for InterfaceData by tag : CommunicationInterfaceData
            //select specific CommunicationInterfaceData out of CommunicationInterfaceData[] where CommunicationInterfaceData.name equals tag?
            //missing method for CommunicationInterfaceData?
        return this.responseVendor.buyErrorResponse();
    }
    initialize(): boolean {
        //add INIT-Operations here
        this.initialized=true;
    return this.initialized;
    }
}

export class BaseParameter extends AParameter {
}

export interface ParameterFactory {
    create(): Parameter;
}
abstract class AParameterFactory implements ParameterFactory {
    abstract create(): Parameter;
}
export class BaseParameterFactory extends AParameterFactory {
    create(): Parameter{
            const parameter = new BaseParameter();
            logger.debug(this.constructor.name + ' creates a ' + parameter.constructor.name);
        return parameter;}
}
