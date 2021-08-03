import {logger} from '../../Utils';
import {Backbone, BasicSemanticVersion, SemanticVersion} from '../../Backbone';
import {
    ExtractDataFromCommunicationSetResponseType,
    HMIPart,
    ImporterPart,
    InternalServiceType,
    MTPPart,
    ServicePart,
    ServicePartExtractInputDataType,
    TextPart
} from './ImporterPart';
import {
    AMLGateFactory,
    MTPGateFactory,
    XMLGateFactory,
    ZIPGateFactory,
    GateFactory,
    MockGateFactory
} from '../Gate/GateFactory';
import {AML, CAEXFile} from '@p2olab/pimad-types';
import InstanceHierarchy = AML.InstanceHierarchy
import {
    Attribute, AttributeFactoryVendor, DataItemModel, ModuleAutomation
} from '../../ModuleAutomation';
import {BasePEAFactory} from '../../ModuleAutomation';
import {ServiceModel} from '../../ModuleAutomation';
import {BaseProcedureFactory, ProcedureModel, ProcedureFactory} from '../../ModuleAutomation';
import {Gate} from '../Gate/Gate';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssembly = ModuleAutomation.DataAssembly;
import { v4 as uuidv4 } from 'uuid';
import {BaseServiceFactory} from '../../ModuleAutomation/ServiceModel';

abstract class AImporter implements  Importer {

    protected initialized: boolean;
    protected metaModelVersion: SemanticVersion;
    protected nextImporter: Importer | undefined;
    protected responseVendor: PiMAdResponseVendor;

    constructor() {
        this.initialized = false;
        this.metaModelVersion = new BasicSemanticVersion();
        this.nextImporter = undefined;
        this.responseVendor = new PiMAdResponseVendor();

        this.metaModelVersion.initialize(0,0,1);
    }
    /** @inheritDoc */
    abstract convertFrom(instructions: object, callback: (response: PiMAdResponse) => void): void;
    getMetaModelVersion(): SemanticVersion {
        return this.metaModelVersion;
    }
    initialize(nextImporter: Importer): boolean {
        if (!this.initialized) {
            this.nextImporter = nextImporter;
            this.initialized = (JSON.stringify(this.nextImporter) == JSON.stringify(nextImporter));
            return this.initialized;
        } else {
            return false;
        }
    }
}

/**
 * Last link of every importer chain. Cleans up and build a meaningful answer why the import has failed.
 */
