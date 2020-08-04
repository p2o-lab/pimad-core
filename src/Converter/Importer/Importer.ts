import {Response, ResponseVendor} from '../../Backbone/Response';
import {logger} from '../../Utils/Logger';
import {BasicSemanticVersion, SemanticVersion} from '../../Backbone/SemanticVersion';
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
import {AML} from 'PiMAd-types';
import InstanceHierarchy = AML.InstanceHierarchy
import { CAEXFile } from 'PiMAd-types';
import {
    BaseDataAssemblyFactory,
    DataAssembly,
    DataAssemblyFactory
} from '../../ModuleAutomation/DataAssembly';
import {CommunicationInterfaceData} from '../../ModuleAutomation/CommunicationInterfaceData';
import {BasePEAFactory} from '../../ModuleAutomation/PEA';
import {BaseServiceFactory, Service} from '../../ModuleAutomation/Service';
import {BaseProcedureFactory, Procedure, ProcedureFactory} from '../../ModuleAutomation/Procedure';
import {Gate} from '../Gate/Gate';
abstract class AImporter implements  Importer {

    protected initialized: boolean;
    protected metaModelVersion: SemanticVersion;
    protected nextImporter: Importer | undefined;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.initialized = false;
        this.metaModelVersion = new BasicSemanticVersion();
        this.nextImporter = undefined;
        this.responseVendor = new ResponseVendor();

