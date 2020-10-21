import {logger} from '../Utils';
import {CommunicationInterfaceData} from './CommunicationInterfaceData';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import {
    AModuleAutomationObject,
    InitializeModuleAutomationObject,
    ModuleAutomationObject
} from './ModuleAutomationObject';

export interface DataItem extends ModuleAutomationObject {

    /**
     * Getter for this.cIData.
     */
    getCommunicationInterfaceData(callback: (response: PiMAdResponse, communicationInterfaceData: CommunicationInterfaceData) => void ): void;

    /**
     *
     */
    getDataType(callback: (response: PiMAdResponse, dataType: string) => void ): void;

    /**
     *
     */
    initialize(instructions: InitializeDataItem): boolean;
}

export type InitializeDataItem = InitializeModuleAutomationObject & {
    ciData: CommunicationInterfaceData;
    dataType: string;
}

abstract class ADataItem extends AModuleAutomationObject implements DataItem {

    protected cIData: CommunicationInterfaceData;
    protected dataType: string; // ToDo > Should be an enum!

    constructor() {
        super();
        this.cIData = {} as CommunicationInterfaceData;
        this.dataType = 'DataType: not initialized!';
        this.initialized = false;
    }

    getCommunicationInterfaceData(callback: (response: PiMAdResponse, communicationInterfaceData: CommunicationInterfaceData) => void ): void {
        this.genericPiMAdGetter(this.cIData, callback);
    }

    getDataType(callback: (response: PiMAdResponse, dataType: string) => void ): void {
        this.genericPiMAdGetter(this.dataType, callback);
    }

    initialize(instructions: InitializeDataItem): boolean {
        if (!this.initialized) {
            this.cIData = instructions.ciData;
            this.dataType = instructions.dataType;
            this.initialized = (JSON.stringify(this.cIData) === JSON.stringify(instructions.ciData)
                && this.dataType === instructions.dataType
                && this.moduleAutomationObjectInitialize({
                    dataSourceIdentifier: instructions.dataSourceIdentifier,
                    metaModelRef: instructions.metaModelRef,
                    name: instructions.name,
                    pimadIdentifier: instructions.pimadIdentifier,
                })
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}

class BaseDataItem extends ADataItem {
}

/**
 * This one is a Interface for a DataItemFactory. It creates objects of the class DataItem.
 */
export interface DataItemFactory {
    /**
     * Create a uninitialized object of the class DataItem.
     */
    create(): DataItem;
}

/**
 * This one is a abstract DataItemFactory, actually without deeper purpose. In future this one is a extra abstraction layer.
 */
abstract class ADataItemFactory implements DataItemFactory {
    abstract create(): DataItem;
}

/**
 * This factory creates objects of the class BaseDataItems.
 */
export class BaseDataItemFactory extends ADataItemFactory {
    /**
     *
     */
    create(): DataItem {
        const dataItem = new BaseDataItem();
        logger.debug(this.constructor.name + ' creates a ' + dataItem.constructor.name);
        return dataItem;
    }
}
