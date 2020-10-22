import {logger} from '../Utils';
import {AProcedure, InitializeProcedureType, Procedure} from './Procedure';
import {Backbone} from '../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;

abstract class AService extends AProcedure implements Service {
    protected procedures: Procedure[];

    constructor() {
        super();
        this.procedures = [];
    };

    /**
     * @inheritDoc {@link Service.getAllProcedures}
     */
    getAllProcedures(callback: (response: PiMAdResponse, procedures: Procedure[]) => void): void {
        this.genericPiMAdGetter<Procedure[]>(this.procedures, callback);
    }

    /**
     *  @inheritDoc {@link Service.getProcedure}
     */
    getProcedure(name: string, callback: (response: PiMAdResponse, procedure: Procedure) => void): void {
        const localProcedure: Procedure | undefined = this.procedures.find(procedure => {
            let testCondition = false;
            procedure.getName((response, procedureName) => {
                testCondition = name === procedureName;
            });
            return testCondition;
        });
        if(localProcedure === undefined) {
            this.genericPiMAdGetter<Procedure>({} as Procedure, callback);
        } else {
            this.genericPiMAdGetter<Procedure>(localProcedure, callback);
        }
    }

    /**
     * @inheritDoc {@link Service.initialize}
     */
    initialize(instructions: InitializeServiceType): boolean {
        if(!this.initialized) {
            this.attributes = instructions.attributes;
            this.dataAssembly = instructions.dataAssembly;
            this.parameters = instructions.parameter;
            this.procedures = instructions.procedure;
            this.initialized = (JSON.stringify(this.attributes) === JSON.stringify(instructions.attributes)
                && JSON.stringify(this.dataAssembly) === JSON.stringify(instructions.dataAssembly)
                && JSON.stringify(this.parameters) === JSON.stringify(instructions.parameter)
                && JSON.stringify(this.procedures) === JSON.stringify(instructions.procedure)
                && this.moduleAutomationObjectInitialize({
                    dataSourceIdentifier: instructions.dataSourceIdentifier,
                    metaModelRef: instructions.metaModelRef,
                    name: instructions.name,
                    pimadIdentifier: instructions.pimadIdentifier
                })
            );
            return this.initialized;
        } else {
            return false;
        }
    };
}

class BaseService extends AService {

}

export interface ServiceFactory {
    create(): Service;
}

abstract class AServiceFactory implements ServiceFactory {
    abstract create(): Service;
}

export class BaseServiceFactory extends AServiceFactory {
    create(): Service{
        const service = new BaseService();
        logger.debug(this.constructor.name + ' creates a ' + service.constructor.name);
        return service;
    }
}

export type InitializeServiceType = InitializeProcedureType & {
    procedure: Procedure[];
}

export interface Service extends Procedure {

    /**
     * Getter for this.procedures of the service object.
     * @returns A response object.
     */
    getAllProcedures(callback: (response: PiMAdResponse, procedures: Procedure[]) => void): void;

    /**
     * Get a specific procedure of the service object.
     * @param name - The name of the procedure.
     * @param callback - A callback function. The response object shows the status (success if object was initialized
     * || error if not initialized or no match) of the function call via the object-type. The procedure-object is the
     * requested data.
     */
    getProcedure(name: string, callback: (response: PiMAdResponse, procedure: Procedure) => void): void;

    /**
     * Initialize the service object with data. This one works like a constructor.
     * @param attributes - An Array with attributes of the service object..
     * @param dataAssembly - The data assembly of the service object.. F. ex. with the communication interface data.
     * @param dataSourceIdentifier - This variable stores the local identifier of the previous data source.
     * @param metaModelRef - A reference to a metamodel describing the service object.
     * @param name - The name of the service object.
     * @param parameter - An Array with service parameters.
     * @param pimadIdentifier - A unique identifier in the PiMAd-core data model.
     * @param procedure - An Array with service procedures.
     * @returns True for a successful initialisation. False for a not successful initialisation.
     */
    initialize(instructions: InitializeServiceType): boolean;
}

export enum Services {
    BaseService
}

export class ServiceVendor {
    private baseServiceFactory: BaseServiceFactory;

    buy(serviceType: Services): Service {
        switch (serviceType) {
            case Services.BaseService:
                return this.baseServiceFactory.create();
        }
    }

    constructor() {
        this.baseServiceFactory = new BaseServiceFactory();
    }
}

