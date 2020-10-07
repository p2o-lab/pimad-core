import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import {AModuleAutomationObject, ModuleAutomationObject} from './ModuleAutomationObject';
import {NodeIdTypeEnum} from 'PiMAd-types';
import PiMAdResponse = Backbone.PiMAdResponse;

/**
 * This interface describes an OPC-UA-NodeId for PiMAd-data-model. There is no OPC-UA connection, client or something
 * else. It models just the pure connection data. Use the data in your clients... For a detailed overview of
 * OPC-UA-NodeIds look at https://documentation.unified-automation.com/uasdkhp/1.0.0/html/_l2_ua_node_ids.html
 *
 * <uml>
 *     interface ModuleAutomationObject
 *
 *     interface NodeId {
 *         +getNodeIdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void
 *         +getNamespaceIndex(callback: (response: PiMAdResponse, namespaceIndex: number) => void): void
 *         +getNodeId(callback: (response: PiMAdResponse, nodeId: string) => void): void
 *         +initialize(instructions: {namespaceIndex: number; identifier: string}): boolean
 *     }
 *
 *     abstract class AModuleAutomationObject
 *
 *     abstract class ANodeId<IdentifierType> {
 *         #namespaceIndex: number = -1
 *         #identifier: IdentifierType
 *         {abstract} abstract getNodeId(callback: (response: PiMAdResponse, nodeId: string) => void): void
 *         #setNamespaceIndex(namespaceIndex: number): boolean
 *         +getNamespaceIndex(callback: (response: PiMAdResponse, namespaceIndex: number) => void): void
 *         +getNodeIdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void
 *         +initialize(instructions: {namespaceIndex: number; identifier: string}): boolean
 *     }
 *
 *     class NumericNodeId<number> {
 *         #identifier: number = -1
 *         +getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void
 *         +initialize(instructions: {namespaceIndex: number; identifier: string}): boolean
 *     }
 *
 *     class StringNodeId<string> {
 *         #identifier: string = 'identifier: not initialized'
 *         +getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void
 *     }
 *
 *     class QpaqueNodeId {
 *         +getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void
 *     }
 *
 *     class GUIDNodeId {
 *         +getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void
 *     }
 *
 *     ModuleAutomationObject <|-- NodeId
 *     AModuleAutomationObject <|-- ANodeId
 *     ModuleAutomationObject <|.. AModuleAutomationObject
 *     NodeId <|.. ANodeId
 *     ANodeId <|-- NumericNodeId
 *     ANodeId <|-- StringNodeId
 *     StringNodeId <|-- GUIDNodeId
 *     StringNodeId <|-- QpaqueNodeId
 * </uml>
 */
export interface NodeId extends ModuleAutomationObject {
    /**
     * Getter for the identifier part of an opcua-nodeId.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the identifier object the requested data.
     */
    getNodeIdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void;

    /**
     * Getter for the namespace part of an opcua-nodeId.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the namespaceIndex object the requested data.
     */
    getNamespaceIndex(callback: (response: PiMAdResponse, namespaceIndex: number) => void): void;

    /**
     * Get the hole nodeId as string. Like toString() but via callback.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request, while the nodeId object the standard conform combination of namespace-index
     * and identifier as a string.
     */
    getNodeId(callback: (response: PiMAdResponse, nodeId: string) => void): void;

    /**
     * Initialize the NodeId object with namespace-index and identifier.
     * @param instructions - Pass the namespace-index and identifier of OPC-UA-NodeIds to the instance. Namespace-index
     * and identifier follows the rules of the opc foundation. The first one must be >= zero, the second one > zero.
     */
    initialize(instructions: {namespaceIndex: number; identifier: string}): boolean;
}

abstract class ANodeId<IdentifierType> extends AModuleAutomationObject implements NodeId {
    protected namespaceIndex: number;
    protected identifier: IdentifierType;

    protected constructor() {
        super();
        this.namespaceIndex = -1;
        this.identifier = {} as IdentifierType;
    };

    /**
     * A general but protected setter for the namespace index of the OPC-UA-NodeId. Main goal: reduce code duplication.
     * @param namespaceIndex - The namespace index as number. Follows the rules of the standard and must be >= zero.
     * @protected
     */
    protected setNamespaceIndex(namespaceIndex: number): boolean {
        if(namespaceIndex < 0) {
            return false;
        } else {
            this.namespaceIndex = namespaceIndex;
            return true;
        }
    };

    /**
     * @inheritDoc {@link NodeId.getNamespaceIndex}
     */
    getNamespaceIndex(callback: (response: PiMAdResponse, namespaceIndex: number) => void): void {
        this.genericPiMAdGetter<number>(this.namespaceIndex, callback);
    };

    /**
     * @inheritDoc {@link NodeId.getNodeIdIdentifier}
     */
    getNodeIdIdentifier(callback: (response: PiMAdResponse, identifier: string) => void): void {
        this.genericPiMAdGetter<string>('' + this.identifier, callback);
    };

