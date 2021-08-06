import {CommunicationInterfaceData} from './CommunicationInterfaceData';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;

export interface Parameter {
    getAllCommunicationInterfaceData(): CommunicationInterfaceData[];
    getName(): string;
    getInterfaceClass(): PiMAdResponse; //TODO: clarify type
    getCommunicationInterfaceData(tag: string): CommunicationInterfaceData;
    initialize(name: string, communication: CommunicationInterfaceData[], interfaceClass: any): boolean;
}

abstract class AParameter implements Parameter {
    protected communication: CommunicationInterfaceData[];
    protected interfaceClass: any; //TODO: clarify type
    protected name: string;
    protected initialized: boolean;
    protected responseVendor: PiMAdResponseVendor;

    constructor() {
        this.communication=[];
        this.interfaceClass= null;
        this.name='';
        this.initialized = false;
        this.responseVendor = new PiMAdResponseVendor();
    }
    getAllCommunicationInterfaceData(): CommunicationInterfaceData[] {
        return this.communication;
    }
    getName(): string {
        return this.name;
    }
    getInterfaceClass(): PiMAdResponse {
        return this.responseVendor.buyErrorResponse();
    }
    getCommunicationInterfaceData(tag: string): CommunicationInterfaceData {
        // TODO > Big refactor! Response type, callback, etc.
        // add Operations for InterfaceData by tag : CommunicationInterfaceData
        return {} as CommunicationInterfaceData;
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

class BaseParameter extends AParameter {
}

export interface ParameterFactory {
    create(): Parameter;
}
abstract class AParameterFactory implements ParameterFactory {
    abstract create(): Parameter;
}
export class BaseParameterFactory extends AParameterFactory {
    create(): Parameter{ // TODO why use factory, it doesn't do much
            const parameter = new BaseParameter();
            logger.debug(this.constructor.name + ' creates a ' + parameter.constructor.name);
        return parameter;}

}
