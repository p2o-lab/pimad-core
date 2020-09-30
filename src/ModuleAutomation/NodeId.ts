import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import {AModuleAutomationObject, ModuleAutomationObject} from './ModuleAutomationObject';

export interface NodeId extends ModuleAutomationObject {
    getIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void;
    getNamespaceIndex(callback: (response: PiMAdResponse, namespaceIndex: number) => void): void;
    getNodeId(callback: (response: PiMAdResponse, nodeId: string) => void): void;
    initialize(instructions: {namespaceIndex: number; identifier: string}): boolean;
}

abstract class ANodeId<IdentifierType> extends AModuleAutomationObject implements NodeId {
    protected namespaceIndex: number;
    protected identifier: IdentifierType;

    protected constructor () {
        super();
        this.namespaceIndex = -1;
        this.identifier = {} as IdentifierType;
    };

    protected setNamespaceIndex(namespaceIndex: number): boolean {
        if(namespaceIndex < 0) {
            return false;
        } else {
            this.namespaceIndex = namespaceIndex;
            return true;
        }
    }

    getNamespaceIndex(callback: (response: PiMAdResponse, namespaceIndex: number) => void): void {
        this.genericPiMAdGetter<number>(this.namespaceIndex, callback);
    };

    getIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void {
        this.genericPiMAdGetter<string>('' + this.identifier, callback);
    };

    abstract getNodeId(callback: (response: PiMAdResponse, nodeId: string) => void): void;

    initialize(instructions: {namespaceIndex: number; identifier: string}): boolean {
        if(!this.initialized) {
            this.identifier = instructions.identifier as unknown as IdentifierType;
            if(!this.setNamespaceIndex(instructions.namespaceIndex)) {
                return false;
            }
            this.initialized = (
                this.identifier === instructions.identifier as unknown as IdentifierType &&
                this.namespaceIndex === instructions.namespaceIndex
            );
            return this.initialized;
        } else {
            return false;
        }
    };

    /*getIdentifier(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The identifier index of the node id.', {identifier: this.identifier});
            return response;
        });
    };*/
    /*getNamespaceIndex(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The namespace index of the node id.', {namespaceIndex: this.namespaceIndex});
            return response;
        });
    };*/
    //abstract getNodeId(): PiMAdResponse;
    //abstract initialize(namespaceIndex: number, identifier: string | number): boolean;
    /*protected checkInitialized(callbackTrue: () => PiMAdResponse): PiMAdResponse {
        let response: PiMAdResponse;
        if(this.initialized) {
            response = callbackTrue();
        } else {
            response = this.responseVendor.buyErrorResponse();
            response.initialize('NodeId-Object not initialized yet!', {});
        }
        return response;
    }; */
}

/*class BaseNodeId extends ANodeId {
    protected identifier: number;
    getNodeId(): PiMAdResponse {
        return this.responseVendor.buyErrorResponse();
    };
    initialize(namespaceIndex: number, identifier: number): boolean {
            return false;
    }
    constructor() {
        super();
        this.identifier = -1;
    }
}*/

class NumericNodeId extends ANodeId<number> {

    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';i=' + this.identifier, callback);
    }

    initialize(instructions: {namespaceIndex: number; identifier: string}): boolean {
        if(!this.initialized) {
            if(isNaN(Number(instructions.identifier)) || (Number(instructions.identifier) <= 1)) {
                return false;
            } else {
                this.identifier = Number(instructions.identifier);
            }
            if(!this.setNamespaceIndex(instructions.namespaceIndex)) {
                return false;
            }
            this.initialized = (
                String(this.identifier) === instructions.identifier &&
                this.namespaceIndex === instructions.namespaceIndex
            );
            return this.initialized;
        } else {
            return false;
        }
    };

    constructor() {
        super();
        this.identifier = -1;
    }
}

class StringNodeId extends ANodeId<string> {
    /*getNodeId(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';s=' + this.identifier});
            return response;
        });
    };*/
    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';s=' + this.identifier, callback);
    }

    /*initialize(namespaceIndex: number, identifier: string): boolean {
        if (!this.initialized) {
            this.namespaceIndex = namespaceIndex;
            this.identifier = identifier;
            this.initialized = (this.namespaceIndex == namespaceIndex && this.identifier == identifier);
            return this.initialized;
        } else {
            return false;
        }
    };*/
    constructor() {
        super();
        this.identifier = 'identifier: not initialized';
    };
}

class QpaqueNodeId extends StringNodeId {

    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';b=' + this.identifier, callback);
    };

    constructor() {
        super();
    };
}

class GUIDNodeId extends StringNodeId {

    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';g=' + this.identifier, callback);
    };

    constructor() {
        super();
    };
}

/* Factory */

export interface NodeIdFactory {
    create(): NodeId;
}

abstract class ANodeIdFactory implements NodeIdFactory {
    abstract create(): NodeId;
}

/*export class BaseNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new BaseNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}*/

export class NumericNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new NumericNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

export class StringNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new StringNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

export class QpaqueNodeIdFactory extends StringNodeIdFactory {
    create(): NodeId  {
        const nodeId = new QpaqueNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

export class GUIDNodeIdFactory extends StringNodeIdFactory {
    create(): NodeId  {
        const nodeId = new GUIDNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}
