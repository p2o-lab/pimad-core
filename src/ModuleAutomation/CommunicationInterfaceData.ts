import {NodeId, NodeIdVendor} from './NodeId';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import {AModuleAutomationObject, ModuleAutomationObject} from './ModuleAutomationObject';
import {NodeIdTypeEnum} from '@p2olab/pimad-types';

/**
 * This interface generalises the interaction with interface descriptions of communication systems. It's only data.
 * There are no client functionality, etc.
 */
export interface CommunicationInterfaceData extends ModuleAutomationObject {
    //TODO: Do we need those getters?
   /* /!**
     * Get all generalised interface data.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the InterfaceDescription object the requested data.
     *!/
    getInterfaceDescription(callback: (response: Backbone.PiMAdResponse, interfaceDescription: InterfaceDescription | undefined) => void): void;

    /!**
     * Get the macrocosm of the communication interface. F.ex. IP
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the macrocosm object the requested data.
     *!/
    getMacrocosm(callback: (response: Backbone.PiMAdResponse, macrocosm: string | undefined) => void): void;

    /!**
     * Get the microcosm of the communication interface. F.ex. port
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the microcosm object the requested data.
     *!/
    getMicrocosm(callback: (response: Backbone.PiMAdResponse, microcosm: string | undefined) => void): void;

    /!**
     * Initialize the communication interface with data.
     * @param instructions - Standard  Pass macro and microcosm data of the interface instance. F. ex. a server address:
     * IP/Hostname is the macrocosm, port is the microcosm.
     *!/*/
    initialize(instructions: InitializeCommunicationInterfaceData | undefined): boolean;
}

//TODO Parts of this enum could be generic!!
export type InitializeCommunicationInterfaceData = {
    dataSourceIdentifier: string;
    interfaceDescription: InterfaceDescription;
    metaModelRef: string;
    pimadIdentifier: string;
    name: string;
}

/**
 * Generalisation of interface data. This is based on the approach that the addresses of the interfaces resemble a
 * postal address. So street and house number are similar to IP and port.
 */
export type InterfaceDescription = {
    /**
     * Macro identifier: F.ex. IP or namespace.
     */
    macrocosm: string;
    /**
     * micro identifier: F.ex. port
     */
    microcosm: string;
}

/**
 * Implements the {@link CommunicationInterfaceData}-Interface. Generalize variables, methods, etc. Reduce code
 * duplication.
 */
abstract class ACommunicationInterfaceData extends AModuleAutomationObject implements CommunicationInterfaceData {
    /**
     * The general part of the interface address. F.ex. an IP.
     * @protected
     */
    protected macrocosm?: string
    /**
     * The more specific part of the interface address. F.ex. a port.
     * @protected
     */
    protected microcosm?: string

    protected constructor() {
        super();
        //this.macrocosm = 'macrocosm: undefined';
       // this.microcosm = 'microcosm: undefined';
    }
    // TODO: Do we need these Getters?
    /**
     * @inheritDoc {@link CommunicationInterfaceData.getInterfaceDescription}
     *!/
    getInterfaceDescription(callback: (response: Backbone.PiMAdResponse, interfaceDescription: InterfaceDescription)  => void): void {
        this.genericPiMAdGetter<InterfaceDescription | undefined>({macrocosm: this.macrocosm, microcosm: this.microcosm}, callback);
    }

    /!**
     * @inheritDoc {@link CommunicationInterfaceData.getMacrocosm}
     *!/
    getMacrocosm(callback: (response: Backbone.PiMAdResponse, macrocosm: string) => void): void {
       // this.genericPiMAdGetter<string>(this.macrocosm, callback);
    }

    /!**
     * @inheritDoc {@link CommunicationInterfaceData.getMicrocosm}
     *!/
    getMicrocosm(callback: (response: Backbone.PiMAdResponse, microcosm: string) => void): void {
        //this.genericPiMAdGetter<string>(this.microcosm, callback);
    }*/

    /**
     * Initialize this instance with interface description data. Caution: After a successful initialisation one cannot
     * initialize it again. Spawn a new object instead.
     * @param instructions - Most params a standard. In the context of opc-ua the macrocosm is the namespace and the
     * microcosm is the identifier of the opc-ua-server.
     */
    initialize(instructions: InitializeCommunicationInterfaceData): boolean {
        if(!this.initialized) {
            this.macrocosm = instructions.interfaceDescription.macrocosm;
            this.microcosm = instructions.interfaceDescription.microcosm;
            this.initialized = (
                this.macrocosm === instructions.interfaceDescription.macrocosm
                && this.microcosm === instructions.interfaceDescription.microcosm
           /*     && this.moduleAutomationObjectInitialize({
                        dataSourceIdentifier: instructions.dataSourceIdentifier,
                        metaModelRef: instructions.metaModelRef,
                        name: instructions.name,
                        pimadIdentifier: instructions.pimadIdentifier
                    })*/
            );
            return this.initialized;
        } else {
            return false;
        }
    }
}

