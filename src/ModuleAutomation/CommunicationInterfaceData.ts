import {NodeId} from './NodeId';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

export interface CommunicationInterfaceData {
    getInterfaceData(): PiMAdResponse;
    getName(): PiMAdResponse;
    initialize(interfaceDescription: object): boolean;
}

abstract class ACommunicationInterfaceData implements CommunicationInterfaceData {
    protected name: string;
    protected initialized: boolean;
    protected responseHandler: PiMAdResponseHandler;

    protected constructor() {
        this.name = 'name: not initialized';
        this.initialized = false;
        this.responseHandler = new PiMAdResponseHandler();
    };

    public getName(): PiMAdResponse {
        if(this.initialized) {
            return this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success!', {data: this.name});
        } else {
            return this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'The instance is not initialized!', {data: this.name});
        }
    }

    abstract getInterfaceData(): PiMAdResponse;
    abstract initialize(interfaceDescription: object): boolean;
}

export class OPCUAServerCommunication extends ACommunicationInterfaceData {
    protected serverURL: string;

    constructor() {
        super();
        this.serverURL = '';
    }

    getInterfaceData(): PiMAdResponse {
        if(this.initialized) {
            return this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success!', { name: this.name, serverURL: this.serverURL});
        } else {
            return this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This instance is not initialized!', {});
        }
    }

    initialize(interfaceDescription: {name: string; serverURL: string}): boolean {
        if (!this.initialized) {
            this.name = interfaceDescription.name;
            this.serverURL = interfaceDescription.serverURL;
            this.initialized = (this.name == interfaceDescription.name && this.serverURL == interfaceDescription.serverURL);
            return this.initialized;
        } else {
            return false;
        }
    };

}

export class OPCUANodeCommunication extends ACommunicationInterfaceData {
    protected namespaceIndex: number | string;
    protected nodeId: NodeId;
    protected dataType: string;

    getInterfaceData(): PiMAdResponse {
        if (this.initialized) {
            return this.responseHandler.handleResponse(PiMAdResponseTypes.SUCCESS, 'Success!', {name:this.name, namespaceIndex:this.namespaceIndex, nodeId:this.nodeId, dataType: this.dataType});
        } else {
            return this.responseHandler.handleResponse(PiMAdResponseTypes.ERROR, 'This instance is not initialized!', {});
        }
    };

    initialize(interfaceDescription: {name: string; namespaceIndex: number|string; nodeId: NodeId; dataType: string}): boolean {
        if (!this.initialized) {
            this.name = interfaceDescription.name;
            this.namespaceIndex = interfaceDescription.namespaceIndex;
            this.nodeId = interfaceDescription.nodeId;
            this.dataType = interfaceDescription.dataType;
            this.initialized = (this.name == interfaceDescription.name && this.namespaceIndex == interfaceDescription.namespaceIndex && this.nodeId == interfaceDescription.nodeId && this.dataType == interfaceDescription.dataType);
            return this.initialized;
        } else {
            return false;
        }
    }

    constructor() {
        super();
        this.namespaceIndex = -1;
        this.nodeId = {} as NodeId;
        this.dataType = '';
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
