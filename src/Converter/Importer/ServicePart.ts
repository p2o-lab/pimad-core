import {
    BaseParameterFactory,
    BaseProcedureFactory,
    CommunicationInterfaceDataVendor,
    ProcedureModel
} from '../../ModuleAutomation';
import {logger} from '../../Utils';
import {
    AImporterPart,
    InternalProcedureType,
    InternalServiceType,
    ServicePartExtractInputDataType
} from './ImporterPart';
import {Backbone} from '../../Backbone';
import PiMAdResponse = Backbone.PiMAdResponse;
import {AML} from '@p2olab/pimad-types';
import ServiceInternalElement = AML.ServiceInternalElement;
import Attribute = AML.Attribute;
import DataItemInstanceList = AML.DataItemInstanceList;

/**
 * Handles the 'ServicePart' of the ModuleTypePackage file.
 */
export class ServicePart extends AImporterPart {
    private baseProcedureFactory: BaseProcedureFactory;
    private baseParameterFactory: BaseParameterFactory;
    private communicationInterfaceDataVendor: CommunicationInterfaceDataVendor;
    //  private dataAssemblyVendor: DataAssemblyVendor;
//    private baseDataItemFactory: BaseDataItemFactory;
    
    constructor() {
        super();
        this.baseProcedureFactory = new BaseProcedureFactory();
        this.baseParameterFactory = new BaseParameterFactory();
        this.communicationInterfaceDataVendor = new CommunicationInterfaceDataVendor();
    }

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
        /* One big issue: In the ServicePart of the MTP are not all data to build a PiMAd-core ServiceModel. There are
        references to DataAssemblies extracted via the MTPPart. Therefore this one extracts the data like a quasi
        service. Later one the Importer merges the data of quasi service and the referenced DataAssembly to one
        PiMAd-core ServiceModel. */
        const extractedServiceData: InternalServiceType[] = []; // will be the content of the response.
        // typing
        let servicePartInternalElementArray = data.InternalElement as ServiceInternalElement[];
        // looping through all elements of the array.

