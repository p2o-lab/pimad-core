import {Response, ResponseVendor} from '../../Backbone/Response';
import {
    CommunicationInterfaceData, CommunicationInterfaceDataFactory, OPCUANodeCommunicationFactory,
    OPCUAServerCommunicationFactory
} from '../../ModuleAutomation/CommunicationInterfaceData';
import { DataAssembly,BaseDataAssemblyFactory} from '../../ModuleAutomation/DataAssembly';
import { DataItemInstanceList, DataItemSourceList, DataItemSourceListExternalInterface, Attribute } from 'AML';
import { InstanceList, SourceList } from 'PiMAd-types';
import {logger} from '../../Utils/Logger';
import {BaseDataItemFactory, DataItem} from '../../ModuleAutomation/DataItem';
import {Procedure} from '../../ModuleAutomation/Procedure';
import {Parameter} from '../../ModuleAutomation/Parameter';

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
    private opcuaNodeCommunicationFactory: OPCUANodeCommunicationFactory;
    private baseDataAssemblyFactory: BaseDataAssemblyFactory;
    private baseDataItemFactory: BaseDataItemFactory;

    /**
     * Parsing the relevant data of the ModuleTypePackage-object and copy that to different instances of PiMAd-core-IM.
     * @param data - The bare ModuleTypePackage-object of the MTP. Containing a CommunicationSet, HMISet, ServiceSet and TextSet.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    extract(data: {CommunicationSet: object[]; HMISet: object; ServiceSet: object; TextSet: object}, callback: (response: Response) => void): void {
        const communicationSet = this.buildCommunicationSet(data.CommunicationSet);
        // TODO: Überprüfen ob Extraktion erfolgreich war.
        const localeResponse = this.responseVendor.buySuccessResponse();
        localeResponse.initialize('Success!', communicationSet);
        callback(localeResponse);
    }

    private getRefBaseSystemUnitPathElement(communicationSet: object[], refBaseSystemUnitPath: string, callback: (listElement: InstanceList | SourceList) => void): void {
        communicationSet.forEach((setElement: object) => {
            // First of all: typing
            const elementWithListType = setElement as InstanceList| SourceList;

            if (elementWithListType.RefBaseSystemUnitPath === refBaseSystemUnitPath) {
                callback(elementWithListType)
            }
        });
    };

    /**
     * Initialize all relevant Data of 'MTP-CommunicationSet' as instances of PiMAd-core-IM.
     * @param communicationSet - The bare CommunicationSet-object of the MTP.
     */
    private buildCommunicationSet(communicationSet: object[]): {
        CommunicationInterfaceData: CommunicationInterfaceData[];
        DataAssemblies: DataAssembly[];
    }  {
        const communicationInterfaceData: CommunicationInterfaceData[] = [];
        const dataAssemblies: DataAssembly[] = [];
        const localExternalInterfaces: DataItemSourceListExternalInterface[] = [];
        // Extract InstantList and SourceList
        let instanceList: InstanceList = {} as InstanceList;
        this.getRefBaseSystemUnitPathElement(communicationSet, 'MTPSUCLib/CommunicationSet/InstanceList', extractedInstanceList => {
            instanceList = extractedInstanceList as InstanceList;
        });
        let sourceList: SourceList = {} as SourceList;
        this.getRefBaseSystemUnitPathElement(communicationSet, 'MTPSUCLib/CommunicationSet/SourceList', extractedSourceList => {
            sourceList = extractedSourceList as SourceList;
        });
        if(JSON.stringify(instanceList) == JSON.stringify({}) || JSON.stringify(sourceList) == JSON.stringify({})) {
            logger.error('Could not extract InstanceList and SourceList of the CommunicationSet. Aborting!')
            return {
                CommunicationInterfaceData: [],
                DataAssemblies: []
            }
        }
        // Easier handling of 'single' and 'multiple' sources in one code section. Therefore a single source is transferred to an array with one entry.
        if(!(Array.isArray(sourceList.InternalElement))) {
            sourceList.InternalElement = [sourceList.InternalElement];
        }
        // Handle the SourceList
        sourceList.InternalElement.forEach((source: DataItemSourceList) => {
            // So far we only know MTPs with a OPCUAServer as source.
            switch (source.RefBaseSystemUnitPath) {
                case 'MTPCommunicationSUCLib/ServerAssembly/OPCUAServer':
                    // Extract the data
                    const localeComIntData = this.opcuaServerCommunicationFactory.create();
                    if(localeComIntData.initialize({name: source.Name, serverURL: source.Attribute.Value})) {
                        communicationInterfaceData.push(localeComIntData);
                    } else {
                        logger.warn('Cannot extract source <' + source.Name + '> need MTPFreeze-2020-01!');
                    }
                    // Store the source specific 'ExternalInterface' data temporary. You need these in the next parsing step.
                    source.ExternalInterface.forEach((dataItem: DataItemSourceListExternalInterface) => {
                        localExternalInterfaces.push(dataItem);
                    })
                    break;
                default:
                    break;
            }
        })
        instanceList.InternalElement.forEach((dataAssembly: DataItemInstanceList) => {
            const localeDataAssembly = this.baseDataAssemblyFactory.create();
            const localDataItems: DataItem[] = []
            // iterate through all attributes
            dataAssembly.Attribute.forEach((attribute: Attribute) => {
                localExternalInterfaces.some((localeInterface: DataItemSourceListExternalInterface) => {
                    // TODO: Extract description via new swicth case szenario
                    if (localeInterface.ID === attribute.Value) {
                        const opcuaNodeCommunication = this.opcuaNodeCommunicationFactory.create()
                        let identifier: number | string = -1;
                        let namespace = '';
                        let access = '';
                        localeInterface.Attribute.forEach((localeInterfaceAttribute: Attribute) => {
                            switch (localeInterfaceAttribute.Name) {
                                case ('Identifier'):
                                    identifier = localeInterfaceAttribute.Value;
                                    break;
                                case ('Namespace'):
                                    namespace = localeInterfaceAttribute.Value;
                                    break;
                                case ('Access'):
                                    access = localeInterfaceAttribute.Value;
                                    break;
                                default:
                                    logger.warn('The opcua-node-communication object contains the unknown attribute <' + attribute.Name + '>! Ignoring ...')
                                    break;
                            }
                            if (localeInterfaceAttribute == localeInterface.Attribute[localeInterface.Attribute.length - 1]) {
                                if (opcuaNodeCommunication.initialize({
                                    name: attribute.Name,
                                    namespaceIndex: namespace,
                                    nodeId: identifier,
                                    dataType: '???'
                                })) {
                                    logger.info('Successfully add opcua-communication <' + attribute.Name + '> to DataAssembly <' + dataAssembly.Name + '>');
                                } else {
                                    logger.warn('Could not add opcua-communication <' + attribute.Name + '> to DataAssembly <' + dataAssembly.Name + '>');
                                }
                            }
                        })
                        const localDataItem = this.baseDataItemFactory.create();
                        if (localDataItem.initialize(attribute.Name, opcuaNodeCommunication, localeInterface.ID, localeInterface.RefBaseClassPath)) {
                            localDataItems.push(localDataItem);
                        } else {
                            // logging
                        }
                        return true;
                    } else {
                        return false;
                    }
                })
            })
            // finalizing: checking response of initialize() > logging the results
            if(localeDataAssembly.initialize({
                tag: dataAssembly.Name,
                description: 'inline TODO above',
                dataItems: localDataItems,
                identifier: dataAssembly.ID,
                metaModelRef: dataAssembly.RefBaseSystemUnitPath
            })) {
                dataAssemblies.push(localeDataAssembly);
                logger.info('Add DataAssembly <' + localeDataAssembly.getTagName() + '>');
            } else {
                logger.warn('Cannot extract all data from DataAssembly <' + dataAssembly.Name + '> need MTPFreeze-2020-01!');
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
        this.opcuaNodeCommunicationFactory = new OPCUANodeCommunicationFactory();
        this.baseDataAssemblyFactory = new BaseDataAssemblyFactory();
        this.baseDataItemFactory = new BaseDataItemFactory();
    }
}
/**
 * Handles the 'ServicePart' of the ModuleTypePackage file.
 */
export class ServicePart extends AImporterPart {
    extract(data: {Name: string, ID: string, Version: string, InternalElement: object[]}, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buySuccessResponse();
        localResponse.initialize('???', data.InternalElement);
        callback(localResponse);

    }
}
export class TextPart extends AImporterPart {

}

/**
 * Importers consist of individual parts that each extract specific sections of the information model.
 */
export interface ImporterPart {
    /**
     * Extracts data based on a specific information model and converts it into the internal data model of PiMAd.
     * @param data - The data source.
     * @param callback - Return the results via callback-function.
     */
    extract(data: object, callback: (response: Response) => void): void;
}

export type InternalServiceType = {
    Attributes: Attribute[],
    DataAssembly: Attribute,
    Identifier: string,
    MetaModelRef: string,
    Name: string,
    Procedures: Procedure[],
    Parameters: Parameter[]
}