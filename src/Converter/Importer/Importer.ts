import {Response, ResponseVendor} from '../../Backbone/Response';
import {logger} from '../../Utils/Logger';
import {BasicSemanticVersion, SemanticVersion} from '../../Backbone/SemanticVersion';
import {HMIPart, ImporterPart, MTPPart, ServicePart, TextPart} from './ImporterPart';
import {AMLGateFactory, MTPGateFactory, XMLGateFactory, ZIPGateFactory} from '../Gate/GateFactory';
import {InstanceHierarchy, ModuleTypePackage} from 'AML';
import { CAEXFile } from 'PiMAd-types';
import {DataAssembly} from '../../ModuleAutomation/DataAssembly';
import {CommunicationInterfaceData} from '../../ModuleAutomation/CommunicationInterfaceData';
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
    private amlGateFactory: AMLGateFactory;
    private mtpGateFactory: MTPGateFactory;
    private xmlGateFactory: XMLGateFactory;
    private zipGateFactory: ZIPGateFactory;

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
        const communicationInterfaceData: CommunicationInterfaceData[] = [];
        const dataAssemblies: DataAssembly[] = []
        data.InstanceHierarchy.forEach((instance: InstanceHierarchy) => {
            const localInternalElement = instance.InternalElement as unknown as {RefBaseSystemUnitPath: string, InternalElement: object[]};
            switch (localInternalElement.RefBaseSystemUnitPath) {
                case 'MTPSUCLib/ModuleTypePackage':
                    let communicationSet: object = {};
                    this.getSet('MTPSUCLib/CommunicationSet', localInternalElement.InternalElement, set => {
                        communicationSet = set;
                    })
                    let serviceSet: object = {};
                    this.getSet('MTPServiceSUCLib/ServiceSet', localInternalElement.InternalElement, set => {
                        serviceSet = set;
                    })
                    if(JSON.stringify(communicationSet) === JSON.stringify({}) || JSON.stringify(serviceSet) === JSON.stringify({})) {
                        const localResponse = this.responseVendor.buySuccessResponse();
                        localResponse.initialize('Could not extract MTPSUCLib/CommunicationSet or MTPServiceSUCLib/ServiceSet for ' + instance.Name , {})
                        callback(localResponse);
                    }
                    //const importerPart: MTPPart = new MTPPart();

                    break;
                default:
                    break;
            }
            if (instance == data.InstanceHierarchy[data.InstanceHierarchy.length-1]) {
                callback(this.responseVendor.buySuccessResponse());
            }
        })
    }

    constructor() {
        super();
        this.servicePart = new ServicePart();
        this.hmiPart = new HMIPart();
        this.mtpPart = new MTPPart();
        this.textPart = new TextPart();
        // Factories
        this.amlGateFactory = new AMLGateFactory();
        this.mtpGateFactory = new MTPGateFactory();
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

