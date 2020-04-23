export interface IGate {
    send(): any;
    receive(): any;
    open(): any;
    close(): any;
    initialize(): boolean;
}

export class MTPGate implements IGate {
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

export class FMTPGate implements IFGate {
    create(): IGate {
        return new MTPGate();
    }
}

export interface IFGate {
    create(): IGate;
}