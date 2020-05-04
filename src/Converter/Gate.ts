import {Response, ResponseVendor} from '../Backbone/Response';
import fs from 'fs'

abstract class AGate implements Gate {
    protected initialized: boolean;
    protected gateAddress: string | undefined;
    protected responseVendor: ResponseVendor

    constructor() {
        this.initialized = false;
        this.gateAddress = undefined;
        this.responseVendor = new ResponseVendor();
    }

    abstract send(): any;
    abstract receive(): any;
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

export class FileSystemGate extends AGate {
    private file: any;

    send(): any {
        return false
    };
    receive(): any {
        return false
    };
    open(): Response {
        return this.responseVendor.buyErrorResponse()
    };
    close(): any {
        return false
    };
}

export interface Gate {
    send(): any;
    receive(): any;
    open(): Response;
    close(): any;
    getGateAddress(): string | undefined;
    initialize(address: string): boolean;
}

/* Factory */

export class FileSystemGateFactory implements GateFactory {
    create(): Gate {
        return new FileSystemGate();
    }
}

export interface GateFactory {
    create(): Gate;
}