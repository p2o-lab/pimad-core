import {logger} from '../Utils';
import {CommunicationInterfaceData, OPCUANodeCommunicationFactory} from './CommunicationInterfaceData';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

export interface DataItem {
    /**
     * Getter for this.cIData.
     */
    getCommunicationInterfaceData(): CommunicationInterfaceData;
    getDataType(): PiMAdResponse; //string;
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
    protected responseVendor: PiMAdResponseVendor;

    constructor() {
        this.cIData= new OPCUANodeCommunicationFactory().create(); //TODO: Add BaseCommunicationInterfaceData
        this.name = '';
        this.identifier = '';
        this.metaModelRef = '';
        this.initialized = false;
        this.responseVendor = new PiMAdResponseVendor();
    }

    getCommunicationInterfaceData(): CommunicationInterfaceData{
        return this.cIData;
    }
    getDataType(): PiMAdResponse {
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
