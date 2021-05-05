import {AMLGateFactory, XMLGateFactory, ZIPGateFactory} from './GateFactory';
import fileSystem = require('fs');
import xml2jsonParser = require('xml2json');
import rimraf = require('rimraf');
import {logger} from '../../Utils';
import {IZipEntry} from 'adm-zip';
import {Backbone} from '../../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;

import AdmZip = require('adm-zip');
/**
 * AGate is an abstract implementation of the Gate-Interface. Mainly this one reduces the code.
 */
abstract class AGate implements Gate {
    protected initialized: boolean;
    protected gateAddress: string | undefined;
    protected responseVendor: PiMAdResponseVendor;

    protected constructor() {
        this.initialized = false;
        this.gateAddress = undefined;
        this.responseVendor = new PiMAdResponseVendor();
    }

    public send(instructions: object, callback: (response: PiMAdResponse) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse();
        localResponse.initialize('Not implemented yet!', {});
        callback(localResponse);
    }

    abstract receive(instructions: object, callback: (response: PiMAdResponse) => void): void;

    getGateAddress(): string | undefined {
        return this.gateAddress;
    }

    initialize(address: string): boolean {
        if (!this.initialized) {
            this.gateAddress = address;
            this.initialized = (this.gateAddress == address);
            return this.initialized;
        } else {
            return false;
        }
    }
}

/**
 * An AFileSystemGate allows the access to the local file system.
 */
abstract class AFileSystemGate extends AGate {
    protected fileSystem = fileSystem;

    /**
     * This function cuts of the last four characters of the input string. F. ex.: test.xml -\> test
     * @param fileName - The name of the file as String.
     */
    protected static getFileType(fileName: string): string {
        return fileName.slice(-4);
    }

    constructor() {
        super();
    }
}

/**
 * A AMLGate is an abstraction layer to interact with AML-Files.
 */
export class AMLGate extends AFileSystemGate {
    private xmlGateFactory: XMLGateFactory;

    receive(instructions: object, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            const xmlGate = this.xmlGateFactory.create();
            xmlGate.initialize('' + this.gateAddress);
            xmlGate.receive(instructions, response => {
                if (response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                    const content: { data?: {}} = response.getContent();
                    const localResponse = this.responseVendor.buySuccessResponse();
                    localResponse.initialize('Success!', {data: content.data});
                    logger.info('Successfully parsed the AML-File at ' + this.gateAddress);
                    callback(localResponse);
                } else {
                    logger.error('Could not parse the AML-File at ' + this.gateAddress);
                    callback(this.responseVendor.buyErrorResponse());
                }
            });
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use of a non-initialized AML-Gate. This one rejects the Request!');
            notInitialized.initialize('The Gate is not initialized yet! Aborting ... ', {});
            callback(notInitialized);
        }
    }
    constructor() {
        super();
        this.xmlGateFactory = new XMLGateFactory();
    }
}

/**
 * A MockGate let test your implementation and converter logic. It has no relevant function.
 */
export class MockGate extends AGate {

    send(instructions: object, callback: (response: PiMAdResponse) => void): void {
        logger.debug('Send ' + instructions + ' to ' + this.getGateAddress());
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('This is a send-response of a mock gate.', instructions);
        callback(response);
    }

    receive(instructions: object, callback: (response: PiMAdResponse) => void): void {
        if (this.initialized) {
            const response = this.responseVendor.buySuccessResponse();
            response.initialize('This is a receive-response of a mock gate.', instructions);
            callback(response);
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use of a non-initialized Mock-Gate. This one rejects the Request!');
            notInitialized.initialize('The Gate is not initialized yet! Aborting ... ', {});
            callback(notInitialized);
        }
    }

    constructor() {
        super();
        this.gateAddress = 'Valinor';
    }
}

/**
 * A MTPGate is an abstraction layer to interact with MTP-Archives.
 */
export class MTPGate extends AFileSystemGate {
    private zipGateFactory: ZIPGateFactory;

    receive(instructions: object, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            const zipGate = this.zipGateFactory.create();
            zipGate.initialize('' + this.gateAddress);
            zipGate.receive({}, response => {
                if (response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                    const zipGateResponse: {data?: []} = response.getContent();
                    const mtpGateResponse = this.responseVendor.buySuccessResponse();
                    mtpGateResponse.initialize('Success!', {data: zipGateResponse.data});
                    callback(mtpGateResponse);
                } else {
                    callback(this.responseVendor.buyErrorResponse());
                }
            });
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use of a non initialized MTP-Gate. This one rejects the Request!');
            notInitialized.initialize('The Gate is not initialized yet! Aborting ... ', {});
            callback(notInitialized);
        }
    }

    constructor() {
        super();
        this.zipGateFactory = new ZIPGateFactory();
    }
}

/**
 * A XMLGate is an abstraction layer to interact with XML-Files.
 */
export class XMLGate extends AFileSystemGate {

