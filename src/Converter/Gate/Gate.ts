import {Response, ResponseVendor} from '../../Backbone/Response';
import {XMLGateFactory, ZIPGateFactory} from './GateFactory';
import fileSystem = require('fs');
import xml2jsonParser = require('xml2json');
import AdmZip = require('adm-zip');
import rimraf = require('rimraf');
import {logger} from '../../Utils/Logger';
import {IZipEntry} from 'adm-zip';

abstract class AGate implements Gate {
    protected initialized: boolean;
    protected gateAddress: string | undefined;
    protected responseVendor: ResponseVendor;

    protected constructor() {
        this.initialized = false;
        this.gateAddress = undefined;
        this.responseVendor = new ResponseVendor();
    }
    public send(instructions: object, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse()
        localResponse.initialize('Not implemented yet!', {})
        callback(localResponse)
    };
    abstract receive(instructions: object, callback: (response: Response) => void): void;
    /*abstract open(): Response;
    abstract close(): Response;*/
    getGateAddress(): string | undefined {
        return this.gateAddress;
    };
    initialize(address: string): boolean {
        if (!this.initialized) {
            this.gateAddress = address;
            this.initialized = (this.gateAddress == address);
            return this.initialized;
        } else {
            return false;
        }
    };
}

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

export class AMLGate extends AFileSystemGate {
    private xmlGateFactory: XMLGateFactory;

    receive(instructions: object, callback: (response: Response) => void): void {
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
                callback(this.responseVendor.buyErrorResponse())
            }
        });
    };
    constructor() {
        super();
        this.xmlGateFactory = new XMLGateFactory();
    }
}

export class MockGate extends AGate {

    send(instructions: object, callback: (response: Response) => void): void {
        logger.debug('Send ' + instructions + ' to ' + this.getGateAddress());
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('This is a send-response of a mock gate.', instructions)
        callback(response);
    };
    receive(instructions: object, callback: (response: Response) => void): void {
        const response = this.responseVendor.buySuccessResponse();
        response.initialize('This is a receive-response of a mock gate.', instructions)
        callback(response);
    };
    constructor() {
        super();
        this.gateAddress = 'Valinor';
    }
}

export class MTPGate extends AFileSystemGate {
    private zipGateFactory: ZIPGateFactory;
    receive(instructions: object, callback: (response: Response) => void): void {
        if(this.initialized) {
            const zipGate = this.zipGateFactory.create();
            zipGate.initialize('' + this.gateAddress);
            zipGate.receive({}, response => {
                if (response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                    const zipGateResponse: {data?: []} = response.getContent();
                    const mtpGateResponse = this.responseVendor.buySuccessResponse();
                    mtpGateResponse.initialize('Success!', {data: zipGateResponse.data});
                    callback(mtpGateResponse)
                } else {
                    callback(this.responseVendor.buyErrorResponse())
                }
            })
        } else {
            const notInitialized = this.responseVendor.buyErrorResponse();
            logger.error('Use an uninitialized Gate to open a MTP-Archive at ' + this.gateAddress + ' . This one rejects the Request!');
            notInitialized.initialize('The Gate is not initialized yet! Aborting ... ', {})
        }
    }

    constructor() {
        super();
        this.zipGateFactory = new ZIPGateFactory();
    }
}

export class XMLGate extends AFileSystemGate {

    receive(instructions: {
        source: string; //TODO: Quatsch!!! Gibt doch ne GateAddresse!
    }, callback: (response: Response) => void): void {
        this.fileSystem.readFile(instructions.source, (error: NodeJS.ErrnoException | null, data: Buffer) => {
            if (!error) {
                const json: {} = xml2jsonParser.toJson(data.toString(), {object: true});
                const xmlGateResponse = this.responseVendor.buySuccessResponse();
                xmlGateResponse.initialize('Success!', {data: json});
                logger.info('Successfully parsed the XML-File at ' + this.gateAddress);
                callback(xmlGateResponse);
            } else {
                logger.error('Could not parse the XML-File at ' + this.gateAddress);
                callback(this.responseVendor.buyErrorResponse())
            }
        })
    };
}

export class ZIPGate extends AFileSystemGate {
    private xmlGateFactory: XMLGateFactory;

    receive(instructions: object, callback: (response: Response) => void): void {
        const zipHandler = new AdmZip(this.gateAddress);
        const zipEntries = zipHandler.getEntries(); // an array of ZipEntry records

        if (zipEntries.length >= 0) {
            // build the path to the parent and the extracted folder
            const folderPath: string = ('' + this.gateAddress).slice(0,-(zipEntries[0].entryName.length + 4));
            const unzippedFolderPath: string = ('' + this.gateAddress).slice(0,-4);
            // extract the zip
            zipHandler.extractAllTo(folderPath, true);
            const responseData: object[] = [];
            // parse the entries ...
            zipEntries.forEach((entry: IZipEntry) => {
                // Supporting different file types
                switch (ZIPGate.getFileType(entry.entryName)) {
                    case '.aml':
                        logger.info('There is a .aml file!');
                        break;
                    case '.xml':
                        logger.info('There is a .xml file!');
                        const xmlGate = this.xmlGateFactory.create();
                        xmlGate.initialize(folderPath + '/' + entry.entryName);
                        xmlGate.receive({source: folderPath + '/' + entry.entryName}, (response: Response) => {
                            if (response.constructor.name === this.responseVendor.buySuccessResponse().constructor.name) {
                                responseData.push(response.getContent());
                                // Calling the callback in the last loop cycle
                                if (entry == zipEntries[zipEntries.length-1]) {
                                    const zipGateResponse = this.responseVendor.buySuccessResponse();
                                    zipGateResponse.initialize('Success!', {data: responseData});
                                    // delete the extracted data
                                    rimraf(unzippedFolderPath, function () {
                                        callback(zipGateResponse);
                                    })
                                }
                            }
                        })
                        break;
                    default:
                        logger.warn('There is an unsupported file type. Ignoring...');
                        break;
                }
            })
        } else {
            callback(this.responseVendor.buyErrorResponse())
        }
    }

    constructor() {
        super();
        this.xmlGateFactory = new XMLGateFactory();
    }
}

/**
 * Gates allows connections to other realms. Use Gates to connect to different data sources like MTP or TripleStore with
 * a little API.
 */
export interface Gate {
    /**
     * Write data to the source via the gate.
     * @param instructions - A set of instructions, configuring the gate while sending.
     * @param callback - Concerning asynchronous behaviour, return data via a callback function.
     */
    send(instructions: object, callback: (response: Response) => void): void;
    /**
     * Asynchronous: Send a request to the source and receive theirs answer.
     * @param instructions - A set of instructions, configuring the gate while receiving.
     * @param callback - Concerning asynchronous behaviour, return data via a callback function.
     */
    receive(instructions: object, callback: (response: Response) => void): void;
    // TODO: What to do with open()/close() ???
    //open(): Response;
    //close(): Response;
    getGateAddress(): string | undefined;
    initialize(address: string): boolean;
}