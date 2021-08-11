import {CommunicationInterfaceData} from './CommunicationInterfaceData';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;
import {DataItemModel} from './DataItemModel';

export interface Parameter {
    getAllCommunicationInterfaceData(): DataItemModel[];
    getName(): string;
    getInterfaceClass(): PiMAdResponse; //TODO: clarify type
    getCommunicationInterfaceData(tag: string): CommunicationInterfaceData;
    initialize(name: string, communication: DataItemModel[], interfaceClass: any): boolean;
}

abstract class AParameter implements Parameter {
    protected dataItems: DataItemModel[];
    protected metaModelRef: string;
    protected name: string;
    protected initialized: boolean;
    protected responseVendor: PiMAdResponseVendor;

    constructor() {
        this.dataItems=[];
        this.metaModelRef= '';
        this.name='';
        this.initialized = false;
        this.responseVendor = new PiMAdResponseVendor();
    }
    getAllCommunicationInterfaceData(): DataItemModel[] {
        return this.dataItems;
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
    initialize(name: string, communication: DataItemModel[], interfaceClass: any): boolean {
        if (!this.initialized) {
            this.name = name;
            this.dataItems = communication;
            this.metaModelRef = interfaceClass;
            this.initialized = (this.name == name && this.dataItems == communication && this.metaModelRef == interfaceClass);
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