/**
 * This class models the interface description of opc-ua-servers.
 */
export class OPCUAServerCommunication extends ACommunicationInterfaceData {
    constructor() {
        super();
    }
}

/**
 * This class models the interface description of opc-ua-nodes.
 */
export class OPCUANodeCommunication extends ACommunicationInterfaceData {
    protected nodeId: NodeId;
    // protected access: string;

    /**
     * Getter. Maybe use a TODO: new interface
     * @param callback
     */
    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: NodeId) => void): void {
        this.genericPiMAdGetter(this.nodeId, callback);
    }

    /**
     * Initialize this instance with interface description data. Caution: After a successful initialisation one cannot
     * initialize it again. Spawn a new object instead.
     * @param instructions - Most params a standard. In the context of opc-ua the macrocosm is the namespace and the
     * microcosm is the identifier of the opc-ua-node.
     */
    initialize(instructions: InitializeCommunicationInterfaceData): boolean {
        if (!this.initialized) {
            // TODO > The NodeId stuff is quick an dirty. It feels quit uncomfortable... Only supports String node id's so far...
            const localNodeId = new NodeIdVendor().buy(NodeIdTypeEnum.STRING);
            this.initialized = (
       /*         this.moduleAutomationObjectInitialize({
                    dataSourceIdentifier: instructions.dataSourceIdentifier,
                    metaModelRef: instructions.metaModelRef,
                    name: instructions.name,
                    pimadIdentifier: instructions.pimadIdentifier
                })*/
                 localNodeId.initialize({
                     namespaceIndex: instructions.interfaceDescription.macrocosm as unknown as number,
                     identifier: instructions.interfaceDescription.microcosm
                 })
            );
            this.nodeId = localNodeId;
            return this.initialized;
        } else {
            return false;
        }
    }

    constructor() {
        super();
        this.nodeId = {} as NodeId;
        // this.access = 'access: undefined';
    }
}

/**
 * Factory interface for instances of {@link CommunicationInterfaceData}
 */
export interface CommunicationInterfaceDataFactory {
    /**
     * Create an instance of the {@link CommunicationInterfaceData} interface.
     */
    create(): CommunicationInterfaceData;
}

/**
 * Enum of different communication interface data classes.
 */
export enum CommunicationInterfaceDataEnum {
    /**
     * {@link OPCUAServerCommunication}
     */
    OPCUAServer = 0,
    /**
     * {@link OPCUANodeCommunication}
     */
    OPCUANode = 1
}

/**
 * Actually no deeper purpose ...
 */
abstract class ACommunicationInterfaceDataFactory implements CommunicationInterfaceDataFactory {
    abstract create(): CommunicationInterfaceData;
}

/**
 * Factory for instances of {@link OPCUANodeCommunication}.
 */
class OPCUANodeCommunicationFactory extends ACommunicationInterfaceDataFactory {
    /**
     * Create an instance of {@link OPCUANodeCommunication}.
     */
    create(): CommunicationInterfaceData {
        const communicationInterfaceData = new OPCUANodeCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return communicationInterfaceData;
    }
}

/**
 * Factory for instances of {@link OPCUAServerCommunication}.
 */
class OPCUAServerCommunicationFactory extends ACommunicationInterfaceDataFactory {
    /**
     * Create an instance of {@link OPCUAServerCommunication}.
     */
    create(): CommunicationInterfaceData {
        const communicationInterfaceData = new OPCUAServerCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return communicationInterfaceData;
    }
}

/**
 * This class allows you to purchase different instances of the {@link CommunicationInterfaceData} interface.
 */
export class CommunicationInterfaceDataVendor {
    private opcuaNodeCommunicationFactory: CommunicationInterfaceDataFactory;
    private opcuaServerCommunicationFactory: CommunicationInterfaceDataFactory;

    constructor() {
        this.opcuaNodeCommunicationFactory = new OPCUANodeCommunicationFactory();
        this.opcuaServerCommunicationFactory = new OPCUAServerCommunicationFactory();
    }

    /**
     * Buy a specific instance of CommunicationInterfaceData interface.
     * @param interfaceDataClass - Define via parameter which interface you want to buy.
     */
    public buy(interfaceDataClass: CommunicationInterfaceDataEnum): CommunicationInterfaceData {
        switch (interfaceDataClass) {
            case CommunicationInterfaceDataEnum.OPCUANode:
                return this.opcuaNodeCommunicationFactory.create();
            case CommunicationInterfaceDataEnum.OPCUAServer:
                return this.opcuaServerCommunicationFactory.create();
        }
    }
}
