import {Response, ResponseVendor} from '../../Backbone/Response';
import {
    CommunicationInterfaceData, CommunicationInterfaceDataFactory, OPCUANodeCommunicationFactory,
    OPCUAServerCommunicationFactory
} from '../../ModuleAutomation/CommunicationInterfaceData';
import { DataAssembly,BaseDataAssemblyFactory} from '../../ModuleAutomation/DataAssembly';
import { DataItemInstanceList, DataItemSourceList, DataItemSourceListExternalInterface, Attribute, ServiceInternalElement } from 'AML';
import { InstanceList, SourceList } from 'PiMAd-types';
import {logger} from '../../Utils/Logger';
import {BaseDataItemFactory, DataItem} from '../../ModuleAutomation/DataItem';
import {BaseProcedureFactory} from '../../ModuleAutomation/Procedure';
import {Parameter} from '../../ModuleAutomation/Parameter';

abstract class AImporterPart implements ImporterPart {
    protected responseVendor: ResponseVendor

    extract(data: object, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse()
        localResponse.initialize('Not implemented yet!', {})
        callback(localResponse)
    }

    /**
     * Extract a specific attribute from an Attribute Array. F.ex. the RefID-Attribute.
     * @param attributeName - The name of the attribute.
     * @param attributes - The attributes array.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    protected getAttribute(attributeName: string, attributes: Attribute[], callback: (response: Response) => void): void {
        attributes.forEach((attribute: Attribute) => {
            if(attribute.Name === attributeName) {
                const localResponse = this.responseVendor.buySuccessResponse();
                localResponse.initialize('Success!', attribute);
                callback(localResponse)
            }
        })
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
        if(communicationSet.CommunicationInterfaceData.length === 0 && communicationSet.DataAssemblies.length === 0) {
            const localeResponse = this.responseVendor.buyErrorResponse();
            localeResponse.initialize('Could not parse the CommunicationSet!', {});
            callback(localeResponse);
        } else {
            const localeResponse = this.responseVendor.buySuccessResponse();
            localeResponse.initialize('Success!', communicationSet);
            callback(localeResponse);
        }
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
    private buildCommunicationSet(communicationSet: object[]): BuildCommunicationSetResponseType  {
        // The following arrays will be continuously filled with data in the following lines.
        const communicationInterfaceData: CommunicationInterfaceData[] = [];
        const dataAssemblies: DataAssembly[] = [];
        const localExternalInterfaces: DataItemSourceListExternalInterface[] = [];
        // Extract InstantList and SourceList from communicationSet
        // TODO: I like this approach: const localProcedureDataAssembly: DataAssembly | undefined = dataAssemblies.find(dataAssembly => service.DataAssembly.Value === dataAssembly.getIdentifier())
        let instanceList: InstanceList = {} as InstanceList;
        this.getRefBaseSystemUnitPathElement(communicationSet, 'MTPSUCLib/CommunicationSet/InstanceList', extractedInstanceList => {
            instanceList = extractedInstanceList as InstanceList;
        });
        let sourceList: SourceList = {} as SourceList;
        this.getRefBaseSystemUnitPathElement(communicationSet, 'MTPSUCLib/CommunicationSet/SourceList', extractedSourceList => {
            sourceList = extractedSourceList as SourceList;
        });
        // Check instanceList/sourceList isn't empty.
        if(JSON.stringify(instanceList) == JSON.stringify({}) || JSON.stringify(sourceList) == JSON.stringify({})) {
            logger.error('Could not extract InstanceList and SourceList of the CommunicationSet. Aborting!')
            return {
                CommunicationInterfaceData: [],
                DataAssemblies: []
            }
        }
        /* Easier handling of 'single' and 'multiple' sources in one code section. Therefore a single source is
        transferred to an array with one entry. */
        if(!(Array.isArray(sourceList.InternalElement))) {
            sourceList.InternalElement = [sourceList.InternalElement];
        }
        // Handle the SourceList. Mainly extracting the server communication interfaces.
        sourceList.InternalElement.forEach((sourceListItem: DataItemSourceList) => {
            // So far we only know MTPs with a OPCUAServer as source.
            switch (sourceListItem.RefBaseSystemUnitPath) {
                case 'MTPCommunicationSUCLib/ServerAssembly/OPCUAServer':
                    // Extract the server communication interface.
                    const localeComIntData = this.opcuaServerCommunicationFactory.create();
                    if(localeComIntData.initialize({name: sourceListItem.Name, serverURL: sourceListItem.Attribute.Value})) {
                        communicationInterfaceData.push(localeComIntData);
                    } else {
                        logger.warn('Cannot extract source <' + sourceListItem.Name + '> need MTPFreeze-2020-01!');
                    }
                    /* Store the source specific 'ExternalInterface' data temporary. You need these in the next parsing
                    step. */
                    sourceListItem.ExternalInterface.forEach((sourceListElementExternalInterfaceItem: DataItemSourceListExternalInterface) => {
                        localExternalInterfaces.push(sourceListElementExternalInterfaceItem);
                    })
                    break;
                default:
                    logger.warn('Unknown RefBaseSystemUnitPath of source' + sourceListItem.Name + '! Skipping ...');
                    break;
            }
        })
        // Handle the InstanceList. Merging data with SourceList and generating mainly PiMAd-core-DataAssemblies.
        instanceList.InternalElement.forEach((instanceListElement: DataItemInstanceList) => {
            // like above these variables will be continuously filled with data in the following lines.
            const localDataItems: DataItem[] = [];
            let dataAssemblyIdentifier = '';
            // iterate through all attributes
            instanceListElement.Attribute.forEach((instanceListElementAttribute: Attribute) => {
                // These are treated differently depending on the attribute data type.
                switch (instanceListElementAttribute.AttributeDataType) {
                    /* In this case the attribute references to an ExternalInterface. Later both data sources will be
                    merged as one PiMAd-core-DataItem. */
                    case 'xs:IDREF':
                        /* First we need the element with the correct ID from the ExternalInterfaceList. Safe some time
                        with Array.prototype.some(). Therefore the 'strange' syntax in the last part. */
                        localExternalInterfaces.some((localeExternalInterface: DataItemSourceListExternalInterface) => {
                            // TODO: Extract description via new switch case szenario
                            if (localeExternalInterface.ID === instanceListElementAttribute.Value) {
                                /* Merging attribute and external interface data to one communication interface. */
                                // TODO: Aktuell gehen wir immer von opcua nodes aus. Kann sich in Zukunft ändern!
                                const opcuaNodeCommunication = this.opcuaNodeCommunicationFactory.create();
                                // ... continuously filled ...
                                let identifier: number | string = -1;
                                let namespace = '';
                                let access = '';
                                /* There are again attributes...  looping and extracting */
                                localeExternalInterface.Attribute.forEach((localeInterfaceAttribute: Attribute) => {
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
                                            logger.warn('The opcua-node-communication object contains the unknown attribute <' + instanceListElementAttribute.Name + '>! Ignoring ...')
                                            break;
                                    }
                                    // in the last loop circle initialize the communication interface.
                                    if (localeInterfaceAttribute == localeExternalInterface.Attribute[localeExternalInterface.Attribute.length - 1]) {
                                        if (opcuaNodeCommunication.initialize({
                                            name: instanceListElementAttribute.Name,
                                            namespaceIndex: namespace,
                                            nodeId: identifier,
                                            dataType: '???'
                                        })) {
                                            logger.info('Successfully add opcua-communication <' + instanceListElementAttribute.Name + '> to DataAssembly <' + instanceListElement.Name + '>');
                                        } else {
                                            logger.warn('Could not add opcua-communication <' + instanceListElementAttribute.Name + '> to DataAssembly <' + instanceListElement.Name + '>');
                                        }
                                    }
                                })
                                // Create and initialize the data item.
                                const localDataItem = this.baseDataItemFactory.create();
                                if (localDataItem.initialize(instanceListElementAttribute.Name, opcuaNodeCommunication, localeExternalInterface.ID, localeExternalInterface.RefBaseClassPath)) {
                                    /* no error -> pushing it to the list of data items. later it will be aggregated in
                                    the data assembly object. */
                                    localDataItems.push(localDataItem);
                                } else {
                                    // logging
                                }
                                // Array.prototype.some() stuff...
                                return true;
                            } else {
                                //Array.prototype.some() stuff...
                                return false;
                            }
                        })
                        break;
                    /* Now the attributes are id's and doesn't referencing to an DataAssembly/DataItem. In this case the
                    id connect different data items in the MTP. (Real talk) me (CHe) as an software engineer, i don't
                    understand this concept... why fucking up the system above with ID & RefIDs in the
                    DataItems... never mind */
                    case 'xs:ID':
                        switch(instanceListElementAttribute.Name) {
                            /* Take this data for the data assembly identifier. Why? The services f.ex. referencing on
                            this id instead of the AML-ID. */
                            case 'RefID':
                                dataAssemblyIdentifier = instanceListElementAttribute.Value;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            })
            // All data for creating a DataAssembly has now been collected. Now creating ...
            const localeDataAssembly = this.baseDataAssemblyFactory.create();
            // ... and initializing.
            if(localeDataAssembly.initialize({
                tag: instanceListElement.Name,
                description: 'inline TODO above',
                dataItems: localDataItems,
                identifier: dataAssemblyIdentifier,
                metaModelRef: instanceListElement.RefBaseSystemUnitPath
            })) {
                // initializing successful -> push the new data assembly to the return variable.
                dataAssemblies.push(localeDataAssembly);
                logger.info('Add DataAssembly <' + localeDataAssembly.getTagName() + '>');
            } else {
                logger.warn('Cannot extract all data from DataAssembly <' + instanceListElement.Name + '> need MTPFreeze-2020-01! Skipping ...');
            }
        })
        // We are done. Return the extracted Data.
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
    private baseProcedureFactory: BaseProcedureFactory;

    /**
     * Parsing the relevant data of \<MTPServiceSUCLib/Service\> and copy that to different instances of PiMAd-core-IM.
     * @param data - All service data as object.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    extract(data: ServicePartExtractInputDataType, callback: (response: Response) => void): void {
        /* One big issue: In the ServicePart of the MTP are not all data to build a PiMAd-core Service. There are
        references to DataAssemblies extracted via the MTPPart. Therefore this one extracts the data like a quasi
        service. Later one the Importer merges the data of quasi service and the referenced DataAssembly to one
        PiMAd-core Service. */
        const extractedServiceData: InternalServiceType[] = []; // will be the content of the response.
        // typing
        const services = data.InternalElement as ServiceInternalElement[]
        // looping through all elements of the array.
        services.forEach((amlService: ServiceInternalElement) => {
            // TODO > Better solution possible?
            // TODO > Why no check? RefBaseSystemUnitPath
            let localAMLServiceAttributes: Attribute[] = [];
            if(!Array.isArray(amlService.Attribute)) {
                localAMLServiceAttributes.push(amlService.Attribute as Attribute);
            } else {
                localAMLServiceAttributes = amlService.Attribute;
            }
            // will be continuously filled while in the loop circle
            const localService = {} as InternalServiceType;
            localService.Attributes = [];
            localService.Identifier = amlService.ID;
            localService.MetaModelRef = amlService.RefBaseSystemUnitPath;
            localService.Name = amlService.Name;
            localService.Parameters = [];
            localService.Procedures = [];
            /* extract the 'RefID'-Attribute. It's important! and referencing to the DataAssembly of the service which
            stores all the interface data to the hardware. */
            this.getAttribute('RefID', localAMLServiceAttributes, (response: Response) => {
                if(response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                    localService.DataAssembly = response.getContent() as Attribute;
                }
            });
            // extract and store all other attributes
            this.extractAttributes(localAMLServiceAttributes, (response => {
                localService.Attributes = response.getContent() as Attribute[];
            }))
            // extract all Procedures, etc
            amlService.InternalElement.forEach((amlServiceInternalElementItem: DataItemInstanceList) => {
                switch (amlServiceInternalElementItem.RefBaseSystemUnitPath) {
                    case 'MTPServiceSUCLib/ServiceProcedure':
                        /* like the services above the data of the procedures in the MTP-ServiceSet is insufficient.
                        Therefore use again a quasi procedure. The importer will later merge the quasi procedure and the
                        referenced DataAssembly. */
                        const localProcedure = {} as InternalProcedureType
                        localProcedure.Attributes = [];
                        localProcedure.Identifier = amlServiceInternalElementItem.ID;
                        localProcedure.MetaModelRef = amlServiceInternalElementItem.RefBaseSystemUnitPath;
                        localProcedure.Name = amlServiceInternalElementItem.Name;
                        localProcedure.Parameters = [];
                        this.getAttribute('RefID', amlServiceInternalElementItem.Attribute, (response: Response) => {
                            if(response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                                localProcedure.DataAssembly = response.getContent() as Attribute;
                            }
                        });
                        // extract all the other Attributes
                        this.extractAttributes(amlServiceInternalElementItem.Attribute, (response => {
                            localProcedure.Attributes = response.getContent() as Attribute[];
                        }))
                        localService.Procedures.push(localProcedure);
                        // TODO: Missing Procedure-Parameters
                        break;
                    //case 'TODO: Missing Service-Parameters'
                    default:
                        logger.warn('Unknown >InternalElement< in service <' + amlService.Name + '> Ignoring!');
                        break;
                }
            })
            // push the extracted service data to the variable which will be used in the callback.
            extractedServiceData.push(localService);
            if(amlService == data.InternalElement[data.InternalElement.length - 1]) {
                const localResponse = this.responseVendor.buySuccessResponse();
                localResponse.initialize('Successfully extracting the ServicePart!', extractedServiceData);
                callback(localResponse);
            }
        })
    }

