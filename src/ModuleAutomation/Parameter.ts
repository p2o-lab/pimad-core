import {CommunicationInterfaceData, OPCUANodeCommunicationFactory} from './CommunicationInterfaceData';
import {logger} from '../Utils/Logger';
import {Response, ResponseVendor} from '../Backbone/Response';

export interface Parameter {
    getAllCommunicationInterfaceData(): CommunicationInterfaceData[];
    getName(): string;
    getInterfaceClass(): Response; //TODO: clarify type
    getCommunicationInterfaceData(tag: string): CommunicationInterfaceData;
    initialize(name: string, communication: CommunicationInterfaceData[], interfaceClass: any): boolean;
}

abstract class AParameter implements Parameter {
    protected communication: CommunicationInterfaceData[];
    protected interfaceClass: any; //TODO: clarify type
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
    getAllCommunicationInterfaceData(): CommunicationInterfaceData[] {
        return this.communication;
    }
    getName(): string {
        return this.name;
    }
    getInterfaceClass(): Response{
        return this.interfaceClass;
    }
    getCommunicationInterfaceData(tag: string): CommunicationInterfaceData {
        // TODO > Big refactor! Response type, callback, etc.
        // add Operations for InterfaceData by tag : CommunicationInterfaceData
        return (new OPCUANodeCommunicationFactory()).create()
    }
    initialize(name: string, communication: CommunicationInterfaceData[], interfaceClass: any): boolean {
        if (!this.initialized) {
            //TODO: much more checking
            this.name = name;
            this.communication = communication;
            this.interfaceClass = interfaceClass;
            this.initialized = (this.name == name && this.communication == communication && this.interfaceClass == interfaceClass);
            return this.initialized;
        } else {
            return false;
        }
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
