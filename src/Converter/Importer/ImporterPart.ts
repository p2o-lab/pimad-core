import {
    BaseDataItemFactory,
    BaseProcedureFactory,
    CommunicationInterfaceData,
    CommunicationInterfaceDataVendor,
    DataItem,
    ModuleAutomation,
    Parameter
} from '../../ModuleAutomation';
import {AML, InstanceList, SourceList} from 'PiMAd-types';
import {logger} from '../../Utils';
import {Backbone} from '../../Backbone';
import {CommunicationInterfaceDataEnum} from '../../ModuleAutomation/CommunicationInterfaceData';
import DataItemInstanceList = AML.DataItemInstanceList;
import DataItemSourceList = AML.DataItemSourceList;
import DataItemSourceListExternalInterface = AML.DataItemSourceListExternalInterface;
import Attribute = AML.Attribute;
import ServiceInternalElement = AML.ServiceInternalElement;
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssembly = ModuleAutomation.DataAssembly;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;

abstract class AImporterPart implements ImporterPart {
    protected responseVendor: PiMAdResponseVendor

    extract(data: object, callback: (response: PiMAdResponse) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse();
        localResponse.initialize('Not implemented yet!', {});
        callback(localResponse);
    }

    /**
     * Extract a specific attribute from an Attribute Array. F.ex. the RefID-Attribute.
     * @param attributeName - The name of the attribute.
     * @param attributes - The attributes array.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    protected getAttribute(attributeName: string, attributes: Attribute[], callback: (response: PiMAdResponse) => void): void {
        attributes.forEach((attribute: Attribute) => {
            if(attribute.Name === attributeName) {
                const localResponse = this.responseVendor.buySuccessResponse();
                localResponse.initialize('Success!', attribute);
                callback(localResponse);
            }
        });
    }

    constructor() {
        this.responseVendor = new PiMAdResponseVendor();
    }
}

export class HMIPart extends AImporterPart {

}

/**
 * Handles the 'MTPPart' of a ModuleTypePackage file. This means CommunicationSet, HMISet, ServiceSet, ...
 */
export class MTPPart extends AImporterPart {
    private communicationInterfaceDataVendor: CommunicationInterfaceDataVendor;
    private dataAssemblyVendor: DataAssemblyVendor;
    private baseDataItemFactory: BaseDataItemFactory;

