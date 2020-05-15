import {NodeId} from "./NodeId";

export interface CommunicationInterfaceData {
    getDescription(): string; //TODO: Data type needs checking
    initialize(): boolean;
}

abstract class ACommunicationInterfaceData implements CommunicationInterfaceData {
    //protected logger: ???
    protected name: string;
    protected initialized: boolean;

    protected constructor() {
        this.name = 'name';
        this.initialized = false;
    };

    abstract getDescription(): string;
    //ToDo: This line needs some fixing...
    // abstract initialize(name: string, serverURL?: string, nameSpaceIndex?: number, nodeId?:NodeId, dataType?:string): boolean;
}

export class OPCUAServerCommunication extends ACommunicationInterfaceData {
    protected serverURL: string;

    getDescription(): string {
        return "This is OPC UA Server Communication";
    };

    initialize(name: string, serverURL: string): boolean {
        if (!this.initialized) {
            this.name = name;
            this.serverURL = serverURL;
            this.initialized = (this.name == name && this.serverURL == serverURL);
            return this.initialized;
        } else {
            return false;
        }
    };

    constructor() {
        super();
        this.serverURL = 'test'
    }

}
export class OPCUANodeCommunication extends ACommunicationInterfaceData {
    protected namespaceIndex: number;
    protected nodeId: NodeId;
    protected dataType: string;

    getDescription(): string {
        return "This is OPC UA Node Communication";
    };

    initialize(name: string, namespaceIndex: number, nodeId: NodeId, dataType: string): boolean {
        if (!this.initialized) {
            this.name = name;
            this.namespaceIndex = namespaceIndex;
            this.nodeId = nodeId;
            this.dataType = dataType;
            this.initialized = (this.name == name && this.namespaceIndex == namespaceIndex && this.nodeId == nodeId && this.dataType == dataType);
            return this.initialized;
        } else {
            return false;
        }
    }

    constructor() {
        super();
        this.namespaceIndex = -1;
        //this.nodeId = any;
        this.dataType = '';
    }
}

/*  Factory */

export interface CommunicationInterfaceDataFactory {
    create(): CommunicationInterfaceData;
}