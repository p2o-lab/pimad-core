import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;

export interface NodeId {
    getNamespaceIndex(): PiMAdResponse;
    getIdentifier(): PiMAdResponse;
    getNodeId(): PiMAdResponse;
    initialize(namespaceIndex: number, identifier: string | number): boolean;
}

abstract class ANodeId implements NodeId {
    protected namespaceIndex: number;
    protected identifier: string | number = '';
    protected initialized: boolean;
    protected responseVendor: PiMAdResponseVendor;
    protected constructor () {
        this.namespaceIndex = -1;
        this.initialized = false;
        this.responseVendor = new PiMAdResponseVendor();
    };
    getIdentifier(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The identifier index of the node id.', {identifier: this.identifier});
            return response;
        });
    };
    getNamespaceIndex(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The namespace index of the node id.', {namespaceIndex: this.namespaceIndex});
            return response;
        });
    };
    abstract getNodeId(): PiMAdResponse;
    abstract initialize(namespaceIndex: number, identifier: string | number): boolean;
    protected checkInitialized(callbackTrue: () => PiMAdResponse): PiMAdResponse {
        let response: PiMAdResponse;
        if(this.initialized) {
            response = callbackTrue();
        } else {
            response = this.responseVendor.buyErrorResponse();
            response.initialize('NodeId-Object not initialized yet!', {});
        }
        return response;
    };
}

class BaseNodeId extends ANodeId {
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
}

class NumericNodeId extends ANodeId {
    protected identifier: number;
    getNodeId(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';i=' + this.identifier});
            return response;
        });
    };
    initialize(namespaceIndex: number, identifier: number): boolean {
        if (!this.initialized) {
            //TODO: much more checking: nsi >= 0, id >= 1 ...
            this.namespaceIndex = namespaceIndex;
            this.identifier = identifier;
            this.initialized = (this.namespaceIndex == namespaceIndex && this.identifier == identifier);
            return this.initialized;
        } else {
            return false;
        }
    }
    constructor() {
        super();
        this.identifier = -1;
    }
}

class StringNodeId extends ANodeId {
    protected identifier: string;
    getNodeId(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';s=' + this.identifier});
            return response;
        });
    };
    initialize(namespaceIndex: number, identifier: string): boolean {
        if (!this.initialized) {
            this.namespaceIndex = namespaceIndex;
            this.identifier = identifier;
            this.initialized = (this.namespaceIndex == namespaceIndex && this.identifier == identifier);
            return this.initialized;
        } else {
            return false;
        }
    };
    constructor() {
        super();
        this.identifier = '';
    };
}

class QpaqueNodeId extends StringNodeId {
    protected identifier: string;
    getNodeId(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';b=' + this.identifier});
            return response;
        });
    };
    constructor() {
        super();
        this.identifier = '';
    };
}

class GUIDNodeId extends StringNodeId {
    protected identifier: string;
    getNodeId(): PiMAdResponse {
        return this.checkInitialized(() => {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';g=' + this.identifier});
            return response;
        });
    };
    constructor() {
        super();
        this.identifier = '';
    };
}

/* Factory */

export interface NodeIdFactory {
    create(): NodeId;
}

abstract class ANodeIdFactory implements NodeIdFactory {
    abstract create(): NodeId;
}

export class BaseNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new BaseNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

export class NumericNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new NumericNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

export class QpaqueNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new QpaqueNodeId();
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

export class GUIDNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new GUIDNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}