    /**
     * This method extracts data from the MTPPart of the ModuleTypePackage and converts it into different objects of the PiMAd-core-IM.
     *
     * Attention! Currently (31.07.2020) only data from the CommunicationSet is processed!
     *
     * <uml>
     *     skinparam shadowing false
     *     partition "extract" {
     *          start
     *          :extract communicationSet;
     *          if (extracted data is valid?) is (true)
     *              :callback the data\nwith SuccessResponse;
     *          else (false)
     *              :callback an\nErrorResponse;
     *          endif
     *          stop
     *     }
     * </uml>
     *
     * @param data - The bare ModuleTypePackage-object of the MTP. Containing a CommunicationSet, HMISet, ServiceSet and TextSet.
     * @param callback - A callback function with an instance of the Response-Interface. The type of the response-content-object-attribute data is {@link ExtractDataFromCommunicationSetResponseType}
     */
    extract(data: {CommunicationSet: object[]; HMISet: object; ServiceSet: object; TextSet: object}, callback: (response: PiMAdResponse) => void): void {
        const communicationSet = this.extractDataFromCommunicationSet(data.CommunicationSet);
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
                callback(elementWithListType);
            }
        });
    };

    /**
     * This method extracts data from the ModuleTypePackage-CommunicationSet, evaluates it and then transfers it to the
     * PiMAd-core internal data model. The following diagram visualizes the general method flow:
     *
     * <uml>
     *     skinparam shadowing false
     *     partition "extractDataFromCommunicationSet" {
     *     start
     *       :extract InstanceList & \nSourceList;
     *       if(extracted data seems valid) then (yes)
     *         :parsing SourceList;
     *         :parsing InstanceList;
     *         :CommunicationInterfaceData: communicationInterfaceData, \nDataAssemblies: dataAssemblies ]
     *         stop
     *       else (no)
     *       endif
     *       :CommunicationInterfaceData: [], \nDataAssemblies: [] ]
     *       stop
     *     }
     * </uml>
     *
     * The following activity diagram shows the detailed steps for parsing the SourceList:
     *
     * <uml>
     *     skinparam shadowing false
     *     partition "extractDataFromCommunicationSet:parsing-SourceList" {
     *       start
     *       while (more InternalElements?) is (true)
     *         if (element == OPCUAServer?) then (yes)
     *           :extract opcua-\nserver interface;
     *           :extract external interfaces;
     *          else (no)
     *            stop
     *          endif
     *       endwhile (no)
     *       stop
     *      }
     * </uml>
     *
     * The following activity diagram shows the detailed steps for parsing the InstanceList:
     *
     * <uml>
     *   skinparam shadowing false
     *   partition "buildCommunicationSet:parsing-InstanceList" {
     *     start
     *     while (more InternalElements\nin InstanceList?) is (true)
     *       :setup local\ndata storage;
     *       while (more Attributes\nin InternalElement?) is (true)
     *         if(attributeDataType == xs:IDREF)
     *           :merging attribute data\nwith external interface data;
     *           :initialize DataItem with\nmerged data and push\nit to the local storage;
     *         elseif (attributeDataType == xs:ID)
     *           :save the RefID as\nDataAssembly-Identifier;
     *         endif
     *       endwhile (no)
     *     :initialize DataAssembly with\nparsed data and push it\to the local storage;
     *     endwhile (no)
     *     stop
     *   }
     * </uml>
     *
     * @param communicationSet - The bare CommunicationSet-object of the MTP.
     */
    private extractDataFromCommunicationSet(communicationSet: object[]): ExtractDataFromCommunicationSetResponseType  {
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
            logger.error('Could not extract InstanceList and SourceList of the CommunicationSet. Aborting!');
            return {
                CommunicationInterfaceData: [],
                DataAssemblies: []
            };
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
                    const localeComIntData = this.communicationInterfaceDataVendor.buy(CommunicationInterfaceDataEnum.OPCUAServer);
                    if(localeComIntData.initialize({name: sourceListItem.Name, serverURL: sourceListItem.Attribute.Value})) {
                        communicationInterfaceData.push(localeComIntData);
                    } else {
                        logger.warn('Cannot extract source <' + sourceListItem.Name + '> need MTPFreeze-2020-01!');
                    }
                    /* Store the source specific 'ExternalInterface' data temporary. You need these in the next parsing
                    step. */
                    sourceListItem.ExternalInterface.forEach((sourceListElementExternalInterfaceItem: DataItemSourceListExternalInterface) => {
                        localExternalInterfaces.push(sourceListElementExternalInterfaceItem);
                    });
                    break;
                default:
                    logger.warn('Unknown RefBaseSystemUnitPath of source' + sourceListItem.Name + '! Skipping ...');
                    break;
            }
        });
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
                                const opcuaNodeCommunication = this.communicationInterfaceDataVendor.buy(CommunicationInterfaceDataEnum.OPCUANode);
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
                                            logger.warn('The opcua-node-communication object contains the unknown attribute <' + instanceListElementAttribute.Name + '>! Ignoring ...');
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
                                });
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
                        });
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
            });
            // All data for creating a DataAssembly has now been collected. Now creating ...
            const localDataAssembly = this.dataAssemblyVendor.buy(DataAssemblyType.BASIC);
            // ... and initializing.
            if(localDataAssembly.initialize({
                tag: instanceListElement.Name,
                description: 'inline TODO above',
                dataItems: localDataItems,
                identifier: dataAssemblyIdentifier,
                metaModelRef: instanceListElement.RefBaseSystemUnitPath
            })) {
                // initializing successful -> push the new data assembly to the return variable.
                dataAssemblies.push(localDataAssembly);
                localDataAssembly.getName((response, name) => {
                    logger.info('Add DataAssembly <' + name + '>');
                });
            } else {
                logger.warn('Cannot extract all data from DataAssembly <' + instanceListElement.Name + '> need MTPFreeze-2020-01! Skipping ...');
            }
        });
        // We are done. Return the extracted Data.
        return {
            CommunicationInterfaceData: communicationInterfaceData,
            DataAssemblies: dataAssemblies
        };
    }

    constructor() {
        super();
        this.communicationInterfaceDataVendor = new CommunicationInterfaceDataVendor();
        this.dataAssemblyVendor = new DataAssemblyVendor();
        this.baseDataItemFactory = new BaseDataItemFactory();
    }
}
/**
 * Handles the 'ServicePart' of the ModuleTypePackage file.
 */
export class ServicePart extends AImporterPart {
    private baseProcedureFactory: BaseProcedureFactory;

