import {Response, ResponseVendor} from '../Backbone/Response';
import {Gate} from './Gate';
import {logger} from '../Utils/Logger';
import {BasicSemanticVersion, SemanticVersion} from '../Backbone/SemanticVersion';

abstract class AImporter implements  Importer {

    protected gate: Gate[];
    protected initialized: boolean;
    protected metaModelVersion: SemanticVersion;
    protected nextImporter: Importer | undefined;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.initialized = false;
        this.gate = []
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
            if(nextImporter == undefined) {
                logger.warn('You pass an Importer to a LastChainLinkImporter. That is not necessary. Use undefined instead.');
            }
            this.initialized = true;
            return true
        } else {
            return false;
        }
    };
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

