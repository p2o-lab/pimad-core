import {logger} from '../Utils/Logger';
import {Response, ResponseVendor} from '../Backbone/Response';

export interface NodeId {
    getNamespaceIndex(): Response;
    getIdentifier(): Response;
    getNodeId(): Response;
    initialize(namespaceIndex: number, identifier: string | number): boolean;
}

abstract class ANodeId implements NodeId {
    protected namespaceIndex: number;
    protected identifier: string | number = '';
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;
    protected constructor () {
        this.namespaceIndex = -1;
        this.initialized = false;
        this.responseVendor = new ResponseVendor()
    };
    getIdentifier(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The identifier index of the node id.', {identifier: this.identifier});
            return response;
        })
    };
    getNamespaceIndex(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The namespace index of the node id.', {namespaceIndex: this.namespaceIndex});
            return response;
        })
    };
    abstract getNodeId(): Response;
    abstract initialize(namespaceIndex: number, identifier: string | number): boolean;
    protected checkInitialized(callbackTrue: () => Response): Response {
        let response: Response
        if(this.initialized) {
            response = callbackTrue()
        } else {
            response = this.responseVendor.buyErrorResponse();
            response.initialize('NodeId-Object not initialized yet!', {});
        }
        return response
    };
}

export class NumericNodeId extends ANodeId {
    protected identifier: number;
    getNodeId(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';i=' + this.identifier});
            return response;
        })
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

export class StringNodeId extends ANodeId {
    protected identifier: string;
    getNodeId(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';s=' + this.identifier});
            return response;
        })
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

export class QpaqueNodeId extends StringNodeId {
    protected identifier: string;
    getNodeId(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';b=' + this.identifier});
            return response;
        })
    };
    constructor() {
        super();
        this.identifier = '';
    };
}

export class GUIDNodeId extends StringNodeId {
    protected identifier: string;
    getNodeId(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeId: 'ns=' + this.namespaceIndex + ';g=' + this.identifier});
            return response;
        })
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