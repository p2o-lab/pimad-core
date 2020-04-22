
abstract class Actuator {}
abstract class Sensor {}

export interface IPEA {
    getAllActuators(): IActuator[];
    getAllFEAs(): IFEA[];
    getAllProcessValues(): IProcessValue[];
    getAllSensors(): ISensor[];
    getAllServices(): IService[];
    getActuator(tag: string): IActuator;
    getFEA(tag: string): IFEA;
    getProcessValue(tag: string): IProcessValue;
    getSensor(tag: string): ISensor;
    getService(tag: string): IService;
    initialize(): boolean;
}

export interface IFEA {}
export interface IProcessValue {}
export interface IService {}
export interface ISensor extends IProcessValue {}
export interface IActuator extends IProcessValue {}

/* Factories */

export interface IFPEA {
    create(): IPEA;
}