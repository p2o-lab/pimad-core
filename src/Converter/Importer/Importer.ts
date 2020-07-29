import {Response, ResponseVendor} from '../../Backbone/Response';
import {logger} from '../../Utils/Logger';
import {BasicSemanticVersion, SemanticVersion} from '../../Backbone/SemanticVersion';
import {
    HMIPart,
    ImporterPart,
    InternalServiceType,
    MTPPart,
    ServicePart,
    ServicePartExtractInputDataType,
    TextPart
} from './ImporterPart';
import {AMLGateFactory, MTPGateFactory, XMLGateFactory, ZIPGateFactory, GateFactory} from '../Gate/GateFactory';
import {InstanceHierarchy, ModuleTypePackage} from 'AML';
import { CAEXFile } from 'PiMAd-types';
import {
    BaseDataAssembly,
    BaseDataAssemblyFactory,
    DataAssembly,
    DataAssemblyFactory
} from '../../ModuleAutomation/DataAssembly';
import {CommunicationInterfaceData} from '../../ModuleAutomation/CommunicationInterfaceData';
import {BasePEAFactory} from '../../ModuleAutomation/PEA';
import {BaseServiceFactory, Service} from '../../ModuleAutomation/Service';
import {BaseProcedureFactory, Procedure, ProcedureFactory} from '../../ModuleAutomation/Procedure';
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
     *
     * @param instructions - To do.
     * @param callback - To do.
     */
    private followInstructions(instructions: {source: string}, callback: (response: Response) => void): void {
        // Instructions
        if(instructions.source != undefined) {
            // data source access
            switch (instructions.source.slice(-4)) {
                case '.aml':
                    const amlGate = this.amlGateFactory.create();
                    amlGate.initialize(instructions.source);
                    amlGate.receive({}, response => {
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
                    break;
                case '.mtp':
                    const mtpGate = this.mtpGateFactory.create();
                    mtpGate.initialize(instructions.source);
                    mtpGate.receive({}, response => {
                        callback(response);
                    })
                    break;
                case '.xml':
                    const xmlGate = this.xmlGateFactory.create();
                    xmlGate.initialize(instructions.source);
                    xmlGate.receive({}, response => {
                        callback(response);
                    })
                    break;
                case '.zip':
                    const zipGate = this.zipGateFactory.create();
                    zipGate.initialize(instructions.source);
                    zipGate.receive({}, response => {
                        callback(response);
                    })
                    break;
                default:
                    callback(this.responseVendor.buyErrorResponse())
                    break;
            }
        } else {
            this.nextImporter?.convertFrom(instructions, response => {
                callback(response);
            })
        }
    }

    /** Uff... actually there is no real possibility to check IM of MTP. Missing SemVer. Therefore passing to the
     * next stage.
     * @param data - To do.
     * @param callback - To do.
     */
    private checkInformationModel(data: CAEXFile, callback: (response: Response) => void): void {
        this.convert(data, response => {
            callback(response)
        })
    }

    private getSet(refBaseSystemUnitPath: string, array: object[], callback: (set: object) => void): void {
        array.forEach((content: {RefBaseSystemUnitPath?: string}) => {
            if(refBaseSystemUnitPath === content.RefBaseSystemUnitPath) {
                callback(content);
            }
        })
    }

    private convert(data: CAEXFile, callback: (response: Response) => void): void {
        // Now the parsing starts...
        let communicationInterfaceData: CommunicationInterfaceData[] = [];
        let dataAssemblies: DataAssembly[] = []
        let communicationSet: {InternalElement: object[]} = {} as {InternalElement: object[]};
        let mtpPartResponseContent: {CommunicationInterfaceData: CommunicationInterfaceData[]; DataAssemblies: DataAssembly[]}= {} as {CommunicationInterfaceData: CommunicationInterfaceData[]; DataAssemblies: DataAssembly[]}
        let servicePartResponseContent: InternalServiceType[] = [];
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
                            mtpPartResponseContent = mtpPartResponse.getContent() as {CommunicationInterfaceData: CommunicationInterfaceData[]; DataAssemblies: DataAssembly[]}
                            communicationInterfaceData = mtpPartResponseContent.CommunicationInterfaceData;
                            dataAssemblies = mtpPartResponseContent.DataAssemblies
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
            localResponse.initialize('Could not extract MTPSUCLib/CommunicationSet or MTPServiceSUCLib/ServiceSet. Aborting...', {})
            callback(localResponse);
        } else {
            const localPEA = this.peaFactory.create();
            const localeServices: Service[] = [];
            servicePartResponseContent.forEach((service: InternalServiceType) => {
                const localService = this.serviceFactory.create()
                const localeServiceDataAssembly: DataAssembly | undefined = dataAssemblies.find(dataAssembly =>
                    service.DataAssembly.Value === dataAssembly.getIdentifier()
                )
                if(localeServiceDataAssembly === undefined) {
                    logger.warn('Could not find referenced DataAssembly for service <' + service.Name + '> Skipping this service ...');
                } else {
                    const localServiceProcedures: Procedure[] = [];
                    service.Procedures.forEach(procedure => {
                        const localProcedureDataAssembly: DataAssembly | undefined = dataAssemblies.find(dataAssembly => service.DataAssembly.Value === dataAssembly.getIdentifier())
                        if(localProcedureDataAssembly === undefined) {
                            logger.warn('Could not find referenced DataAssembly for procedure <' + service.Name + '> Skipping this procedure ...');
                        } else {
                            const localProcedure = this.procedureFactory.create();
                            if(localProcedure.initialize(localProcedureDataAssembly, procedure.Identifier, procedure.MetaModelRef, procedure.Name, procedure.Attributes, procedure.Parameters)) {
                                localServiceProcedures.push(localProcedure);
                            }
                        }
                    })
                    if(localService.initialize(service.Attributes, localeServiceDataAssembly, service.Identifier, service.MetaModelRef, service.Name, service.Parameters, localServiceProcedures)) {
                        localeServices.push(localService);
                    }
                }
            })

            const localResponse = this.responseVendor.buySuccessResponse();
            localResponse.initialize('Success!', {})
            callback(localResponse);
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
    convertFrom(instructions: object, callback: (response: Response) => void): void;
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

