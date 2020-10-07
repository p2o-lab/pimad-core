import {NodeId, NodeIdVendor} from './NodeId';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import {AModuleAutomationObject, ModuleAutomationObject} from './ModuleAutomationObject';
import {NodeIdTypeEnum} from 'PiMAd-types';

/**
 * This interface generalises the interaction with interface descriptions of communication systems. It's only data.
 * There are no client functionality, etc.
 */
export interface CommunicationInterfaceData extends ModuleAutomationObject {
    /**
     * Get all generalised interface data.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the InterfaceDescription object the requested data.
     */
    getInterfaceDescription(callback: (response: Backbone.PiMAdResponse, interfaceDescription: InterfaceDescription) => void): void;

    /**
     * Get the macrocosm of the communication interface. F.ex. IP
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the macrocosm object the requested data.
     */
    getMacrocosm(callback: (response: Backbone.PiMAdResponse, macrocosm: string) => void): void;

    /**
     * Get the microcosm of the communication interface. F.ex. port
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the microcosm object the requested data.
     */
    getMicrocosm(callback: (response: Backbone.PiMAdResponse, microcosm: string) => void): void;

    /**
     * Initialize the communication interface with data.
     * @param instructions - Standard  Pass macro and microcosm data of the interface instance. F. ex. a server address:
     * IP/Hostname is the macrocosm, port is the microcosm.
     */
    initialize(instructions: InitializeCommunicationInterfaceData): boolean;
}

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
     * Macro identifier: E.g. IP or namespace.
     */
    macrocosm: string;
    /**
     * micro identifier: E.g. port
     */
    microcosm: string;
}

abstract class ACommunicationInterfaceData extends AModuleAutomationObject implements CommunicationInterfaceData {
    protected macrocosm: string
    protected microcosm: string

    protected constructor() {
        super();
        this.macrocosm = 'macrocosm: undefined';
        this.microcosm = 'microcosm: undefined';
    };

    /**
     * @inheritDoc {@link CommunicationInterfaceData.getInterfaceDescription}
     */
    getInterfaceDescription(callback: (response: Backbone.PiMAdResponse, interfaceDescription: InterfaceDescription) => void): void {
        this.genericPiMAdGetter<InterfaceDescription>({macrocosm: this.macrocosm, microcosm: this.microcosm}, callback);
    };

    /**
     * @inheritDoc {@link CommunicationInterfaceData.getMacrocosm}
     */
    getMacrocosm(callback: (response: Backbone.PiMAdResponse, macrocosm: string) => void): void {
        this.genericPiMAdGetter<string>(this.macrocosm, callback);
    };

    /**
     * @inheritDoc {@link CommunicationInterfaceData.getMicrocosm}
     */
    getMicrocosm(callback: (response: Backbone.PiMAdResponse, microcosm: string) => void): void {
        this.genericPiMAdGetter<string>(this.microcosm, callback);
    };

    initialize(instruction: InitializeCommunicationInterfaceData): boolean {
        if(!this.initialized) {
            this.macrocosm = instruction.interfaceDescription.macrocosm;
            this.microcosm = instruction.interfaceDescription.microcosm;
            this.initialized = (
                this.macrocosm === instruction.interfaceDescription.macrocosm &&
                    this.microcosm === instruction.interfaceDescription.microcosm &&
                        this.moduleAutomationObjectInitialize(instruction.dataSourceIdentifier, instruction.metaModelRef, instruction.name, instruction.pimadIdentifier)
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}

export class OPCUAServerCommunication extends ACommunicationInterfaceData {

    constructor() {
        super();
    }
}

export class OPCUANodeCommunication extends ACommunicationInterfaceData {
    protected nodeId: NodeId;
    protected access: string;

    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: NodeId) => void): void {
        this.genericPiMAdGetter(this.nodeId, callback);
    };
    initialize(instructions: InitializeCommunicationInterfaceData): boolean {
        if (!this.initialized) {
            // TODO > The NodeId stuff is quick an dirty. It feels quit uncomfortable... Only supports String node id's sofar...
            const localNodeId = new NodeIdVendor().buy(NodeIdTypeEnum.STRING);
            this.initialized = (
                this.moduleAutomationObjectInitialize(instructions.dataSourceIdentifier, instructions.metaModelRef, instructions.name, instructions.pimadIdentifier) &&
                    localNodeId.initialize({namespaceIndex: instructions.interfaceDescription.macrocosm as unknown as number, identifier: instructions.interfaceDescription.microcosm})
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
        this.access = 'access: undefined';
    }
}

/*  Factory */
export interface CommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData;
}

export enum CommunicationInterfaceDataEnum {
    OPCUAServer = 0,
    OPCUANode= 1
}

abstract class ACommunicationInterfaceDataFactory implements CommunicationInterfaceDataFactory {
    abstract create(): CommunicationInterfaceData;
}

class OPCUANodeCommunicationFactory extends ACommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData {
        const communicationInterfaceData = new OPCUANodeCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return communicationInterfaceData;
    }
}

class OPCUAServerCommunicationFactory extends ACommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData {
        const communicationInterfaceData = new OPCUAServerCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return new OPCUAServerCommunication();
    }
}

export class CommunicationInterfaceDataVendor {
    private opcuaNodeCommunicationFactory: OPCUANodeCommunicationFactory;
    private opcuaServerCommunicationFactory: OPCUAServerCommunicationFactory;

    constructor() {
        this.opcuaNodeCommunicationFactory = new OPCUANodeCommunicationFactory();
        this.opcuaServerCommunicationFactory = new OPCUAServerCommunicationFactory();
    }

    public buy(interfaceDataClass: CommunicationInterfaceDataEnum): CommunicationInterfaceData {
        switch (interfaceDataClass) {
            case CommunicationInterfaceDataEnum.OPCUANode:
                return this.opcuaNodeCommunicationFactory.create();
            case CommunicationInterfaceDataEnum.OPCUAServer:
                return this.opcuaServerCommunicationFactory.create();
        }
    }
}
