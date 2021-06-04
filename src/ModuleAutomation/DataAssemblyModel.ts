import {DataItemModel} from './DataItemModel';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

abstract class ADataAssembly implements ModuleAutomation.DataAssembly {

    protected dataItems: DataItemModel[];
    protected description: string;
    protected dataSourceIdentifier: string;
    protected name: string;
    protected initialized: boolean;
    protected metaModelRef: string;
    protected pimadIdentifier: string;
    protected responseVendor: PiMAdResponseVendor;
    protected responseHandler: PiMAdResponseHandler;

    constructor() {
        this.dataItems= [];
        this.dataSourceIdentifier = 'dataSourceIdentifier: undefined';
        this.description='description: undefined';
        this.name='name: undefined';
        this.initialized = false;
        this.metaModelRef = 'metaModelRef: undefined';
        this.pimadIdentifier = 'pimadIdentifier: undefined';
        this.responseVendor = new PiMAdResponseVendor();
        this.responseHandler = new PiMAdResponseHandler();
    }

    getAllDataItems(callback: GetAllDataItems): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.dataItems);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.dataItems);
        }
    }
    getDataSourceIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.dataSourceIdentifier);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.dataSourceIdentifier);
        }
    }
    getDataItem(name: string,callback: (response: PiMAdResponse, dataItems: DataItemModel) => void): void {
        if(this.initialized) {
            const localDataItem: DataItemModel | undefined = this.dataItems.find(dataItem => {
                let testCondition = false;
                dataItem.getName((response, dataItemName) => {
                    testCondition = dataItemName === name;
                });
                return testCondition;
            });
            if(localDataItem === undefined) {
                callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This DataAssembly has no DataItemModel called <' + name +'>', {}), {} as DataItemModel);
            } else {
                callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), localDataItem);
            }
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This instance is not initialized', {}), {} as DataItemModel);
        }
    }
    getInterfaceClass(callback: (response: PiMAdResponse, interfaceClass: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'Not implemented yet!', {}), '');
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), '');
        }
    }
    getHumanReadableDescription(callback: (response: PiMAdResponse, tagDescription: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.description);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.description);
        }
    }
    getName(callback: (response: PiMAdResponse, name: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.name);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.name);
        }
    }
    getMetaModelRef(callback: (response: PiMAdResponse, metaModelRef: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.metaModelRef);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.metaModelRef);
        }
    }
    /*getCommunication(): PiMAdResponse {
        return this.responseVendor.buyErrorResponse();
    } */
    getPiMAdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void {
        if(this.initialized) {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success', {}), this.pimadIdentifier);
        } else {
            callback(this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized', {}), this.pimadIdentifier);
        }
    }
    abstract initialize(instructions: object): boolean;
}

