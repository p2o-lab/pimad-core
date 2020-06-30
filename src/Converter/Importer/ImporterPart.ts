import {Response, ResponseVendor} from '../../Backbone/Response';
import {
    CommunicationInterfaceData, CommunicationInterfaceDataFactory,
    OPCUAServerCommunicationFactory
} from '../../ModuleAutomation/CommunicationInterfaceData';
import {Actuator, DataAssembly, DataAssemblyFactory, Sensor} from '../../ModuleAutomation/DataAssembly';

abstract class AImporterPart implements ImporterPart {
    protected responseVendor: ResponseVendor

    extract(data: object, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse()
        localResponse.initialize('Not implemented yet!', {})
        callback(localResponse)
    }
    constructor() {
        this.responseVendor = new ResponseVendor();
    }
}

export class HMIPart extends AImporterPart {

}

/**
 * Handles the 'MTPPart' of a ModuleTypePackage file. This means CommunicationSet, HMISet, ServiceSet, ...
 */
export class MTPPart extends AImporterPart {
    private opcuaServerCommunicationFactory: CommunicationInterfaceDataFactory;

    extract(data: {CommunicationSet: object, HMISet: object, ServiceSet: object, TextSet: object}, callback: (response: Response) => void): void {
        const communicationSet = this.extractCommunicationSet(data.CommunicationSet);
        super.extract(data, callback);
    }

    /**
     * Extract the CommunicationSet
     * @param data
     */
    private extractCommunicationSet(data: {}): {
        CommunicationInterfaceData: CommunicationInterfaceData,
        DataAssemblies: DataAssembly[]
    }  {
        let communicationInterfaceData = this.opcuaServerCommunicationFactory.create();
        let dataAssemblies: DataAssembly[] = []

        return {
            CommunicationInterfaceData: communicationInterfaceData,
            DataAssemblies: dataAssemblies
        }
    }

    constructor() {
        super();
        this.opcuaServerCommunicationFactory = new OPCUAServerCommunicationFactory();
    }
}
export class ServicePart extends AImporterPart {

}
export class TextPart extends AImporterPart {

}

/**
 * Importers consist of individual parts that each extract specific sections of the information model.
 */
export interface ImporterPart {
    /**
     * Extracts data based on a specific information model and converts it into the internal data model of PiMAd.
     * @param data The data source.
     * @param callback Return the results via callback-function.
     */
    extract(data: object, callback: (response: Response) => void): void;
}