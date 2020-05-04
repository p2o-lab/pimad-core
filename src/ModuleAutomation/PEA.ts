import {Actuator, DataAssembly, Sensor} from './DataAssembly';
import {FEA} from './FEA';
import {Service} from './Service';
import {Response, ResponseVendor} from '../Backbone/Response';

abstract class APEA implements PEA {
    protected dataAssemblies: DataAssembly[];
    protected feas: FEA[];
    protected services: Service[];
    protected responseVendor: ResponseVendor;
    protected initialized: boolean;

    constructor() {
        this.feas = [];
        this.dataAssemblies = [];
        this.services = [];
        this.responseVendor = new ResponseVendor();
        this.initialized = false;
    }

    getAllActuators(): Response {
        return this.responseVendor.buyErrorResponse();
    };

    getAllFEAs(): Response {
        return this.responseVendor.buyErrorResponse();
    };

    getAllDataAssemblies(): Response {
        return this.responseVendor.buyErrorResponse();
    };
    getAllSensors(): Response {
        return this.responseVendor.buyErrorResponse();
    };
    getAllServices(): Response {
        return this.responseVendor.buyErrorResponse();
    };
    getActuator(tag: string): Response {
        return this.responseVendor.buyErrorResponse();
    };
    getFEA(tag: string): Response {
        return this.responseVendor.buyErrorResponse();
    };

    getDataAssembly(tag: string): Response {
        return this.responseVendor.buyErrorResponse();
    };
    getSensor(tag: string): Response {
        return this.responseVendor.buyErrorResponse();
    };
    getService(tag: string): Response {
        return this.responseVendor.buyErrorResponse();
    };
    initialize(): boolean {
        if (!this.initialized) {
            this.initialized = true;
            return true;
        } else {
            return false;
        }
    };
}

export class BasePEA extends APEA {

}

export interface PEA {
    getAllActuators(): Response;
    getAllFEAs(): Response;
    getAllDataAssemblies(): Response;
    getAllSensors(): Response;
    getAllServices(): Response;
    getActuator(tag: string): Response;
    getFEA(tag: string): Response;
    getDataAssembly(tag: string): Response;
    getSensor(tag: string): Response;
    getService(tag: string): Response;
    initialize(): boolean;
}

/* Factories */
abstract class APEAFactory implements PEAFactory {
    abstract create(): PEA;
}

export class BasePEAFactory extends APEAFactory {
    create(): PEA {
        return new BasePEA();
    }
}

export interface PEAFactory {
    create(): PEA;
}