export class BasicDataAssembly extends ADataAssembly {
    initialize(instructions: {tag: string; dataSourceIdentifier: string; description: string; dataItems: DataItemModel[]; metaModelRef: string; pimadIdentifier: string}): boolean {
        if (!this.initialized) {
            this.name = instructions.tag;
            this.dataSourceIdentifier = instructions.dataSourceIdentifier;
            this.description = instructions.description;
            this.dataItems = instructions.dataItems;
            this.pimadIdentifier = instructions.pimadIdentifier;
            this.metaModelRef = instructions.metaModelRef;
            this.initialized = (
                // make sure every property is defined
                Object.values(instructions).every(el => el !== undefined) &&
                //TODO: is this really necessary?
                this.name === instructions.tag &&
                this.description == instructions.description &&
                JSON.stringify(this.dataItems) === JSON.stringify(instructions.dataItems) &&
                this.pimadIdentifier === instructions.pimadIdentifier &&
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

    /**
     * Ein DataAssembly ist eine funktionale Einheit innerhalb von PEAs. Sie ermöglichen das Steuern, Regeln und
     * Überwachen von Prozessen.
     *
     <uml>
     abstract class ADataAssemblyFactory
     abstract class ADataAssembly {
	    #dataItems: DataItemModel[]
	    #description: string
	    #name: string
	    #initialized: boolean = false
	    #pimadIdentifier: string
	    #metaModelRef: string
	    #responseVendor: ResponseVendor
	    #responseHandler: PiMAdResponseHandler
	 }

     class BasicDataAssemblyFactory
     class BasicDataAssembly {
        +initialize(instructions: {tag: string; description: string; dataItems: DataItemModel[]; identifier: string; metaModelRef: string}): boolean
     }
     class DataAssemblyVendor {
        +buy(type: DataAssemblyType): DataAssembly
     }

     enum DataAssemblyType {
         BASIC = 0
     }

     interface DataAssemblyFactory
     interface DataAssembly {
        +getAllDataItems(callback: (response: PiMAdResponse, dataItems: DataItemModel[]) => void): void
        +getDataItem(name: string,callback: (response: PiMAdResponse, dataItems: DataItemModel) => void): void
        +getDataSourceIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void
        +getInterfaceClass(callback: (response: PiMAdResponse, interfaceClass: string) => void): void
        +getHumanReadableDescription(callback: (response: PiMAdResponse, tagDescription: string) => void): void
        +getName(callback: (response: PiMAdResponse, name: string) => void): void
        +getPiMAdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void
        +getMetaModelRef(callback: (response: PiMAdResponse, metaModelRef: string) => void): void
        +initialize(instructions: object): boolean
	 }

     DataAssembly <|.. ADataAssembly
     DataAssemblyFactory <|.. ADataAssemblyFactory
     ADataAssembly <|-- BasicDataAssembly
     ADataAssemblyFactory <|-- BasicDataAssemblyFactory
     DataAssembly <-- DataAssemblyFactory
     DataAssemblyVendor "1" o-- "1..*" DataAssemblyFactory
     </uml>
     */
    export interface DataAssembly {
        /**
         * Getter for this.dataItems. Returns all {@link DataItemModel}s aggregated in this instance.
         * @param callback - Accessing the {@link DataItemModel}s-Array via callback function.
         */
        getAllDataItems(callback: (response: PiMAdResponse, dataItems: DataItemModel[]) => void ): void;

        /**
         * Get a single {@link DataItemModel} via it's name.
         * @param name - The name of the {@link DataItemModel}
         * @param callback - Accessing the matching {@link DataItemModel} via callback function.
         */
        getDataItem(name: string,callback: (response: PiMAdResponse, dataItems: DataItemModel) => void): void;

        /**
         * Getter for this.dataSourceIdentifier. This variable contains the identifier of the previous data source. It's
         * mostly for debugging purpose and an assembling reference while importing the data.
         * @param callback - Accessing the identifier via callback function.
         */
        getDataSourceIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void;

        /**
         * Not implemented yet!
         * @param callback - Accessing the InterfaceClass via callback function.
         */
        getInterfaceClass(callback: (response: PiMAdResponse, interfaceClass: string) => void): void;

        /**
         * Getter for this.description. Hopefully understandable for all human kind.
         * @param callback - Accessing the description via callback function.
         */
        getHumanReadableDescription(callback: (response: PiMAdResponse, description: string) => void): void;

        /**
         * Getter for this.name. The name of this instance.
         * @param callback - Accessing the name via callback function.
         */
        getName(callback: (response: PiMAdResponse, name: string) => void): void;

        /**
         * Getter for this.pimadIdentifier. A unique identifier in the PiMAd-core data model. Use this one while
         * interacting with PiMAd-objects.
         * @param callback - Accessing the identifier via callback function.
         */
        getPiMAdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void;

        /**
         * Getter for this.metaModelRef. It's a link to the meta model description of the instance.
         * @param callback - Accessing the meta model reference via callback function.
         */
        getMetaModelRef(callback: (response: PiMAdResponse, metaModelRef: string) => void): void;
        //getCommunication(): PiMAdResponse; //any[] //not defined yet
        /**
         * Initialize the new DataAssembly object.
         * @param instructions - A set with different kind of data.
         */
        initialize(instructions: object): boolean;
    }

    /**
     * This enum referencing to all implementations of {@link DataAssembly}.
     */
    export enum DataAssemblyType {
        /**
         * Referencing a {@link BasicDataAssembly}.
         */
        BASIC = 0
    }

    /**
     * This vendor sells various {@link DataAssembly}-Instances.
     */
    export class DataAssemblyVendor {
        private basicDataAssemblyFactory: DataAssemblyFactory;

        /**
         * This one initialize various {@link DataAssemblyFactory}.
         */
        constructor() {
            this.basicDataAssemblyFactory = new BasicDataAssemblyFactory();
        }

        /**
         * Buy an uninitialized {@link DataAssembly}.
         * @param type - The type of the {@link DataAssembly} as {@link DataAssemblyType}.
         */
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

/**
 * Callback for {@link ModuleAutomation.DataAssembly.getAllDataItems}.
 * @param response - Indicates the status of the result. F.ex. a {@link SuccessResponse} for a successful ?.
 * @param dataItems - An Array with {@link DataItemModel}s.
 */
type GetAllDataItems = (
    response: PiMAdResponse,
    dataItems: DataItemModel[]
) => void