    /**
     * @inheritDoc {@link NodeId.getNodeId}
     */
    abstract getNodeId(callback: (response: PiMAdResponse, nodeId: string) => void): void;

    /**
     * @inheritDoc {@link NodeId.initialize}
     */
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
}

/**
 * Model for numeric OPC-UA-NodeId.
 */
class NumericNodeId extends ANodeId<number> {
    /**
     * Get the nodeId as string. Like toString() ... , but via callback.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request via the object-type, while the nodeId object the standard conform combination
     * of namespace-index and identifier as a string. In case of a StringNodeId it's something like:
     * ns=($namespace-index);i=($identifier)
     */
    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';i=' + this.identifier, callback);
    }

    /**
     * Initialize the numeric NodeId object with namespace-index and identifier. Caution: The string identifier will be
     * converted to a number and has to pass a validation process afterwards.
     * @param instructions - Pass the namespace-index and identifier of OPC-UA-NodeIds to the instance.
     */
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

/**
 * Model for String-OPC-UA-NodeId.
 */
class StringNodeId extends ANodeId<string> {

    /**
     * Get the nodeId as string. Like toString() ... , but via callback.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request via the object-type, while the nodeId object the standard conform combination
     * of namespace-index and identifier as a string. In case of a StringNodeId it's somthing like:
     * ns=($namespace-index);s=($identifier)
     */
    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';s=' + this.identifier, callback);
    }

    constructor() {
        super();
        this.identifier = 'identifier: not initialized';
    };
}

/**
 * Model for Qpaque-OPC-UA-NodeId.
 */
class QpaqueNodeId extends StringNodeId {
    /**
     * Get the nodeId as string. Like toString() ... , but via callback.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request via the object-type, while the nodeId object the standard conform combination
     * of namespace-index and identifier as a string. In case of a StringNodeId it's something like:
     * ns=($namespace-index);b=($identifier)
     */
    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';b=' + this.identifier, callback);
    };

    constructor() {
        super();
    };
}

/**
 * Model for GUID-OPC-UA-NodeId.
 */
class GUIDNodeId extends StringNodeId {
    /**
     * Get the nodeId as string. Like toString() ... , but via callback.
     * @param callback - A callback function. The response object shows the status (success while object was initialized
     * or error while not) of the request via the object-type, while the nodeId object the standard conform combination
     * of namespace-index and identifier as a string. In case of a StringNodeId it's something like:
     * ns=($namespace-index);g=($identifier)
     */
    getNodeId(callback: (response: Backbone.PiMAdResponse, nodeId: string) => void): void {
        this.genericPiMAdGetter('ns=' + this.namespaceIndex + ';g=' + this.identifier, callback);
    };

    constructor() {
        super();
    };
}

/**
 * The Factories create all kind of OPC-UA-NodeIds.
 */
export interface NodeIdFactory {
    /**
     * Create a new instance of OPC-UA-{@link NodeId}.
     */
    create(): NodeId;
}

abstract class ANodeIdFactory implements NodeIdFactory {
    abstract create(): NodeId;
}

/**
 * This factory creates {@link NumericNodeId}s.
 */
export class NumericNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new NumericNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

/**
 * This factory creates {@link StringNodeId}s.
 */
export class StringNodeIdFactory extends ANodeIdFactory {
    create(): NodeId {
        const nodeId = new StringNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

/**
 * This factory creates {@link QpaqueNodeId}'s.
 */
export class QpaqueNodeIdFactory {
    create(): NodeId  {
        const nodeId = new QpaqueNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

/**
 * This factory creates {@link GUIDNodeId}'s.
 */
export class GUIDNodeIdFactory {
    create(): NodeId  {
        const nodeId = new GUIDNodeId();
        logger.debug(this.constructor.name + ' creates a ' + nodeId.constructor.name);
        return nodeId;
    }
}

export class NodeIdVendor {
    private numericNodeIdFactory: NodeIdFactory = new NumericNodeIdFactory();
    private stringNodeIdFactory: NodeIdFactory = new StringNodeIdFactory();
    private qpaqueNodeIdFactory: NodeIdFactory = new QpaqueNodeIdFactory();
    private gUIDNodeIdFactory: NodeIdFactory = new GUIDNodeIdFactory();

    buy(type: NodeIdTypeEnum): NodeId {
        switch (type) {
            case NodeIdTypeEnum.GUID:
                return this.gUIDNodeIdFactory.create();
            case NodeIdTypeEnum.NUMERIC:
                return this.numericNodeIdFactory.create();
            case NodeIdTypeEnum.OPAQUE:
                return this.qpaqueNodeIdFactory.create();
            case NodeIdTypeEnum.STRING:
                return this.stringNodeIdFactory.create();
        }
    }
}