    /**
     * Transforming AML-Attributes into AML-Attributes. Ignoring specific one. f. ex. RefID. Needs a Refactor -\> PiMAd needs an attribute interface too!
     * @param attributes - The attributes array.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    private extractAttributes(attributes: Attribute[], callback: (response: Response) => void): void {
        const responseAttributes: Attribute[] = []
        attributes.forEach((attribute: Attribute) => {
            switch (attribute.Name) {
                case 'RefID':
                    break;
                default:
                    responseAttributes.push(attribute);
            }
            if(JSON.stringify(attribute) === JSON.stringify(attributes[attributes.length -1])) {
                const localeResponse = this.responseVendor.buySuccessResponse();
                localeResponse.initialize('Success!', responseAttributes);
                callback(localeResponse)
            }
        })
    }

    constructor() {
        super();
        this.baseProcedureFactory = new BaseProcedureFactory();
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

export type BuildCommunicationSetResponseType = {
    CommunicationInterfaceData: CommunicationInterfaceData[];
    DataAssemblies: DataAssembly[];
}

export type InternalServiceType = InternalProcedureType & {
    Procedures: InternalProcedureType[];
}

export type InternalProcedureType = {
    Attributes: Attribute[];
    DataAssembly: Attribute;
    Identifier: string;
    MetaModelRef: string;
    Name: string;
    Parameters: Parameter[];
}

export type ServicePartExtractInputDataType = {
    Name: string;
    ID: string;
    Version: string;
    InternalElement: object[];
}