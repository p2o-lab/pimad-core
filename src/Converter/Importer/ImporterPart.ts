import {
    BaseDataItemFactory, BaseParameterFactory,
    BaseProcedureFactory,
    CommunicationInterfaceData,
    CommunicationInterfaceDataVendor,
    DataItemModel,
    ModuleAutomation,
    Parameter
} from '../../ModuleAutomation';
import {AML, InstanceList, SourceList} from '@p2olab/pimad-types';
import {logger} from '../../Utils';
import {Backbone} from '../../Backbone';
import {CommunicationInterfaceDataEnum,} from '../../ModuleAutomation/CommunicationInterfaceData';
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
import { v4 as uuidv4 } from 'uuid';

export abstract class AImporterPart implements ImporterPart {
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
    extract(data: {CommunicationSet: object[]}, callback: (response: PiMAdResponse) => void): void {
        const communicationSet = this.extractDataFromCommunicationSet(data.CommunicationSet);
        if(communicationSet.ServerCommunicationInterfaceData.length === 0 && communicationSet.DataAssemblies.length === 0) {
            const localResponse = this.responseVendor.buyErrorResponse();
            //TODO: REFACTOR: const localResponse = this.responseVendor.buySuccessResponse('message', {content}); -> initialize within Response class
            localResponse.initialize('Could not parse the CommunicationSet!', {});
            callback(localResponse);
        } else {
            const localResponse = this.responseVendor.buySuccessResponse();
            localResponse.initialize('Success!', communicationSet);
            callback(localResponse);
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
    }

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
     *           :initialize DataItemModel with\nmerged data and push\nit to the local storage;
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
       // const communicationInterfaceData: CommunicationInterfaceData[] = [];
        const serverCommunicationInterfaceData: DataItemModel[] = [];
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
                DataAssemblies: [],
                ServerCommunicationInterfaceData: []
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
                case 'MTPCommunicationSUCLib/ServerAssembly/OPCUAServer': {

                    const localDataItem = this.baseDataItemFactory.create();
                    const sourceListElementAttribute = sourceListItem.Attribute;

                    // Extract the server communication interface
                    switch(sourceListElementAttribute.AttributeDataType){
                        // TODO: standard for endpoint MTP? static, dynamic?
                        case('xs:string'):
                            if (localDataItem.initialize({
                                dataType: sourceListElementAttribute.AttributeDataType,
                                defaultValue: sourceListElementAttribute.DefaultValue,
                                description: sourceListElementAttribute.Description,
                                name: sourceListElementAttribute.Name,
                                pimadIdentifier: 'TODO',
                                value: sourceListElementAttribute.Value
                            })) {
                                serverCommunicationInterfaceData.push(localDataItem);
                            } else{
                                logger.warn('Cannot extract source <' + sourceListItem.Name + '> need MTPFreeze-2020-01!');
                            }
                        //case('xs:IDREF'):
                    }

                    /* Easier handling of 'single' and 'multiple' sources in one code section. Therefore a single source is
                    transferred to an array with one entry. */
                    if(!(Array.isArray(sourceListItem.ExternalInterface))) {
                        sourceListItem.ExternalInterface = [sourceListItem.ExternalInterface];
                    }
                    /* Store the source specific 'ExternalInterface' data temporary. You need these in the next parsing
                    step. */
                    sourceListItem.ExternalInterface.forEach((sourceListElementExternalInterfaceItem: DataItemSourceListExternalInterface) => {
                        localExternalInterfaces.push(sourceListElementExternalInterfaceItem);
                    });
                    break;
                }
                default:
                    logger.warn('Unknown RefBaseSystemUnitPath of source' + sourceListItem.Name + '! Skipping ...');
                    break;
            }
        });
        // Handle the InstanceList. Merging data with SourceList and generating mainly PiMAd-core-DataAssemblies.

        if(!(Array.isArray(instanceList.InternalElement))) {
            instanceList.InternalElement = [instanceList.InternalElement];
        }
        instanceList.InternalElement.forEach((instanceListElement: DataItemInstanceList) => {
            // like above these variables will be continuously filled with data in the following lines.
            const localDataItems: DataItemModel[] = [];
            let dataAssemblyIdentifier = '';
            // iterate through all attributes
            /* Easier handling of 'single' and 'multiple' attributes in one code section. Therefore a single attribute is
            transferred to an array with one entry. */
            if(!(Array.isArray(instanceListElement.Attribute))) {
                instanceListElement.Attribute = [instanceListElement.Attribute];
            }
/*            if(instanceListElement.RefBaseSystemUnitPath.includes('HealthStateView')
                || instanceListElement.RefBaseSystemUnitPath.includes('ServiceControl')){
                return;
            }*/
            instanceListElement.Attribute.forEach((instanceListElementAttribute: Attribute) => {
                // These are treated differently depending on the attribute data type.
                const localDataItem = this.baseDataItemFactory.create();

                switch (instanceListElementAttribute.AttributeDataType) {
                    case 'xs:string':
                        if (localDataItem.initialize({
                            dataType: instanceListElementAttribute.AttributeDataType,
                            defaultValue: instanceListElementAttribute.DefaultValue,
                            description: instanceListElementAttribute.Description,
                            name: instanceListElementAttribute.Name,
                            pimadIdentifier: 'TODO',
                            value: instanceListElementAttribute.Value
                        })) {
                           localDataItems.push(localDataItem);
                        }
                        break;
                    case 'xs:byte':
                        if (localDataItem.initialize({
                            dataType: instanceListElementAttribute.AttributeDataType,
                            defaultValue: instanceListElementAttribute.DefaultValue,
                            description: instanceListElementAttribute.Description,
                            name: instanceListElementAttribute.Name,
                            pimadIdentifier: 'TODO',
                            value: instanceListElementAttribute.Value
                        })) {
                            // push to the list of data items. later it will be aggregated in the data assembly object.
                            localDataItems.push(localDataItem);
                        }
                        break;
                    case 'xs:boolean':
                        if (localDataItem.initialize({
                            dataType: instanceListElementAttribute.AttributeDataType,
                            defaultValue: instanceListElementAttribute.DefaultValue,
                            description: instanceListElementAttribute.Description,
                            name: instanceListElementAttribute.Name,
                            pimadIdentifier: 'TODO',
                            value: instanceListElementAttribute.Value
                        })) {
                            // push to the list of data items. later it will be aggregated in the data assembly object.
                            localDataItems.push(localDataItem);
                        }
                        break;
                    case 'xs:IDREF':
                    /* First we need the element with the correct ID from the ExternalInterfaceList. Safe some time
                    with Array.prototype.some(). Therefore the 'strange' syntax in the last part. */
                    localExternalInterfaces.some((localeExternalInterface: DataItemSourceListExternalInterface) => {
                        // TODO: Extract description via new switch case scenario
                        if (localeExternalInterface.ID === instanceListElementAttribute.Value) {
                            /* Merging attribute and external interface data to one communication interface. */
                            // TODO: Aktuell gehen wir immer von opcua nodes aus. Kann sich in Zukunft ändern!
                            const opcuaNodeCommunication = this.communicationInterfaceDataVendor.buy(CommunicationInterfaceDataEnum.OPCUANode);
                            // ... continuously filled ...
                            let identifier: number | string = -1;
                            let namespace = '';
                            let access = '';
                            /* There are again attributes...  looping and extracting */
                            /* Easier handling of 'single' and 'multiple' attributes in one code section. Therefore a single attribute is
                            transferred to an array with one entry. */
                            //TODO: is this neccessary?
                            if(!(Array.isArray(localeExternalInterface.Attribute))) {
                                localeExternalInterface.Attribute = [localeExternalInterface.Attribute];
                            }
                            localeExternalInterface.Attribute.forEach((localeInterfaceAttribute: Attribute) => {
                                switch (localeInterfaceAttribute.Name) {
                                    case ('Identifier'):
                                        identifier = localeInterfaceAttribute.Value;
                                        break;
                                    case ('Namespace'):
                                        namespace = localeInterfaceAttribute.Value;
                                        break;
                                    case ('Access'):
                                        //TODO: Do we need access?
                                        access = localeInterfaceAttribute.Value;
                                        break;
                                    default:
                                        logger.warn('The opcua-node-communication object contains the unknown attribute <' + instanceListElementAttribute.Name + '>! Ignoring ...');
                                        break;
                                }
                                // in the last loop circle initialize the communication interface.
                                if (localeInterfaceAttribute == localeExternalInterface.Attribute[localeExternalInterface.Attribute.length - 1]) {
                                    if (opcuaNodeCommunication.initialize({
                                        dataSourceIdentifier: localeExternalInterface.ID,
                                        name: instanceListElementAttribute.Name,
                                        interfaceDescription: {
                                            macrocosm: namespace,
                                            microcosm: identifier as string
                                        },
                                        metaModelRef: localeExternalInterface.RefBaseClassPath,
                                        pimadIdentifier: 'TODO'
                                    })) {
                                        logger.info('Successfully add opcua-communication <' + instanceListElementAttribute.Name + '> to DataAssembly <' + instanceListElement.Name + '>');
                                    } else {
                                        logger.warn('Could not add opcua-communication <' + instanceListElementAttribute.Name + '> to DataAssembly <' + instanceListElement.Name + '>');
                                    }
                                }
                            });
                            // Create and initialize the data item.
                            const localDataItem = this.baseDataItemFactory.create();
                            if (localDataItem.initialize({
                                ciData: opcuaNodeCommunication,
                                dataSourceIdentifier: localeExternalInterface.ID,
                                defaultValue: instanceListElementAttribute.DefaultValue,
                                description: instanceListElementAttribute.Description,
                                dataType: instanceListElementAttribute.AttributeDataType,
                                metaModelRef: localeExternalInterface.RefBaseClassPath,
                                name: instanceListElementAttribute.Name,
                                pimadIdentifier: 'TODO'
                            })) {
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
                    /* Now the attributes are id's and doesn't referencing to an DataAssembly/DataItemModel. In this case the
                    id connect different data items in the MTP. (why messing up the system above with ID & RefIDs in the
                    DataItems?)*/
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
                dataSourceIdentifier: dataAssemblyIdentifier,
                metaModelRef: instanceListElement.RefBaseSystemUnitPath,
                pimadIdentifier: uuidv4() // TODO: Maybe check if uuid maybe already exists?
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
            DataAssemblies: dataAssemblies,
            ServerCommunicationInterfaceData: serverCommunicationInterfaceData
        };
    }

    constructor() {
        super();
        this.communicationInterfaceDataVendor = new CommunicationInterfaceDataVendor();
        this.dataAssemblyVendor = new DataAssemblyVendor();
        this.baseDataItemFactory = new BaseDataItemFactory();
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
    DataAssemblies: DataAssembly[];
    ServerCommunicationInterfaceData: DataItemModel[];
}

/**
 * Types the content object in the {@link SuccessResponse} from {@link ServicePart.extract}
 */

export type InternalServiceType = InternalProcedureType & {
    Procedures: InternalProcedureType[];
    Parameters: Parameter[];
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
    ParametersRefID: string[];
    ReportParametersRefID: string[];
    ProcessValuesInRefID: string[];
    ProcessValuesOutID: string[];
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
