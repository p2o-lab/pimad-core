import {Response, ResponseVendor} from '../Backbone/Response';
import fileSystem = require('fs');
import xml2jsonParser = require('xml2json');

abstract class AGate implements Gate {
    protected initialized: boolean;
    protected gateAddress: string | undefined;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.initialized = false;
        this.gateAddress = undefined;
        this.responseVendor = new ResponseVendor();
    }
    abstract send(instructions: {}, callback: (error: {}, data: {}) => void): void;
    abstract receive(instructions: {
        source: string;
    }, callback: (response: Response) => void): void;
    abstract open(): Response;
    abstract close(): any;
    getGateAddress(): string | undefined {
        return this.gateAddress;
    };
    initialize(address: string): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.gateAddress = address;
            return true;
        } else {
            return false;
        }
    };
}

abstract class AFileSystemGate extends AGate {
    protected fileSystem = fileSystem;
}

export class XMLGate extends AFileSystemGate {

    send(instructions: {}, callback: (error: {}, data: {}) => void): void {
        callback(true, {})
    };
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
    open(): Response {
        return this.responseVendor.buyErrorResponse();
    };
    close(): Response {
        return this.responseVendor.buyErrorResponse();
    };
}

export interface Gate {
    // TODO: Time for callbacks, async!!
    /**
     * Write data to the source via the gate.
     * @param instructions
     * @param callback
     */
    send(instructions: {}, callback: (error: {}, data: {}) => void): void;
    /**
     * Asynchronous: Send a request to the source and receive theirs answer.
     * @param instructions
     * @param callback
     */
    receive(instructions: {
        source: string;
    }, callback: (response: Response) => void): void;
    // TODO: What to do with open()/close() ???
    open(): Response;
    close(): Response;
    getGateAddress(): string | undefined;
    initialize(address: string): boolean;
}

/* Factory */

export class XMLGateFactory implements GateFactory {
    create(): Gate {
        return new XMLGate();
    }
}

export interface GateFactory {
    create(): Gate;
}