import {Response, ResponseVendor} from '../../Backbone/Response';
import {
    CommunicationInterfaceData, CommunicationInterfaceDataFactory,
    OPCUAServerCommunicationFactory
} from '../../ModuleAutomation/CommunicationInterfaceData';
import {Actuator, DataAssembly, DataAssemblyFactory, Sensor} from '../../ModuleAutomation/DataAssembly';
import { DataItemInstanceList } from 'AML';

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

    /**
     * Parsing the relevant data of the ModuleTypePackage-object and copy that to different instances of PiMAd-core-IM.
     * @param data The bare ModuleTypePackage-object of the MTP. Containing a CommunicationSet, HMISet, ServiceSet and TextSet.
     * @param callback A callback function with an instance of the Response-Interface.
     */
    extract(data: {CommunicationSet: object[]; HMISet: object; ServiceSet: object; TextSet: object}, callback: (response: Response) => void): void {
        const communicationSet = this.buildCommunicationSet(data.CommunicationSet);
        // TODO: Überprüfen ob Extraktion erfolgreich war.
        const localeResponse = this.responseVendor.buySuccessResponse();
        localeResponse.initialize('Success!', communicationSet);
        callback(localeResponse);
    }

    /**
     * Initialize all relevant Data of 'MTP-CommunicationSet' as instances of PiMAd-core-IM.
     * @param communicationSet The bare CommunicationSet-object of the MTP.
     */
    private buildCommunicationSet(communicationSet: object[]): {
        CommunicationInterfaceData: CommunicationInterfaceData[];
        DataAssemblies: DataAssembly[];
    }  {
        const communicationInterfaceData: CommunicationInterfaceData[] = [];
        const dataAssemblies: DataAssembly[] = [];
        //const localExternalInterfaces: {Name: string; ID: string; RefBaseClassPath: string; Attribute: {Name: string; AttributeDataType: string; Value: string}[]}[] = [];
        const localExternalInterfaces: DataItemInstanceList[] = [];

        communicationSet.forEach((element: {RefBaseSystemUnitPath?: string; InternalElement?: object[]}) => {
            if(element.InternalElement == undefined) {
                element.InternalElement = [];
            }
            switch (element.RefBaseSystemUnitPath) {
                case 'MTPSUCLib/CommunicationSet/SourceList':
                    if(!(Array.isArray(element.InternalElement))) {
                        element.InternalElement = [element.InternalElement];
                    }
                    element.InternalElement?.forEach((source: {
                        Name?: string;
                        RefBaseSystemUnitPath?: string;
                        Attribute?: {
                            Name: string;
                            AttributeDataType: string;
                            Value: string;
                        };
                    }) => {
                        switch (source.RefBaseSystemUnitPath) {
                            case 'MTPCommunicationSUCLib/ServerAssembly/OPCUAServer':
                                const localeComIntData = this.opcuaServerCommunicationFactory.create();
                                if(localeComIntData.initialize({name: source.Name, serverURL: source.Attribute?.Value})) {
                                    communicationInterfaceData.push(localeComIntData);
                                } else {
                                    // TODO: Missing error handling
                                }

                                // parse the external Interface stuff
                                break;
                            default:
                                break;
                        }
                    })
                    break;
                case 'MTPSUCLib/CommunicationSet/InstanceList':
                    break;
                default:
                    break;

            }
        })
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