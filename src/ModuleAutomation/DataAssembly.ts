import {DataItem} from './DataItem';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

abstract class ADataAssembly implements ModuleAutomation.DataAssembly{

    protected dataItems: DataItem[];
    protected tagDescription: string;
    protected tagName: string;
    protected initialized: boolean;
    protected identifier: string;
    protected metaModelRef: string;
    protected responseVendor: PiMAdResponseVendor;
    protected responseHandler: PiMAdResponseHandler;

    constructor() {
        this.dataItems= [];
        this.tagDescription='';
        this.tagName='';
        this.initialized = false;
        this.identifier = '';
        this.metaModelRef = '';
        this.responseVendor = new PiMAdResponseVendor();
        this.responseHandler = new PiMAdResponseHandler();
    }

    getAllDataItems(callback: (response: PiMAdResponse, dataItems: DataItem[]) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.dataItems);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.dataItems);
        }
    };

    getDataItem(name: string,callback: (response: PiMAdResponse, dataItems: DataItem) => void): void {
        if(this.initialized) {
            const localDataItem: DataItem | undefined = this.dataItems.find(dataItem => name === dataItem.getName());
            if(localDataItem === undefined) {
                callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This DataAssembly has no DataItem called <' + name +'>', {}), {} as DataItem);
            } else {
                callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), localDataItem);
            }
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This instance is not initialized', {}), {} as DataItem);
        }
    };

    getInterfaceClass(): PiMAdResponse {
        return this.responseVendor.buyErrorResponse();
    }
    getTagDescription(): string {
        return this.tagDescription;
    }
    getTagName(): string {
        return this.tagName;
    }
    getIdentifier(): string {
        return this.identifier;
    };
    getMetaModelRef(): string {
        return this.metaModelRef;
    };
    getCommunication(): PiMAdResponse {
        return this.responseVendor.buyErrorResponse();
    }
    abstract initialize(instructions: object): boolean ;
    /*{
        //add INIT-Operations here
        this.initialized=true;
        return true;
    }*/
}

export class BasicDataAssembly extends ADataAssembly {
    initialize(instructions: {tag: string; description: string; dataItems: DataItem[]; identifier: string; metaModelRef: string}): boolean {
        if (!this.initialized) {
            this.tagName = instructions.tag;
            this.tagDescription = instructions.description;
            this.dataItems = instructions.dataItems;
            this.identifier = instructions.identifier;
            this.metaModelRef = instructions.metaModelRef;
            this.initialized = (
                this.tagName === instructions.tag &&
                this.tagDescription == instructions.description &&
                JSON.stringify(this.dataItems) === JSON.stringify(instructions.dataItems) &&
                this.identifier === instructions.identifier &&
                this.metaModelRef === instructions.metaModelRef
            );
            return this.initialized;
        } else {
            return false;
        }
    }
}

interface DataAssemblyFactory {
    create(): ModuleAutomation.DataAssembly;
}

abstract class ADataAssemblyFactory implements DataAssemblyFactory {
    abstract create(): ModuleAutomation.DataAssembly;
}

class BasicDataAssemblyFactory extends ADataAssemblyFactory {
    create(): ModuleAutomation.DataAssembly{
        const dataAssembly = new BasicDataAssembly();
        logger.debug(this.constructor.name + ' creates a ' + dataAssembly.constructor.name);
        return dataAssembly;
    }
}

export namespace ModuleAutomation {
    export interface DataAssembly {
        getAllDataItems(callback: (response: PiMAdResponse, dataItems: DataItem[]) => void): void;
        getDataItem(name: string,callback: (response: PiMAdResponse, dataItems: DataItem) => void): void;
        getInterfaceClass(): PiMAdResponse; //any; //not defined yet
        getTagDescription(): string;
        getTagName(): string;
        getIdentifier(): string;
        getMetaModelRef(): string;
        getCommunication(): PiMAdResponse; //any[] //not defined yet
        initialize(instructions: object): boolean;
    }

    export enum DataAssemblyType {
        BASIC = 0
    }

    export class DataAssemblyVendor {
        private basicDataAssemblyFactory: DataAssemblyFactory;

        constructor() {
            this.basicDataAssemblyFactory = new BasicDataAssemblyFactory();
        }

        public buy(type: DataAssemblyType): DataAssembly {
            switch (type) {
                case DataAssemblyType.BASIC:
                    return this.basicDataAssemblyFactory.create();
            }
        }
    }
}

/*
abstract class ADiagnostic extends ADataAssembly {
}

abstract class AInput extends ADataAssembly {
}

abstract class AServiceControl extends ADataAssembly {
}

abstract class AOperation extends ADataAssembly {
}

export interface Actuator extends ModuleAutomation.DataAssembly {
    initialize(instructions: object): boolean;
}

export interface Sensor extends ModuleAutomation.DataAssembly {
    initialize(instructions: object): boolean;
}

abstract class AActive extends ADataAssembly implements Actuator{
}

abstract class AIndicator extends ADataAssembly implements Sensor{
}
*/
