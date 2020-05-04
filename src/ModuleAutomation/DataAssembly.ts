export interface DataAssembly {
    initialize(): boolean;
}

export interface Actuator extends DataAssembly {
    initialize(): boolean;
}
export interface Sensor extends DataAssembly {
    initialize(): boolean;
}