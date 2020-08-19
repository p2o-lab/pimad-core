import {NodeId} from './NodeId';
import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import PiMAdResponseHandler = Backbone.PiMAdResponseHandler;
import PiMAdResponseTypes = Backbone.PiMAdResponseTypes;

export interface CommunicationInterfaceData {
    getInterfaceData(): object;
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

    abstract getInterfaceData(): object;
    abstract initialize(interfaceDescription: object): boolean;
}

export class OPCUAServerCommunication extends ACommunicationInterfaceData {
    protected serverURL: string;

    constructor() {
        super();
        this.serverURL = '';
    }

    getInterfaceData(): {name: string; serverURL: string} {
        return { name: this.name, serverURL: this.serverURL};
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

    getInterfaceData(): object {
        return {name:this.name, namespaceIndex:this.namespaceIndex, nodeId:this.nodeId, dataType: this.dataType};
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

abstract class ACommunicationInterfaceDataFactory implements CommunicationInterfaceDataFactory {
    abstract create(): CommunicationInterfaceData;
}

export class OPCUANodeCommunicationFactory extends ACommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData {
        const communicationInterfaceData = new OPCUANodeCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return communicationInterfaceData;
    }
}

export class OPCUAServerCommunicationFactory extends ACommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData {
        const communicationInterfaceData = new OPCUAServerCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return new OPCUAServerCommunication();
    }
}
