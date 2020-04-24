
abstract class AActuator {}
abstract class ASensor {}

export interface PEA {
    getAllActuators(): Actuator[];
    getAllFEAs(): FEA[];
    getAllProcessValues(): ProcessValue[];
    getAllSensors(): Sensor[];
    getAllServices(): Service[];
    getActuator(tag: string): Actuator;
    getFEA(tag: string): FEA;
    getProcessValue(tag: string): ProcessValue;
    getSensor(tag: string): Sensor;
    getService(tag: string): Service;
    initialize(): boolean;
}

export interface FEA {
    initialize(): boolean;
}
export interface ProcessValue {
    initialize(): boolean;
}
export interface Service {
    initialize(): boolean;
}
export interface Actuator extends ProcessValue {
    initialize(): boolean;
}
export interface Sensor extends ProcessValue {
    initialize(): boolean;
}

/* Factories */

export interface PEAFactory {
    create(): PEA;
}