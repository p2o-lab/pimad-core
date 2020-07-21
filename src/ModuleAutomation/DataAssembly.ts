import {DataItem} from './DataItem';
import {Response, ResponseVendor} from '../Backbone/Response';
import {logger} from '../Utils/Logger';

export interface DataAssembly {
    getInterfaceClass(): Response; //any; //not defined yet
    getTagDescription(): string;
    getTagName(): string;
    getCommunication(): Response; //any[] //not defined yet
    initialize(instructions: object): boolean;
}

abstract class ADataAssembly implements DataAssembly{

    protected dataItems: DataItem[];
    protected tagDescription: string;
    protected tagName: string;
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.dataItems= [];
        this.tagDescription='';
        this.tagName='';
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
    }
    getInterfaceClass(): Response {
        return this.responseVendor.buyErrorResponse();
    }
    getTagDescription(): string {
        return this.tagDescription;
    }
    getTagName(): string {
        return this.tagName;
    }
    getCommunication(): Response {
        return this.responseVendor.buyErrorResponse();
    }
    initialize(instructions: object): boolean {
        //add INIT-Operations here
        this.initialized=true;
        return this.initialized;
    }
}
export class BaseDataAssembly extends ADataAssembly {
    initialize(instructions: {tag: string; description: string; dataItems: DataItem[]}): boolean {
        if (!this.initialized) {
            this.tagName = instructions.tag;
            this.tagDescription = instructions.description;
            this.dataItems = instructions.dataItems;
            this.initialized = (this.tagName === instructions.tag && this.tagDescription == instructions.description && JSON.stringify(this.dataItems) === JSON.stringify(instructions.dataItems));
            return this.initialized;
        } else {
            return false;
        }
    }
}

export interface DataAssemblyFactory {
    create(): DataAssembly;
}
abstract class ADataAssemblyFactory implements DataAssemblyFactory {
    abstract create(): DataAssembly;
}
export class BaseDataAssemblyFactory extends ADataAssemblyFactory {
    create(): DataAssembly{
        const dataAssembly = new BaseDataAssembly();
        logger.debug(this.constructor.name + ' creates a ' + dataAssembly.constructor.name);
        return dataAssembly;}
}


abstract class ADiagnostic extends ADataAssembly {
}
abstract class AInput extends ADataAssembly {
}
abstract class AServiceControl extends ADataAssembly {
}
abstract class AOperation extends ADataAssembly {
}

export interface Actuator extends DataAssembly {
    initialize(instructions: object): boolean;
}

export interface Sensor extends DataAssembly {
    initialize(instructions: object): boolean;
}

abstract class AActive extends ADataAssembly implements Actuator{
}
abstract class AIndicator extends ADataAssembly implements Sensor{
}
