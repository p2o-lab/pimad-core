import {Response, ResponseVendor} from '../Backbone/Response';
import fileSystem = require('fs-extra');
import xml2jsonParser = require('xml2json');
import {logger} from '../Utils/Logger';

abstract class AGate implements Gate {
    protected initialized: boolean;
    protected gateAddress: string | undefined;
    protected responseVendor: ResponseVendor;

    protected constructor() {
        this.initialized = false;
        this.gateAddress = undefined;
        this.responseVendor = new ResponseVendor();
    }
    public send(instructions: object, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse()
        localResponse.initialize('Not implemented yet!', {})
        callback(localResponse)
    };
    abstract receive(instructions: object, callback: (response: Response) => void): void;
    /*abstract open(): Response;
    abstract close(): Response;*/
    getGateAddress(): string | undefined {
        return this.gateAddress;
    };
    initialize(address: string): boolean {
        if (!this.initialized) {
            this.gateAddress = address;
            this.initialized = (this.gateAddress == address);
            return this.initialized;
        } else {
            return false;
        }
    };
}

abstract class AFileSystemGate extends AGate {
    protected fileSystem = fileSystem;
    constructor() {
        super();
    }
}

export class XMLGate extends AFileSystemGate {

    /*send(instructions: object, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse()
        localResponse.initialize('Not implemented yet!', {})
        callback(localResponse)
    }; */
    receive(instructions: {
        source: string;
    }, callback: (response: Response) => void): void {
        this.fileSystem.readFile(instructions.source, (error: NodeJS.ErrnoException | null, data: Buffer) => {
            if (!error) {
                const json: {} = xml2jsonParser.toJson(data.toString(), {object: true});
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', {data: json})
                callback(response);
            } else {
                callback(this.responseVendor.buyErrorResponse())
            }
        })
    };
    /*open(): Response {
        return this.responseVendor.buyErrorResponse();
    };
    close(): Response {
        return this.responseVendor.buyErrorResponse();
    };*/
}

export class ZIPGate extends AFileSystemGate {
    receive(instructions: object, callback: (response: Response) => void): void {

    }
}

export class MockGate extends AGate {

    send(instructions: object, callback: (response: Response) => void): void {
        logger.debug('Send ' + instructions + ' to ' + this.getGateAddress());
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('This is a send-response of a mock gate.', instructions)
        callback(response);
    };
    receive(instructions: object, callback: (response: Response) => void): void {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('This is a receive-response of a mock gate.', instructions)
        callback(response);
    };
    constructor() {
        super();
        this.gateAddress = 'Valinor';
    }
}

export interface Gate {
    /**
     * Write data to the source via the gate.
     * @param instructions - A set of instructions, configuring the gate while sending.
     * @param callback - Concerning asynchronous behaviour, return data via a callback function.
     */
    send(instructions: object, callback: (response: Response) => void): void;
    /**
     * Asynchronous: Send a request to the source and receive theirs answer.
     * @param instructions - A set of instructions, configuring the gate while receiving.
     * @param callback - Concerning asynchronous behaviour, return data via a callback function.
     */
    receive(instructions: object, callback: (response: Response) => void): void;
    // TODO: What to do with open()/close() ???
    //open(): Response;
    //close(): Response;
    getGateAddress(): string | undefined;
    initialize(address: string): boolean;
}

/* Factory */

abstract class AGateFactory implements GateFactory {
    abstract create(): Gate;
}

export class MockGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new MockGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export class XMLGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new XMLGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export class ZIPGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new ZIPGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export interface GateFactory {
    create(): Gate;
}