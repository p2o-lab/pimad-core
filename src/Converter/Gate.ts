abstract class AGate implements Gate {
    protected initialized: boolean;
    protected gateAddress: string | undefined;

    constructor() {
        this.initialized = false;
        this.gateAddress = undefined;
    }

    abstract send(): any;
    abstract receive(): any;
    abstract open(): any;
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
    open(): any {
        return false
    };
    close(): any {
        return false
    };
}

export interface Gate {
    send(): any;
    receive(): any;
    open(): any;
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