        this.metaModelVersion.initialize(0,0,1);
    }
    /** @inheritDoc */
    abstract convertFrom(instructions: object, callback: (response: Response) => void): void;
    getMetaModelVersion(): SemanticVersion {
        return this.metaModelVersion;
    };
    initialize(nextImporter: Importer): boolean {
        if (!this.initialized) {
            this.nextImporter = nextImporter;
            this.initialized = (JSON.stringify(this.nextImporter) == JSON.stringify(nextImporter));
            return this.initialized;
        } else {
            return false;
        }
    };
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
    convertFrom(instructions: object, callback: (response: Response) => void): void {
        callback(this.responseVendor.buyErrorResponse())
    };
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
            return true
        } else {
            return false;
        }
    };
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
    private dataAssemblyFactory: DataAssemblyFactory;
    private mtpGateFactory: GateFactory;
    private peaFactory: BasePEAFactory;
    private procedureFactory: ProcedureFactory;
    private serviceFactory: BaseServiceFactory;
    private xmlGateFactory: GateFactory;
    private zipGateFactory: GateFactory;

    /** @inheritDoc */
    convertFrom(instructions: {source: string},
                callback: (response: Response) => void): void {
        if(this.initialized) {
            //
            this.followInstructions(instructions, response => {
                callback(response);
            });
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use of a non-initialized MTPFreeze202001Importer. This one rejects the Request!');
            notInitialized.initialize('The Importer is not initialized yet! Aborting ... ', {})
            callback(notInitialized)
        }
    }

    /**
     * This method evaluates the instructions to the importer. Valid instructions are forwarded to {@linkcode accessDataSource} to gain
     * access to the source and the data stored in it.
     *
     * Answers the first question of the activity {@linkcode Importer.convertFrom} for this importer.
     *
     * @param instructions - Pass the address of the source via the source attribute of the object.
     * @param callback - Returns a successful {@linkcode SuccessResponse} with PEA or an {@linkcode ErrorResponse} with
     * a message why this step has finally failed.
     */
    private followInstructions(instructions: {source: string}, callback: (response: Response) => void): void {
        // Instructions
        if(instructions.source != undefined) {
            // access data source
            this.accessDataSource(instructions, response => {
                callback(response)
            })
        } else {
            this.nextImporter?.convertFrom(instructions, response => {
                callback(response);
            })
        }
    }

    /**
     * This method reads the data from the source and converts it into a JSON-object, which is then passed to the
     * {@linkcode checkInformationModel} to check the meta model.
     *
     * Answers the second question of the activity {@linkcode Importer.convertFrom} for this importer.
     *
     * @param instructions - Pass the address of the source via the source attribute of the object.
     * @param callback - Returns a successful {@linkcode SuccessResponse} with PEA or an {@linkcode ErrorResponse} with
     * a message why this step has finally failed.
     * @private
     */
    private accessDataSource(instructions: {source: string}, callback: (response: Response) => void): void {
        let gate: Gate = new MockGateFactory().create();
        switch (instructions.source.slice(-4)) {
            case '.aml':
                gate = this.amlGateFactory.create();
                break;
            case '.mtp':
                gate = this.mtpGateFactory.create();
                break;
            case '.xml':
                gate = this.xmlGateFactory.create();
                break;
            case '.zip':
                gate = this.zipGateFactory.create();
                break;
            default:
                break;
        }

        gate.initialize(instructions.source);
        gate.receive({}, response => {
            //TODO: Fix that in Gate.ts
            const caexFile: { data?: {CAEXFile: CAEXFile}} = response.getContent();
            if(caexFile.data?.CAEXFile != undefined) {
                this.checkInformationModel(caexFile.data.CAEXFile, checkIMResponse => {
                    callback(checkIMResponse);
                })
            } else {
                const followInstructionResponse = this.responseVendor.buyErrorResponse()
                followInstructionResponse.initialize('The File at ' + instructions.source + ' is not valid CAEX!', {})
                callback(followInstructionResponse)
            }
        })
    }

    /**
     * Uff... actually there is no real possibility to check IM of MTP. Missing SemVer. Therefore passing to the
     * next stage.
     *
     * Answers the third question of the activity {@linkcode Importer.convertFrom} for this importer.
     *
     * @param data - The content of a CAEXFile as a JSON-object.
     * @param callback - TODO after rework!
     * @private
     */
    private checkInformationModel(data: CAEXFile, callback: (response: Response) => void): void {
        this.convert(data, response => {
            callback(response)
        })
    }

    /**
     * Get a specific ModuleTypePackageSet-Set.
     * @param refBaseSystemUnitPath - The meta model path.
     * @param array - An array with ModuleTypePackage-Sets
     * @param callback - ???
     * @private
     */
    private getSet(refBaseSystemUnitPath: string, array: object[], callback: (set: object) => void): void {
        array.forEach((content: {RefBaseSystemUnitPath?: string}) => {
            if(refBaseSystemUnitPath === content.RefBaseSystemUnitPath) {
                callback(content);
            }
        })
    }

    /**
     * This method translates the interface description of the ModuleTypePackage within the CAEX file into a PEA of the
     * PiMAd-core-IM. After the different MTP parts are extracted by {@linkcode ImporterPart}s, DataAssemblies, Services
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
     *              :initialize a PEA object;
     *              if (initialization successful?) then (yes)
     *                  :callback the PEA\nvia SuccessResponse;
     *              else (no)
     *                  :callback error\nvia ErrorResponse;
     *              endif
     *          endif
     *          stop
     *     }
     * </uml>
     *
     * @param data - The data as CAEXFile.
     * @param callback - ???
     * @private
     */
    private convert(data: CAEXFile, callback: (response: Response) => void): void {
        // These variables will be continuously filled
        let communicationInterfaceData: CommunicationInterfaceData[] = []; // TODO > link to communication interface
        let dataAssemblies: DataAssembly[] = []
        let communicationSet: {InternalElement: object[]} = {} as {InternalElement: object[]};
        let mtpPartResponseContent: ExtractDataFromCommunicationSetResponseType = {} as ExtractDataFromCommunicationSetResponseType
        let servicePartResponseContent: InternalServiceType[] = [];
        // looping through the first level instance hierarchy of the CAEX-File.
        data.InstanceHierarchy.forEach((instance: InstanceHierarchy) => {
            const localInternalElement = instance.InternalElement as unknown as {RefBaseSystemUnitPath: string; InternalElement: object[]};
            // TODO: Very bad style
            switch (instance.Name) {
                case 'ModuleTypePackage':
                    this.getSet('MTPSUCLib/CommunicationSet', localInternalElement.InternalElement, set => {
                        communicationSet = set as {InternalElement: object[]};
                    })
                    const mtpImporterPart: MTPPart = new MTPPart();
                    mtpImporterPart.extract({CommunicationSet: communicationSet.InternalElement, HMISet: {}, ServiceSet: {}, TextSet: {}}, mtpPartResponse => {
                        if(mtpPartResponse.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                            mtpPartResponseContent = mtpPartResponse.getContent() as ExtractDataFromCommunicationSetResponseType;
                            communicationInterfaceData = mtpPartResponseContent.CommunicationInterfaceData;
                            dataAssemblies = mtpPartResponseContent.DataAssemblies;
                        } else {
                          logger.warn('Could not extract CommunicationSet');
                        }
                    })
                    break;
                case 'Services':
                    const serviceImporterPart = new ServicePart();
                    serviceImporterPart.extract(instance as ServicePartExtractInputDataType, servicePartResponse => {
                        servicePartResponseContent = servicePartResponse.getContent() as InternalServiceType[]
                    })
                    break;
                default:
                    break;
            }
        })
        // Checking the data for completeness
        if(JSON.stringify(mtpPartResponseContent) === JSON.stringify({}) || JSON.stringify(servicePartResponseContent) === JSON.stringify({})) {
            const localResponse = this.responseVendor.buyErrorResponse();
            localResponse.initialize('Could not extract MTPSUCLib/CommunicationSet and/or MTPServiceSUCLib/ServiceSet. Aborting...', {})
            callback(localResponse);
        } else {
            // data is fine -> Now merging Services and Procedures with DataAssemblies.
            const localServices: Service[] = [];
            servicePartResponseContent.forEach((service: InternalServiceType) => {
                const localService = this.serviceFactory.create()
                const localServiceDataAssembly: DataAssembly | undefined = dataAssemblies.find(dataAssembly =>
                    service.DataAssembly.Value === dataAssembly.getIdentifier()
                );
                if(localServiceDataAssembly === undefined) {
                    logger.warn('Could not find referenced DataAssembly for service <' + service.Name + '> Skipping this service ...');
                } else {
                    const localServiceProcedures: Procedure[] = [];
                    // merging Procedures with DataAssemblies
                    service.Procedures.forEach(procedure => {
                        const localProcedureDataAssembly: DataAssembly | undefined = dataAssemblies.find(dataAssembly =>
                            procedure.DataAssembly.Value === dataAssembly.getIdentifier()
                        );
                        if(localProcedureDataAssembly === undefined) {
                            logger.warn('Could not find referenced DataAssembly for procedure <' + service.Name + '> Skipping this procedure ...');
                        } else {
                            const localProcedure = this.procedureFactory.create();
                            if(localProcedure.initialize(localProcedureDataAssembly, procedure.Identifier, procedure.MetaModelRef, procedure.Name, procedure.Attributes, procedure.Parameters)) {
                                localServiceProcedures.push(localProcedure);
                            }
                        }
                    })
                    // initialize the new service object ...
                    if(localService.initialize(service.Attributes, localServiceDataAssembly, service.Identifier, service.MetaModelRef, service.Name, service.Parameters, localServiceProcedures)) {
                        // ... and push it to the array.
                        localServices.push(localService);
                    }
                }
            })
            const localPEA = this.peaFactory.create();
            // Initializing the local pea
            if(localPEA.initialize({DataAssemblies: dataAssemblies, DataModel: '', DataModelVersion: new BasicSemanticVersion(), FEAs: [], Name: '', Services: localServices,})) {
                // successful -> callback with successful response
                const localSuccessResponse = this.responseVendor.buySuccessResponse();
                localSuccessResponse.initialize('Success!', localPEA)
                callback(localSuccessResponse);
            } else {
                // error -> callback with error response
                const localErrorResponse = this.responseVendor.buyErrorResponse();
                localErrorResponse.initialize('Could not extract PEA from ???. Aborting', {})
                callback(localErrorResponse);
            }
        }
    }

    constructor() {
        super();
        this.servicePart = new ServicePart();
        this.hmiPart = new HMIPart();
        this.mtpPart = new MTPPart();
        this.textPart = new TextPart();
        // Factories
        this.amlGateFactory = new AMLGateFactory();
        this.dataAssemblyFactory = new BaseDataAssemblyFactory();
        this.mtpGateFactory = new MTPGateFactory();
        this.peaFactory = new BasePEAFactory();
        this.procedureFactory = new BaseProcedureFactory();
        this.serviceFactory = new BaseServiceFactory();
        this.xmlGateFactory = new XMLGateFactory();
        this.zipGateFactory = new ZIPGateFactory();
    }
}

export interface Importer {
    /**
     * This method converts a set of data into a PEA of the PiMAd core IM. It first checks whether the instructions
     * given are understood. Then, whether the data source can be tapped. Then whether the information model of the data
     * source is understood. If all responses are positive, the actual conversion into a PEA takes place. If parts of
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
     * @param callback - Returns a successful {@linkcode SuccessResponse} with PEA or an {@linkcode ErrorResponse} with
     * a message why the converting has finally failed.
     */
    convertFrom(instructions: object, callback: (response: Response) => void): void;

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