    /**
     * This method extracts data from the service part of the ModuleTypePackage and converts it into an intermediate
     * format very similar to the {@link Service} interface of the PiMAd core IM.
     *
     * <uml>
     *     skinparam shadowing false
     *     partition "extract" {
     *          start
     *          while (more services?) is (yes)
     *              :take the next service;
     *              :extract and store\nfirst level data of\nthe service;
     *              while (more InternalElements?) is (yes)
     *                  :take the next element;
     *                  if (element == ServiceProcedure) is (true)
     *                      :extract the data\nof the service procedure;
     *                      :push procedure to service;
     *                  else (no)
     *                      :Skipping this element;
     *                  endif
     *              endwhile (no)
     *              :push service to storage;
     *          endwhile (no)
     *          :callback the extracted\nservices with a\nSuccessResponse;
     *          stop
     *     }
     * </uml>
     *
     * @param data - All service data as object.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    extract(data: ServicePartExtractInputDataType, callback: (response: PiMAdResponse) => void): void {
        /* One big issue: In the ServicePart of the MTP are not all data to build a PiMAd-core Service. There are
        references to DataAssemblies extracted via the MTPPart. Therefore this one extracts the data like a quasi
        service. Later one the Importer merges the data of quasi service and the referenced DataAssembly to one
        PiMAd-core Service. */
        const extractedServiceData: InternalServiceType[] = []; // will be the content of the response.
        // typing
        const services = data.InternalElement as ServiceInternalElement[];
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
            this.getAttribute('RefID', localAMLServiceAttributes, (response: PiMAdResponse) => {
                if(response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                    localService.DataAssembly = response.getContent() as Attribute;
                }
            });
            // extract and store all other attributes
            this.extractAttributes(localAMLServiceAttributes, (response => {
                localService.Attributes = response.getContent() as Attribute[];
            }));
            // extract all Procedures, etc
            amlService.InternalElement.forEach((amlServiceInternalElementItem: DataItemInstanceList) => {
                switch (amlServiceInternalElementItem.RefBaseSystemUnitPath) {
                    case 'MTPServiceSUCLib/ServiceProcedure':
                        /* like the services above the data of the procedures in the MTP-ServiceSet is insufficient.
                        Therefore use again a quasi procedure. The importer will later merge the quasi procedure and the
                        referenced DataAssembly. */
                        const localProcedure = {} as InternalProcedureType;
                        localProcedure.Attributes = [];
                        localProcedure.Identifier = amlServiceInternalElementItem.ID;
                        localProcedure.MetaModelRef = amlServiceInternalElementItem.RefBaseSystemUnitPath;
                        localProcedure.Name = amlServiceInternalElementItem.Name;
                        localProcedure.Parameters = [];
                        this.getAttribute('RefID', amlServiceInternalElementItem.Attribute, (response: PiMAdResponse) => {
                            if(response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                                localProcedure.DataAssembly = response.getContent() as Attribute;
                            }
                        });
                        // extract all the other Attributes
                        this.extractAttributes(amlServiceInternalElementItem.Attribute, (response => {
                            localProcedure.Attributes = response.getContent() as Attribute[];
                        }));
                        localService.Procedures.push(localProcedure);
                        // TODO: Missing Procedure-Parameters
                        break;
                    //case 'TODO: Missing Service-Parameters'
                    default:
                        logger.warn('Unknown >InternalElement< in service <' + amlService.Name + '> Ignoring!');
                        break;
                }
            });
            extractedServiceData.push(localService);
        });
        const localResponse = this.responseVendor.buySuccessResponse();
        localResponse.initialize('Successfully extracting the ServicePart!', extractedServiceData);
        callback(localResponse);
    }

    /**
     * Transforming AML-Attributes into AML-Attributes. Ignoring specific one. f. ex. RefID. Needs a Refactor -\> PiMAd
     * needs an attribute interface too!
     * @param attributes - The attributes array.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    private extractAttributes(attributes: Attribute[], callback: (response: PiMAdResponse) => void): void {
        const responseAttributes: Attribute[] = [];
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
                callback(localeResponse);
            }
        });
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
    extract(data: object, callback: (response: PiMAdResponse) => void): void;
}

/**
 * Type of the object that is created by the method {@link extractDataFromCommunicationSet}
 */
export type ExtractDataFromCommunicationSetResponseType = {
    CommunicationInterfaceData: CommunicationInterfaceData[];
    DataAssemblies: DataAssembly[];
}

/**
 * Types the content object in the {@link SuccessResponse} from {@link ServicePart.extract}
 */

export type InternalServiceType = InternalProcedureType & {
    Procedures: InternalProcedureType[];
}

/**
 * Types the Procedures in {@link InternalServiceType}
 */
export type InternalProcedureType = {
    Attributes: Attribute[];
    DataAssembly: Attribute;
    Identifier: string;
    MetaModelRef: string;
    Name: string;
    Parameters: Parameter[];
}

/**
 * Types the object that the method {@link ServicePart.extract} expects as input.
 */
export type ServicePartExtractInputDataType = {
    Name: string;
    ID: string;
    Version: string;
    InternalElement: object[];
}
