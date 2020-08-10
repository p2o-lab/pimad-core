import {NodeId} from './NodeId';
import {logger} from '../Utils';

export interface CommunicationInterfaceData {
    getDescription(): object;
    initialize(ciObject: object): boolean;
}

abstract class ACommunicationInterfaceData implements CommunicationInterfaceData {
    protected name: string;
    protected initialized: boolean;

    protected constructor() {
        this.name = '';
        this.initialized = false;
    };

    abstract getDescription(): object;
    abstract initialize(ciObject: object): boolean;
}

export class OPCUAServerCommunication extends ACommunicationInterfaceData {
    protected serverURL: string;

    constructor() {
        super();
        this.serverURL = '';
    }

    getDescription(): object{
        return {name:this.name, serverURL:this.serverURL};
    }

    initialize(ciObject: {name: string ; serverURL: string}): boolean {
        if (!this.initialized) {
            this.name = ciObject.name;
            this.serverURL = ciObject.serverURL;
            this.initialized = (this.name == ciObject.name && this.serverURL == ciObject.serverURL);
            return this.initialized;
        } else {
            return false;
        }
    };

}
export class OPCUANodeCommunication extends ACommunicationInterfaceData {
    protected namespaceIndex: number|string;
    protected nodeId: NodeId;
    protected dataType: string;

    getDescription(): object {
        return {name:this.name, namespaceIndex:this.namespaceIndex, nodeId:this.nodeId, dataType: this.dataType};
    };

    initialize(ciObject: {name: string; namespaceIndex: number|string; nodeId: NodeId; dataType: string}): boolean {
        if (!this.initialized) {
            this.name = ciObject.name;
            this.namespaceIndex = ciObject.namespaceIndex;
            this.nodeId = ciObject.nodeId;
            this.dataType = ciObject.dataType;
            this.initialized = (this.name == ciObject.name && this.namespaceIndex == ciObject.namespaceIndex && this.nodeId == ciObject.nodeId && this.dataType == ciObject.dataType);
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
    create(): CommunicationInterfaceData{
        const communicationInterfaceData = new OPCUANodeCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return communicationInterfaceData;}
}
export class OPCUAServerCommunicationFactory extends ACommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData{
        const communicationInterfaceData = new OPCUAServerCommunication();
        logger.debug(this.constructor.name + ' creates a ' + communicationInterfaceData.constructor.name);
        return communicationInterfaceData;}
}
