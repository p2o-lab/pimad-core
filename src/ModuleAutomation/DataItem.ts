import {logger} from '../Utils/Logger';
import {Response, ResponseVendor} from '../Backbone/Response';
import {CommunicationInterfaceData, OPCUANodeCommunication} from './CommunicationInterfaceData';

export interface DataItem {
    /**
     * Getter for this.cIData.
     */
    getCommunicationInterfaceData(): CommunicationInterfaceData;
    getDataType(): Response; //string;
    /**
     * Getter for this.identifier.
     */
    getIdentifier(): string;
    /**
     * Getter for this.metaModelRef.
     * @returns The reference to the meta model.
     */
    getMetaModelRef(): string;

    /**
     * Initialize the object of the class DataItem.
     * @param name - The name.
     * @param ciData - ???
     * @param id - A identifier.
     * @param metaModelRef - A reference to a meta model.
     */
    initialize(name: string, ciData: CommunicationInterfaceData, id: string, metaModelRef: string): boolean;
}

abstract class ADataItem implements DataItem {

    protected cIData: CommunicationInterfaceData;
    protected name: string;
    protected identifier: string;
    protected metaModelRef: string;
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.cIData= new OPCUANodeCommunication(); //TODO: Add BaseCommunicationInterfaceData
        this.name = '';
        this.identifier = '';
        this.metaModelRef = '';
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
    }

    getCommunicationInterfaceData(): CommunicationInterfaceData{
        return this.cIData;
    }
    getDataType(): Response{
        //TODO: Datatype of OPCUAServerCommunication definition
        return this.responseVendor.buyErrorResponse();
    }
    getIdentifier(): string {
        return this.identifier;
    };

    getMetaModelRef(): string {
        return this.metaModelRef;
    };
    initialize(name: string, ciData: CommunicationInterfaceData, identifier: string, metaModelRef: string): boolean {
        if (!this.initialized) {
            //TODO: much more checking
            this.name = name;
            this.cIData = ciData;
            this.identifier = identifier;
            this.metaModelRef = metaModelRef;
            this.initialized = (this.name === name && this.cIData === ciData && this.identifier === identifier && this.metaModelRef === metaModelRef);
            return this.initialized;
        } else {
            return false;
        }
    }
}

export class BaseDataItem extends ADataItem {
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
