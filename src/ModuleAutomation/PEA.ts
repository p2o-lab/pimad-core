import {Actuator, DataAssembly, Sensor} from './DataAssembly';
import {FEA} from './FEA';
import {Service} from './Service';
import {Response, ResponseVendor} from '../Backbone/Response';
import {BasicSemanticVersion, SemanticVersion} from '../Backbone/SemanticVersion';

abstract class APEA implements PEA {
    protected dataAssemblies: DataAssembly[];
    protected dataModel: string; // PiMAd-core DataModel
    protected feas: FEA[];
    protected name: string;
    protected services: Service[];
    protected responseVendor: ResponseVendor;
    protected initialized: boolean;
    protected dataModelVersion: SemanticVersion;

    constructor() {
        this.feas = [];
        this.dataAssemblies = [];
        this.dataModel = '';
        this.dataModelVersion = new BasicSemanticVersion();
        this.name = 'name: undefined';
        this.services = [];
        this.responseVendor = new ResponseVendor();
        this.initialized = false;
    };

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
    initialize(data: BasePEAInitializeDataType): boolean {
        if (!this.initialized) {
            this.dataAssemblies = data.DataAssemblies;
            this.dataModel = data.DataModel;
            this.dataModelVersion = data.DataModelVersion;
            this.feas = data.FEAs;
            this.name = data.Name;
            this.services = data.Services
            this.initialized = (JSON.stringify(this.dataAssemblies) === JSON.stringify(data.DataAssemblies) &&
                    this.dataModel === data.DataModel &&
                    this.dataModelVersion === data.DataModelVersion &&
                    this.feas === data.FEAs &&
                    this.name === data.Name &&
                    JSON.stringify(this.services) === JSON.stringify(data.Services)
            )
            return this.initialized;
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
    initialize(data: object): boolean;
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

export type BasePEAInitializeDataType = {
    DataAssemblies: DataAssembly[];
    DataModel: string; // PiMAd-core DataModel
    DataModelVersion: SemanticVersion;
    FEAs: FEA[];
    Name: string;
    Services: Service[];
}