        if(!(Array.isArray(servicePartInternalElementArray))) {
            servicePartInternalElementArray = [servicePartInternalElementArray];
        }
        servicePartInternalElementArray.forEach((amlServiceInternalElement: ServiceInternalElement) => {
            // TODO > Better solution possible?
            // TODO > Why no check? RefBaseSystemUnitPath
            // Skip ServiceModel Relation in FirstPlace
            if (amlServiceInternalElement.RefBaseSystemUnitPath.includes('ServiceRelation')) return;
            let localAMLServiceInternalElementAttributes: Attribute[] = [];
            if(!Array.isArray(amlServiceInternalElement.Attribute)) {
                localAMLServiceInternalElementAttributes.push(amlServiceInternalElement.Attribute as Attribute);
            } else {
                localAMLServiceInternalElementAttributes = amlServiceInternalElement.Attribute;
            }
            // will be continuously filled while in the loop circle
            const localService = {} as InternalServiceType;
            localService.Attributes = [];
            localService.Identifier = amlServiceInternalElement.ID;
            localService.MetaModelRef = amlServiceInternalElement.RefBaseSystemUnitPath;
            localService.Name = amlServiceInternalElement.Name;
            localService.ParametersRefID = [];
            localService.Procedures = [];
            /* extract the 'RefID'-Attribute. It's important! and referencing to the DataAssembly of the service which
            stores all the interface data to the hardware. */
            this.getAttribute('RefID', localAMLServiceInternalElementAttributes, (response: PiMAdResponse) => {
                if(response.constructor.name === 'SuccessResponse') {
                    localService.DataAssembly = response.getContent() as Attribute;
                }
            });
            // extract and store all other attributes
            this.extractAttributes(localAMLServiceInternalElementAttributes, (response => {
                localService.Attributes = response.getContent() as Attribute[];
            }));
            const localProceduresAndParams = this.extractProceduresAndParameters(amlServiceInternalElement.InternalElement);
            localService.Procedures = localProceduresAndParams.procedures;
            localService.ParametersRefID = localProceduresAndParams.confParams;
            extractedServiceData.push(localService);
        });
        const localResponse = this.responseVendor.buySuccessResponse();
        localResponse.initialize('Successfully extracting the ServicePart!', extractedServiceData);
        callback(localResponse);
    }

    private extractProceduresAndParameters(internalElement: AML.DataItemInstanceList[]): {procedures: InternalProcedureType[]; confParams: string[]} {
        //TODO Service must have at least one procedure, do a check
        const returnObject: {procedures: InternalProcedureType[]; confParams: string[]} = {procedures: [], confParams: []} ;

        const localProcedureArray: InternalProcedureType[] = [];
        let internalElementArray = internalElement;

        if(!(Array.isArray(internalElementArray))) {
            internalElementArray = [internalElementArray];
        }

        internalElementArray.forEach((amlServiceInternalElementItem: DataItemInstanceList) => {
            if (!amlServiceInternalElementItem){
                return;
            }
            switch (amlServiceInternalElementItem.RefBaseSystemUnitPath) {
                case 'MTPServiceSUCLib/ServiceProcedure': {
                    /* like the services above the data of the procedures in the MTP-ServiceSet is insufficient.
                    Therefore use again a quasi procedure. The importer will later merge the quasi procedure and the
                    referenced DataAssembly. */
                    const localProcedure = {} as InternalProcedureType;
                    localProcedure.Attributes = [];
                    localProcedure.Identifier = amlServiceInternalElementItem.ID;
                    localProcedure.MetaModelRef = amlServiceInternalElementItem.RefBaseSystemUnitPath;
                    localProcedure.Name = amlServiceInternalElementItem.Name;
                    localProcedure.ParametersRefID = [];
                    localProcedure.ReportValuesRefID= [];
                    localProcedure.ProcessValuesInRefID= [];
                    localProcedure.ProcessValuesOutID= [];

                    this.getAttribute('RefID', amlServiceInternalElementItem.Attribute, (response: PiMAdResponse) => {
                        if(response.constructor.name === 'SuccessResponse') {
                            localProcedure.DataAssembly = response.getContent() as Attribute;
                        }
                    });
                    // extract all the other Attributes
                    this.extractAttributes(amlServiceInternalElementItem.Attribute, (response => {
                        localProcedure.Attributes = response.getContent() as Attribute[];
                    }));
                    localProcedureArray.push(localProcedure);

                    if((amlServiceInternalElementItem as any).InternalElement){
                        let procedureParameterElementArray = (amlServiceInternalElementItem as any).InternalElement;
                        if(!Array.isArray((amlServiceInternalElementItem as any).InternalElement)){
                            procedureParameterElementArray = [(amlServiceInternalElementItem as any).InternalElement];
                        }
                        procedureParameterElementArray.forEach((internalElement: any)=>{
                            let refID;
                            switch (internalElement.RefBaseSystemUnitPath){
                                case 'MTPServiceSUCLib/ServiceParameter/ProcedureParameter':
                                    //TODO look up, must procedure have parameter?
                                    refID = internalElement.Attribute.Value;
                                    localProcedure.ParametersRefID.push(refID);
                                    break;
                                case 'MTPServiceSUCLib/ServiceParameter/ReportValue':
                                    refID = internalElement.Attribute.Value;
                                    localProcedure.ReportValuesRefID.push(refID);
                                    break;
                                case 'MTPServiceSUCLib/ServiceParameter/ProcessValueIn':
                                    refID = internalElement.Attribute.Value;
                                    localProcedure.ProcessValuesInRefID.push(refID);

                                    break;
                                case 'MTPServiceSUCLib/ServiceParameter/ProcessValueOut':
                                    refID = internalElement.Attribute.Value;
                                    localProcedure.ProcessValuesOutID.push(refID);
                                    break;
                            }
                        });
                    }
                    break;
                }
                case 'MTPServiceSUCLib/ServiceParameter/ConfigurationParameter': {
                    const refID = (amlServiceInternalElementItem.Attribute as unknown as Attribute).Value;
                    returnObject.confParams.push(refID);
                    //TODO WIP
                    break;
                }

                default:
                  //  logger.warn('Unknown >InternalElement< in service <' + amlServiceInternalElement.Name + '> Ignoring!');
                    break;
            }

        });
        returnObject.procedures = localProcedureArray;
        return returnObject;
    }
    /**
     * Transforming AML-Attributes into AML-Attributes. Ignoring specific one. f. ex. RefID. Needs a Refactor -\> PiMAd
     * needs an attribute interface too!
     * @param attributes - The attributes array.
     * @param callback - A callback function with an instance of the Response-Interface.
     */
    private extractAttributes(attributes: Attribute[], callback: (response: PiMAdResponse) => void): void {
        const responseAttributes: Attribute[] = [];
        /* Easier handling of 'single' and 'multiple' attributes in one code section. Therefore a single attribute is
            transferred to an array with one entry. */
        if(!(Array.isArray(attributes))) {
            attributes = [attributes];
        }
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


}
