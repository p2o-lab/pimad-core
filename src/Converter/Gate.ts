export interface IGate {
    send(): any;
    receive(): any;
    open(): any;
    close(): any;
    initialize(): boolean;
}

export interface IFGate {
    create(): IGate;
}