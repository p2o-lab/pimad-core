export interface Gate {
    send(): any;
    receive(): any;
    open(): any;
    close(): any;
    initialize(): boolean;
}

export class MTPGate implements Gate {
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
    initialize(): boolean {
        return false
    };
}

/* Factory */

export class FMTPGate implements GateFactory {
    create(): Gate {
        return new MTPGate();
    }
}

export interface GateFactory {
    create(): Gate;
}