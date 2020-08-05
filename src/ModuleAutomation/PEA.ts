import {DataAssembly} from './DataAssembly';
import {FEA} from './FEA';
import {Service} from './Service';
import {Response, ResponseVendor} from '../Backbone/Response';
import {BasicSemanticVersion, SemanticVersion} from '../Backbone/SemanticVersion';

export interface PEA {
    /**
     * NOT YET IMPLEMENTED
     * Get a specific actuator of the PEA object.
     * @param tag - The tag of the actuator.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getActuator(tag: string, callback: (response: Response) => void): void;
    /**
     * NOT YET IMPLEMENTED
     * Getter for all actuators  within this.dataAssemblies of the PEA object.
     * @returns A response object.
     */
    getAllActuators(callback: (response: Response) => void): void;
    /**
     * Getter for this.dataAssemblies of the PEA object.
     * @returns A response object.
     */
    getAllDataAssemblies(): Response;
    /**
     * Getter for this.feas of the PEA object.
     * @returns A response object.
     */
    getAllFEAs(): Response;
    /**
     * NOT YET IMPLEMENTED
     * Getter for all sensors within this.dataAssemblies of the PEA object.
     * @returns A response object.
     */
    getAllSensors(callback: (response: Response) => void): void;
    /**
     * Getter for this.services of the PEA object.
     * @returns A response object.
     */
    getAllServices(): Response;
    /**
     * Getter for this.dataModel of the PEA object.
     * @returns A response object.
     */
    getDataModel(): Response;
    /**
     * Getter for this.dataModelVersion of the PEA object.
     * @returns A response object.
     */
    getDataModelVersion(): Response;
    /**
     * Get a specific dataAssembly of the PEA object.
     * @param tag - The tag of the dataAssembly.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getDataAssembly(tag: string, callback: (response: Response) => void): void;
    /**
     * NOT YET IMPLEMENTED
     * Get a specific FEA of the PEA object.
     * @param tag - The tag of the FEA.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getFEA(tag: string, callback: (response: Response) => void): void;
    /**
     * Getter for this.identifier of the PEA object.
     * @returns The identifier of the PEA.
     */
    getIdentifier(): string;
    /**
     * Getter for this.name of the PEA object.
     * @returns The name of the PEA..
     */
    getName(): string;
    /**
     * NOT YET IMPLEMENTED
     * Get a specific sensor of the PEA object.
     * @param tag - The tag of the sensor.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getSensor(tag: string, callback: (response: Response) => void): void;
    /**
     * Get a specific service of the PEA object.
     * @param name - The name of the service.
     * @param callback - A callback function. Use an instance of the interface Response as input.
     */
    getService(name: string, callback: (response: Response) => void): void;
    /**
     * Initialize the PEA object with data. This one works like a constructor.
     * @param DataAssemblies - The data assembly of the PEA object.. F. ex. with the communication interface data.
     * @param DataModel - A reference to a data-model describing the PEA object.
     * @param DataModelVersion - A reference to a data-model version valid for the PEA object.
     * @param Name - The name of the PEA object.
     * @param FEAs - An Array with the PEA related FEAs.
     * @param Services - An Array with the PEA related Services.
     * @returns True for a successful initialisation. False for a not successful initialisation.
     * */
    initialize(data: object): boolean;
}

abstract class APEA implements PEA {
    protected dataAssemblies: DataAssembly[];
    protected dataModel: string; // PiMAd-core DataModel
    protected dataModelVersion: SemanticVersion;
    protected feas: FEA[];
    protected identifier: string;
    protected name: string;
    protected responseVendor: ResponseVendor;
    protected services: Service[];

    protected initialized: boolean;

    constructor() {
        this.dataAssemblies = [];
        this.dataModel = '';
        this.dataModelVersion = new BasicSemanticVersion();
        this.feas = [];
        this.name = 'name: undefined';
        this.identifier = 'identifier: undefined';
        this.responseVendor = new ResponseVendor();
        this.services = [];

        this.initialized = false;
    };

    getActuator(tag: string, callback: (response: Response) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    };
    getAllActuators(callback: (response: Response) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    };
    getAllDataAssemblies(): Response {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.dataAssemblies});
        return response;
    };
    getAllFEAs(): Response {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.feas});
        return response;
    };
    getAllSensors(callback: (response: Response) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    };
    getAllServices(): Response {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.services});
        return response;
    };
    getDataAssembly(tag: string, callback: (response: Response) => void): void {
        this.dataAssemblies.forEach((dataAssembly: DataAssembly) => {
            if(dataAssembly.getTagName() === tag) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', dataAssembly);
                callback(response);
            }
            if(dataAssembly === this.dataAssemblies[this.dataAssemblies.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find dataAssembly <' + tag + '> in PEA <' + this.name + '>', {});
                callback(response);
            }
        })
    };
    getDataModel(): Response{
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.dataModel});
        return response;
    };
    getDataModelVersion(): Response{
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('Success!', {data: this.dataModelVersion});
        return response;
    };
    getFEA(tag: string, callback: (response: Response) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    }
    getIdentifier(): string {
        return this.identifier;
    };
    getName(): string {
        return this.name;
    };
    getSensor(tag: string, callback: (response: Response) => void): void {
        const response = this.responseVendor.buyErrorResponse();
        callback(response);
    };
    getService(name: string, callback: (response: Response) => void): void {
        this.services.forEach((service: Service) => {
            const receive = service.getName().getContent() as {data: string};
            if(receive.data === name) {
                const response = this.responseVendor.buySuccessResponse();
                response.initialize('Success!', service);
                callback(response);
            }
            if(service === this.services[this.services.length -1]) {
                const response = this.responseVendor.buyErrorResponse();
                response.initialize('Could not find service <' + name + '> in PEA <' + this.name + '>', {});
                callback(response);
            }
        })
    };

    initialize(data: BasePEAInitializeDataType): boolean {
        if (!this.initialized) {
            this.dataAssemblies = data.DataAssemblies;
            this.dataModel = data.DataModel;
            this.dataModelVersion = data.DataModelVersion;
            this.feas = data.FEAs;
            this.identifier = data.Identifier;
            this.name = data.Name;
            this.services = data.Services;
            this.initialized = (JSON.stringify(this.dataAssemblies) === JSON.stringify(data.DataAssemblies) &&
                    this.dataModel === data.DataModel &&
                    this.dataModelVersion === data.DataModelVersion &&
                    this.feas === data.FEAs &&
                    this.name === data.Name &&
                    JSON.stringify(this.services) === JSON.stringify(data.Services)
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}

export class BasePEA extends APEA {

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
    Identifier: string;
    FEAs: FEA[];
    Name: string;
    Services: Service[];
}