export class LastChainLinkImporter extends AImporter {
    /**
     * All prioritized importers could not perform the import. Error message with debug information is created and
     * returned to the calling one.
     *
     * @param instructions - A set of instructions, configuring the importer.
     * @param callback - Passing the result back via a callback function.
     */
    convertFrom(instructions: object, callback: (response: PiMAdResponse) => void): void {
        callback(this.responseVendor.buyErrorResponse());
    }
    /**
     * Initializing the LastChainLink.
     * @param nextImporter - The next Importer element in the chain, but this is already the last element! Therefore the
     * object will not be stored. You could also pass an 'undefined' here.
     */
    initialize(nextImporter: Importer | undefined): boolean {
        if (!this.initialized) {
            if(nextImporter != undefined) {
                logger.warn('You pass an Importer to a LastChainLinkImporter. That is not necessary. Use undefined instead.');
            }
            this.initialized = true;
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Importer for MTPFreeze 2020.01.
 */
export class MTPFreeze202001Importer extends AImporter {
    private servicePart: ImporterPart;
    private hmiPart: ImporterPart;
    private mtpPart: ImporterPart;
    private textPart: ImporterPart;
    // Factories
    private amlGateFactory: GateFactory;
    private dataAssemblyVendor: DataAssemblyVendor;
    private mtpGateFactory: GateFactory;
    private peaFactory: BasePEAFactory;
    private procedureFactory: ProcedureFactory;
    private serviceFactory: BaseServiceFactory;
    private xmlGateFactory: GateFactory;
    private zipGateFactory: GateFactory;

    private communicationInterfaceData: any;
    private dataAssemblies: DataAssembly[] =[];

    constructor() {
        super();
        this.servicePart = new ServicePart();
        this.hmiPart = new HMIPart();
        this.mtpPart = new MTPPart();
        this.textPart = new TextPart();
        // Factories
        this.amlGateFactory = new AMLGateFactory();
        this.dataAssemblyVendor = new DataAssemblyVendor();
        this.mtpGateFactory = new MTPGateFactory();
        this.peaFactory = new BasePEAFactory();
        this.procedureFactory = new BaseProcedureFactory();
        this.serviceFactory = new BaseServiceFactory();
        this.xmlGateFactory = new XMLGateFactory();
        this.zipGateFactory = new ZIPGateFactory();
    }

    /** @inheritDoc */
    convertFrom(instructions: InstructionsConvertFrom, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            this.followInstructions(instructions, response => {
                callback(response);
            });
        } else {
            const response = this.responseVendor.buyErrorResponse();
            response.initialize('The Importer is not initialized yet! Aborting ... ',{});
            callback(response);
        }
    }

    /**
     * This method evaluates the instructions to the importer. Valid instructions are forwarded to {@link accessDataSource} to gain
     * access to the source and the data stored in it.
     *
     * Answers the first question of the activity {@link Importer.convertFrom} for this importer.
     *
     * @param instructions - Pass the address of the source via the source attribute of the object.
     * @param callback - Returns a successful {@link SuccessResponse} with PEAModel or an {@link ErrorResponse} with
     * a message why this step has finally failed.
     */
    private followInstructions(instructions: InstructionsConvertFrom, callback: (response: PiMAdResponse) => void): void {
        // Instructions
        if(instructions.source != '') {
            this.accessDataSource(instructions, response => {
                callback(response);
            });
        } else {
            this.nextImporter?.convertFrom(instructions, response => {
                callback(response);
            });
        }
    }

    /**
     * This method reads the data from the source and converts it into a JSON-object, which is then passed to the
     * {@link checkInformationModel} to check the meta model.
     *
     * Answers the second question of the activity {@link Importer.convertFrom} for this importer.
     *
     * @param instructions - Pass the address of the source via the source attribute of the object.
     * @param callback - Returns a successful {@link SuccessResponse} with PEAModel or an {@link ErrorResponse} with
     * a message why this step has finally failed.
     * @private
     */
    private accessDataSource(instructions: InstructionsConvertFrom, callback: (response: PiMAdResponse) => void): void {
        let gate: Gate = new MockGateFactory().create();
        switch (instructions.source.split('.').pop()) {
            case 'aml':
                gate = this.amlGateFactory.create();
                break;
            case 'mtp':
                gate = this.mtpGateFactory.create();
                break;
            case 'xml':
                gate = this.xmlGateFactory.create();
                break;
            case 'zip':
                gate = this.zipGateFactory.create();
                break;
        }

        if(gate.constructor.name === new MockGateFactory().create().constructor.name) {
            const response = this.responseVendor.buyErrorResponse();
            response.initialize( 'Unknown source type <' + instructions.source + '>', {});
            callback(response);
        } else {
            gate.initialize(instructions.source);
            gate.receive({}, response => {
                //TODO > Fix gate + address issue in Gate.ts //TODO > Fix that array shit.
                const localCAEXFile: { data?: {CAEXFile: CAEXFile}} = {} as { data: {CAEXFile: CAEXFile}};
                const caexFile: { data?: {CAEXFile: CAEXFile}} = response.getContent();
                if(Array.isArray(caexFile.data)) {
                    localCAEXFile.data = caexFile.data[0].data;
                } else {
                    localCAEXFile.data = caexFile.data ;
                }
                if(localCAEXFile.data?.CAEXFile != undefined) {
                    this.checkInformationModel(localCAEXFile.data.CAEXFile, instructions.identifier,checkIMResponse => {
                        callback(checkIMResponse);
                    });
                } else {
                    const followInstructionResponse = this.responseVendor.buyErrorResponse();
                    followInstructionResponse.initialize('The File at ' + instructions.source + ' is not valid CAEX!', {});
                    callback(followInstructionResponse);
                }
            });
        }
    }

    /**
     * Uff... actually there is no real possibility to check IM of MTP. Missing SemVer. Therefore passing to the
     * next stage.
     *
     * Answers the third question of the activity {@link Importer.convertFrom} for this importer.
     *
     * @param data - The content of a CAEXFile as a JSON-object.
     * @param pimadIdentifier - ???
     * @param callback - TODO after rework!
     * @private
     */
    private checkInformationModel(data: CAEXFile, pimadIdentifier: string, callback: (response: PiMAdResponse) => void): void {
        this.convert(data, pimadIdentifier,response => {
            callback(response);
        });
    }

    /**
     * This method translates the interface description of the ModuleTypePackage within the CAEX file into a PEAModel of the
     * PiMAd-core-IM. After the different MTP parts are extracted by {@link ImporterPart}s, DataAssemblies, Services
     * and Procedures are merged. The reference system of the MTP is used for this. The import of the MTP is then
     * completed.
     *
     * Detailed inline code documentation exists for this method. Nevertheless, it is important to read the MTP
     * standard.
     *
     * <uml>
     *     skinparam shadowing false
     *     partition "convert" {
     *          start
     *          :prepare pea-data-storage;
     *          :loop through the InstanceHierarchy\nand extract data for different\nModuleTypePackage parts;
     *          if(extracted data\nis valid?) then (no)
     *              :callback an ErrorResponse;
     *              stop
     *          else (yes)
     *              while (are there\nmore services?) is (yes)
     *                  :take next service;
     *                  :get and store the\nreferenced DataAssembly;
     *                  if (is referenced DataAssembly undefined?) then (yes)
     *                      :skipping this service;
     *                  else (no)
     *                      :prepare service-data-storage;
     *                      while (are there\nmore procedures?) is (yes)
     *                          :take next procedure;
     *                          :get and store the\nreferenced DataAssembly;
     *                          if (is referenced DataAssembly undefined?) then (yes)
     *                              :skipping this procedure;
     *                          else (no)
     *                              :initialize procedure;
     *                              if (initialization successful?) then (yes)
     *                                  :push procedure to\nservice-data-storage;
     *                              endif
     *                          endif
     *                      endwhile (no)
     *                      :initialize service;
     *                      if (initialization successful?) then (yes)
     *                          :push service to\npea-data-storage;
     *                      endif
     *                  endif
     *              endwhile (no)
     *              :initialize a PEAModel object;
     *              if (initialization successful?) then (yes)
     *                  :callback the PEAModel\nvia SuccessResponse;
     *              else (no)
     *                  :callback error\nvia ErrorResponse;
     *              endif
     *          endif
     *          stop
     *     }
     * </uml>
     *
     * @param data - The data as CAEXFile.
     * @param pimadIdentifier - ???
     * @param callback - ???
     * @private
     */
    private convert(data: CAEXFile, pimadIdentifier: string, callback: (response: PiMAdResponse) => void): void {
        try{
            const extractedData = this.getAndExtractAllSets(data.InstanceHierarchy);
            extractedData.pimadIdentifier = pimadIdentifier;
            // Checking the data for completeness
            if(Object.keys(extractedData.extractedCommunicationSet).length === 0) {
               throw new Error('Could not extract MTPSUCLib/CommunicationSet. Aborting...');
            } else {
                const peaModel =this.mergeAllAndCreatePEAModel(extractedData);
                callback(peaModel);
            }
        } catch (e){
            const response = this.responseVendor.buyErrorResponse();
            response.initialize(e.toString(), {});
            callback(response);
        }
    }

    private getAndExtractAllSets(instanceHierarchy: AML.InstanceHierarchy[]): ExtractedData {
        const moduleTypePackageInternalElement = this.getModuleTypePackageInternalElement(instanceHierarchy);
        const sets = this.getAllSets(moduleTypePackageInternalElement.InternalElement);
        const extractedData: ExtractedData = this.extractAllSets(sets, instanceHierarchy);
        extractedData.peaName = moduleTypePackageInternalElement.Name;
        extractedData.metaModelRef = moduleTypePackageInternalElement.RefBaseSystemUnitPath;
        return extractedData;
    }

    private getModuleTypePackageInternalElement(instanceHierarchy: AML.InstanceHierarchy[]): any  {
        let localInternalElement;
        if(!Array.isArray(instanceHierarchy)){
            instanceHierarchy = [instanceHierarchy];
        }
        instanceHierarchy.forEach((instance: InstanceHierarchy) => {
            if(instance.Name ==='ModuleTypePackage') {
                localInternalElement = instance.InternalElement as unknown as {Name: string; ID: string; RefBaseSystemUnitPath: string; InternalElement: object[]};
            }
        });
        if(!localInternalElement){
            throw new Error('No InstanceHierarchy ModuleTypePackage was found!');
        }
        return localInternalElement;
    }

    private getAllSets(internalElement: object[]): Sets { 
        const allSets: Sets = {CommunicationSet: {}, ServiceSet: {}, TextSet: {}, HMISet: {}};

        this.getSet('MTPSUCLib/CommunicationSet', internalElement, set => {
            allSets.CommunicationSet = set as {InternalElement: object[]};
            if(Object.keys(set).length === 0){
                throw new Error('Could not extract MTPSUCLib/CommunicationSet. No CommunicationSet was found!');
            }
        });
        this.getSet('MTPServiceSUCLib/ServiceSet', internalElement, set => {
            allSets.ServiceSet = set as {ExternalInterface: object};
            if(Object.keys(set).length === 0) {
                logger.warn('No ServiceSet was found.');
            }
        });
        this.getSet('MTPHMISUCLib/HMISet', internalElement, set => {
            allSets.HMISet = set as {ExternalInterface: object};
        });
        this.getSet('MTPTextSUCLib/TextSet', internalElement, set => {
            allSets.TextSet = set as {ExternalInterface: object};
        });
        return allSets;
    }

    /**
     * Get a specific ModuleTypePackageSet-Set.
     * @param refBaseSystemUnitPath - The meta model path.
     * @param array - An array with ModuleTypePackage-Sets
     * @param callback - ???
     * @private
     */
    private getSet(refBaseSystemUnitPath: string, array: object[], callback: (set: object) => void): void {
        let found = false;

        if(!Array.isArray(array)){
            array = [array];
        }

        array.forEach((content: {RefBaseSystemUnitPath?: string}) => {
            if(refBaseSystemUnitPath === content.RefBaseSystemUnitPath) {
                callback(content);
                found = true;
            }
        });

        if(!found) {
            callback({});
        }
    }

    private extractAllSets(sets: Sets, instanceHierarchy: AML.InstanceHierarchy[]): ExtractedData {
        const extractedData: ExtractedData = {} as any;
        instanceHierarchy.forEach((instance: InstanceHierarchy) => {
            if(Object.keys(sets.ServiceSet).length>0) {
                if ((sets.ServiceSet as any).ExternalInterface.Attribute.Value === instance.ID) {
                    const serviceImporterPart = new ServicePart();
                    serviceImporterPart.extract(instance as ServicePartExtractInputDataType, servicePartResponse => {
                        extractedData.extractedServiceSet = (servicePartResponse.getContent() as InternalServiceType[]);
                    });
                }
            }
            if(Object.keys(sets.HMISet).length>0){
                if ((sets.HMISet as any).ExternalInterface.Attribute.Value === instance.ID){
                    const hmiImporterPart = new HMIPart();
                    //TODO not implemented yet
                    hmiImporterPart.extract(instance , hmiPartResponse => {
                        hmiPartResponse.getContent();
                    });
                }
            }
            if(Object.keys(sets.TextSet).length>0) {
                if ((sets.TextSet as any).ExternalInterface.Attribute.Value === instance.ID){
                    const textImporterPart = new TextPart();
                    //TODO not implemented yet
                    textImporterPart.extract(instance , textPartResponse => {
                        textPartResponse.getContent();
                    });
                }
            }
        });
        //communicationset
        const mtpImporterPart: MTPPart = new MTPPart();
        mtpImporterPart.extract({CommunicationSet: (sets.CommunicationSet as any).InternalElement}, mtpPartResponse => {
            if(mtpPartResponse.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                extractedData.extractedCommunicationSet= mtpPartResponse.getContent() as ExtractDataFromCommunicationSetResponseType;
                this.communicationInterfaceData = extractedData.extractedCommunicationSet.ServerCommunicationInterfaceData;
                this.dataAssemblies = extractedData.extractedCommunicationSet.DataAssemblies;
            } else {
                logger.warn('Could not extract CommunicationSet');
            }
        });
        return extractedData;
    }

    //TODO rename this
    private mergeAllAndCreatePEAModel(extractedData: ExtractedData): PiMAdResponse {
        let localServices: ServiceModel[] = [];
        if(extractedData.extractedServiceSet.length!=0) localServices =  this.createServiceModels(extractedData.extractedServiceSet);
        //TODO:  do hmiset, textset
        this.removeServicesFromDataAssemblies(extractedData.extractedCommunicationSet.DataAssemblies);
        return this.createPEAModel(extractedData, localServices);
    }
    /**
     * remove HealthStateView(Procedures) and ServiceControls from dataAssemblies, because subscribeToAllVariables()
     * in backend will take this list for the variables
     * @param dataAssemblies
     * @private
     */
    private removeServicesFromDataAssemblies(dataAssemblies: DataAssembly[]){
        for(const dataAssembly of dataAssemblies){
            // at first, get metaModelRef of dataAssembly
            let mMetaModelRef='';
            dataAssembly.getMetaModelRef((response, metaModelRef) =>
                mMetaModelRef = metaModelRef);

            if(mMetaModelRef.includes('HealthStateView') || mMetaModelRef.includes('ServiceControl')){
                // if DataAssembly is Procedure or Service, remove it!
                const index = dataAssemblies.indexOf(dataAssembly);
                dataAssemblies.splice(index, 1);
                // the dataAssemblies has changed-> start function again, but with updated list
                this.removeServicesFromDataAssemblies(dataAssemblies);
                break;
            }
        }
    }

    private createPEAModel(extractedData: ExtractedData, services: ServiceModel[]): PiMAdResponse {
        const localPEA = this.peaFactory.create();
        if(localPEA.initialize({
            DataAssemblies: extractedData.extractedCommunicationSet.DataAssemblies,
            DataModel: extractedData.metaModelRef,
            DataModelVersion: new BasicSemanticVersion(),
            FEAs: [], Name: extractedData.peaName, PiMAdIdentifier: extractedData.pimadIdentifier,
            Services: services, Endpoint: extractedData.extractedCommunicationSet.ServerCommunicationInterfaceData})) {

            const localSuccessResponse = this.responseVendor.buySuccessResponse();
            localSuccessResponse.initialize('Success!', localPEA);
            return localSuccessResponse;
        } else {
            const localErrorResponse = this.responseVendor.buyErrorResponse();
            localErrorResponse.initialize('Could not extract PEAModel from ???. Aborting', {});
            return localErrorResponse;
        }
    }
    private createServiceModels(servicePartResponseContent: InternalServiceType[]): ServiceModel[] {
        const localServices: ServiceModel[] = [];
        servicePartResponseContent.forEach((service: InternalServiceType) => {
            const localService = this.serviceFactory.create();
            const localServiceDataAssembly: DataAssembly | undefined = this.dataAssemblies.find(dataAssembly => {
                let testCondition = false;
                dataAssembly.getDataSourceIdentifier((response, identifier) => {
                    testCondition = (service.DataAssembly.Value === identifier);
                });
                return testCondition;
            });
            if(localServiceDataAssembly === undefined) {
                logger.warn('Could not find referenced DataAssembly for service <' + service.Name + '> Skipping this service ...');
            } else {
                // merging Procedures with DataAssemblies
                const localServiceProcedures: ProcedureModel[] = this.createProcedureModels(service);

                const serviceAttributes: Attribute[] = [];
                const serviceAttributeFactory = new AttributeFactoryVendor().buyServiceAttributeFactory();
                service.Attributes.forEach(attribute => {
                    const newProcedureAttribute = serviceAttributeFactory.create();
                    if(newProcedureAttribute.initialize({DataType: attribute.AttributeDataType, Name: attribute.Name, Value: attribute.Value})) {
                        serviceAttributes.push(newProcedureAttribute);
                    }
                });
                // initialize the new service object ...
                if(localService.initialize({
                    defaultValue: '', description: '',
                    attributes: serviceAttributes,
                    dataAssembly: localServiceDataAssembly,
                    dataSourceIdentifier: service.Identifier,
                    metaModelRef: service.MetaModelRef,
                    name: service.Name,
                    parameter: service.Parameters,
                    pimadIdentifier: uuidv4(),
                    procedure: localServiceProcedures
                })) {
                    localServices.push(localService);
                }
            }
        });
        return localServices;
    }
    
    private createProcedureModels(service: InternalServiceType): ProcedureModel[] {
        const localServiceProcedures: ProcedureModel[] = [];
        service.Procedures.forEach(procedure => {
            const localProcedureDataAssembly: DataAssembly | undefined = this.dataAssemblies.find(dataAssembly => {
                let testCondition = false;
                dataAssembly.getDataSourceIdentifier((response, identifier) => {
                    testCondition = (procedure.DataAssembly.Value === identifier);
                });
                return testCondition;
            });
            if(localProcedureDataAssembly === undefined) {
                logger.warn('Could not find referenced DataAssembly for procedure <' + service.Name + '> Skipping this procedure ...');
            }
            else {
                const procedureAttributes: Attribute[] = [];
                const procedureAttributeFactory = new AttributeFactoryVendor().buyProcedureAttributeFactory();
                procedure.Attributes.forEach(attribute => {
                    const newProcedureAttribute = procedureAttributeFactory.create();
                    if(newProcedureAttribute.initialize({DataType: attribute.AttributeDataType, Name: attribute.Name, Value: attribute.Value})) {
                        procedureAttributes.push(newProcedureAttribute);
                    }
                });
                const localProcedure = this.procedureFactory.create();
                if(localProcedure.initialize({
                    defaultValue: '',
                    description: '',
                    attributes: procedureAttributes,
                    dataAssembly: localProcedureDataAssembly,
                    dataSourceIdentifier: procedure.Identifier,
                    metaModelRef: procedure.MetaModelRef,
                    name: procedure.Name,
                    parameter: procedure.Parameters,
                    pimadIdentifier: 'TODO'
                })) {
                    localServiceProcedures.push(localProcedure);
                }
            }
        });
        return localServiceProcedures;
    }


}

export interface Importer {
    /**
     * This method converts a set of data into a PEAModel of the PiMAd core IM. It first checks whether the instructions
     * given are understood. Then, whether the data source can be tapped. Then whether the information model of the data
     * source is understood. If all responses are positive, the actual conversion into a PEAModel takes place. If parts of
     * the responses are negative, the next element in the chain of importers (Chain-of-Responsibility pattern) is
     * called.
     *
     * <uml>
     *     skinparam shadowing false
     *     partition convertFrom {
     *          start
     *          :parse instructions;
     *          if(Can I follow\nthe instructions?) then (yes)
     *              if(Can I access\nthe data source?) then (yes)
     *                  if(Do I understand the\ninformation model?) then (yes)
     *                      :Convert it;
     *                      :Fire callback;
     *                      stop
     *                  else (no)
     *                  endif
     *              else (no)
     *              endif
     *          else (no)
     *          endif
     *          :Pass to the next\nchain element;
     *          stop
     *     }
     * </uml>
     *
     * @param instructions - Pass the address of the source via the source attribute of the object.
     * @param callback - Returns a successful {@link SuccessResponse} with PEAModel or an {@link ErrorResponse} with
     * a message why the converting has finally failed.
     */
    convertFrom(instructions: object, callback: (response: PiMAdResponse) => void): void;

    /**
     * Initialize this importer object.
     * @param nextImporter - The next importer in the Chain-of-Responsibility.
     */
    initialize(nextImporter: Importer): boolean;
    getMetaModelVersion(): SemanticVersion;
}

/* Factory */
abstract class AImporterFactory implements ImporterFactory {
    abstract create(): Importer;
}

export class MTPFreeze202001ImporterFactory extends AImporterFactory {
    create(): Importer {
        const importer = new MTPFreeze202001Importer();
        logger.debug(this.constructor.name + ' creates a ' + importer.constructor.name);
        return importer;
    }
}

export class LastChainElementImporterFactory extends AImporterFactory {
    create(): Importer {
        const importer = new LastChainLinkImporter();
        logger.debug(this.constructor.name + ' creates a ' + importer.constructor.name);
        return importer;
    }
}

export interface ImporterFactory {
    create(): Importer;
}

type InstructionsConvertFrom = {
    source: string;
    identifier: string;
}

//TODO maybe use defined type, instead of 'object'
interface Sets {
    CommunicationSet: object;
    ServiceSet: object;
    HMISet: object;
    TextSet: object;
}
interface ExtractedData {
    peaName: string;
    pimadIdentifier: string;
    metaModelRef: string;
    extractedCommunicationSet: ExtractDataFromCommunicationSetResponseType;
    extractedServiceSet: InternalServiceType[];
    extractedHMISet: object[];
    extractedTextSet: object[];
    serviceModels: ServiceModel[];
}