    receive(instructions: object, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            this.fileSystem.readFile('' + this.gateAddress, (error: NodeJS.ErrnoException | null, data: Buffer) => {
                if (!error) {
                    const json: {} = xml2jsonParser.toJson(data.toString(), {object: true});
                    const xmlGateResponse = this.responseVendor.buySuccessResponse();
                    xmlGateResponse.initialize('Success!', {data: json});
                    logger.info('Successfully parsed the XML-File at ' + this.gateAddress);
                    callback(xmlGateResponse);
                } else {
                    logger.error('Could not parse the XML-File at ' + this.gateAddress);
                    callback(this.responseVendor.buyErrorResponse());
                }
            });
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use of a non initialized XML-Gate. This one rejects the Request!');
            notInitialized.initialize('The Gate is not initialized yet! Aborting ... ', {});
            callback(notInitialized);
        }
    }
}

/**
 * A ZIPGate is an abstraction layer to interact with ZIP-Archives.
 */
export class ZIPGate extends AFileSystemGate {
    private xmlGateFactory: XMLGateFactory;
    private amlGateFactory: AMLGateFactory;

    receive(instructions: object, callback: (response: PiMAdResponse) => void): void {
        if(this.initialized) {
            const zipHandler = new AdmZip(this.gateAddress);
            const zipEntries = zipHandler.getEntries(); // an array of ZipEntry records

            if (zipEntries.length >= 0) {
                // build the path to the parent and the extracted folder
                const responseData: object[] = [];
                const unzippedFolderPath = (''+ this.gateAddress).split('.')[0];
                const folderPath = unzippedFolderPath;
                if (!fileSystem.existsSync(unzippedFolderPath)){
                    fileSystem.mkdirSync(unzippedFolderPath);
                }
                // extract the zip
                zipHandler.extractAllTo(folderPath, true);
                // parse the entries ...
                zipEntries.forEach((entry: IZipEntry) => {
                    // Supporting different file types
                    switch (ZIPGate.getFileType(entry.entryName)) {
                        // TODO: Coding > Generic one
                        case '.aml': {
                            const amlGate = this.amlGateFactory.create();
                            amlGate.initialize(folderPath + '/' + entry.entryName);
                            amlGate.receive({}, (response: PiMAdResponse) => {
                                if (response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                                    responseData.push(response.getContent());
                                    // Calling the callback in the last loop cycle
                                   // if (entry == zipEntries[zipEntries.length-1]) {
                                        const zipGateResponse = this.responseVendor.buySuccessResponse();
                                        zipGateResponse.initialize('Success!', {data: responseData});
                                        // delete the extracted data
                                        rimraf(unzippedFolderPath, function () {
                                            callback(zipGateResponse);
                                        });
                                   // }
                                }
                            });
                            break;
                        }
                        case '.xml': {
                            const xmlGate = this.xmlGateFactory.create();
                            xmlGate.initialize(folderPath + '/' + entry.entryName);
                            xmlGate.receive({}, (response: PiMAdResponse) => {
                                if (response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                                    responseData.push(response.getContent());
                                    // Calling the callback in the last loop cycle
                                        const zipGateResponse = this.responseVendor.buySuccessResponse();
                                        zipGateResponse.initialize('Success!', {data: responseData});
                                        // delete the extracted data
                                        rimraf(unzippedFolderPath, function () {
                                            callback(zipGateResponse);
                                        });

                                }
                            });
                            break;
                        }
                        default:
                            logger.warn('There is an unsupported file type. Ignoring...');
                            break;
                    }
                });
            } else {
                callback(this.responseVendor.buyErrorResponse());
            }
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use of a non initialized ZIP-Gate. This one rejects the Request!');
            notInitialized.initialize('The Gate is not initialized yet! Aborting ... ', {});
            callback(notInitialized);
        }

    }

    constructor() {
        super();
        this.xmlGateFactory = new XMLGateFactory();
        this.amlGateFactory = new AMLGateFactory();
    }
}

/**
 * Gates allows connections to other realms. Use Gates to connect to different data sources like MTP or TripleStore with
 * a little API. Every Gate needs an initialisation via initialize() to work in proper manner.
 */
export interface Gate {
    /**
     * Write data to the source via the gate.
     * @param instructions - A set of instructions, configuring the gate while sending.
     * @param callback - Concerning asynchronous behaviour, return data via a callback function.
     */
    send(instructions: object, callback: (response: PiMAdResponse) => void): void;
    /**
     * Asynchronous: Send a request to the source and receive theirs answer.
     * @param instructions - A set of instructions, configuring the gate while receiving.
     * @param callback - Concerning asynchronous behaviour, return data via a callback function.
     */
    receive(instructions: object, callback: (response: PiMAdResponse) => void): void;
    // TODO: What to do with open()/close() ???
    //open(): Response;
    //close(): Response;
    /**
     * Get the address of the gate.
     * @returns Returns the address of the gate.
     */
    getGateAddress(): string | undefined;

    /**
     * Initialize the gate. The gates won't work without initialisation.
     * @param address - The address of the Gate.
     * @returns A successful initialisation returns a true. A bad one returns a false.
     */
    initialize(address: string): boolean;
}
