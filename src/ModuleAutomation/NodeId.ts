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
    }
    getIdentifier(): Response {
        return this.responseVendor.buyErrorResponse();
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
    initialize(namespaceIndex: number, identifier: string | number): boolean {
        this.namespaceIndex = namespaceIndex;
        this.identifier = identifier;
        return false;
    };
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
    getIdentifier(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The identifier of the node id.', {identifier: this.identifier});
            return response;
        })
    };
    getNodeId(): Response {
        let response: Response
        return this.checkInitialized(() => {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('The node id.', {nodeid: 'ns=' + this.namespaceIndex + ';i=' + this.identifier});
            return response;
        })
    };
    initialize(namespaceIndex: number, identifier: number): boolean {
        if (!this.initialized) {
            //TODO: much more checking: nsi >= 0, id >= 1 ...
            this.namespaceIndex = namespaceIndex;
            this.identifier = identifier as number;
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