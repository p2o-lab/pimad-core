import {ErrorResponseFactory, SuccessResponseFactory, Response} from '../Backbone/Response';
import {Gate} from './Gate';
import {logger} from '../Utils/Logger';

abstract class AImporter implements  Importer {

    protected initialized: boolean;
    protected nextImporter: Importer | undefined;
    protected successResponseFactory: SuccessResponseFactory
    protected errorResponseFactory: ErrorResponseFactory

    constructor() {
        this.nextImporter = undefined;
        this.initialized = false;
        this.successResponseFactory = new SuccessResponseFactory();
        this.errorResponseFactory = new ErrorResponseFactory();
    }
    abstract convertFrom(instructions: object, callback: (response: Response) => void): void;
    initialize(nextImporter: Importer): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.nextImporter = nextImporter;
            return (JSON.stringify(this.nextImporter) == JSON.stringify(nextImporter))
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
     * @param instructions - A set of instructions. Configuring the importer.
     * @param callback - Passing the result back via a callback function.
     */
    convertFrom(instructions: object, callback: (response: Response) => void): void {
        callback(this.errorResponseFactory.create())
    };
    /**
     * Initializing the LastChainLink.
     * @param nextImporter - The next Importer element in the chain, but this is already the last element! Therefore the
     * object will not be stored. You could also pass an 'undefined' here.
     */
    initialize(nextImporter: Importer | undefined): boolean {
        if (!this.initialized) {
            if(nextImporter == undefined) {
                console.warn('You pass an Importer to a LastChainLinkImporter. That is not necessary. Use undefined instead.');
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

