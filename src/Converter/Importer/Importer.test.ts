import {expect} from 'chai';
import {LastChainElementImporterFactory, LastChainLinkImporter, MTPFreeze202001Importer} from './Importer';
import {ErrorResponse, Response, SuccessResponse} from '../../Backbone/Response';
import {BasicSemanticVersion, SemanticVersion} from '../../Backbone/SemanticVersion';
import {PEA} from '../../ModuleAutomation/PEA';
import {DataAssembly} from '../../ModuleAutomation/DataAssembly';
import {Service} from '../../ModuleAutomation/Service';
import {FEA} from '../../ModuleAutomation/FEA';

describe('class: LastChainElementImporter', () => {
    let importer: LastChainLinkImporter;
    beforeEach(() => {
        importer = new LastChainLinkImporter();
    });
    it('method: initialize()', () => {
        let localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter)).is.true;
        localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter)).is.false;
    });
    it('method: getMetaModelVersion(): SemanticVersion', () => {
        expect(typeof importer.getMetaModelVersion()).is.equal(typeof new BasicSemanticVersion())
    });
    it('method: convertFrom()', () => {
        importer.convertFrom({}, (response: Response) => {
            expect(typeof response).is.equal(typeof new ErrorResponse());
        });
    });
});

describe('class: MTPFreeze202001Importer', () => {
    let importer: MTPFreeze202001Importer;
    beforeEach(() => {
        importer = new MTPFreeze202001Importer();
    });
    describe('method: convertFrom()', () => {
        describe('with initialization' , () => {
            beforeEach(() => {
                const lastChainLinkImporter = new LastChainLinkImporter();
                importer.initialize(lastChainLinkImporter);
            });
            it('normal usage', (done) => {
                importer.convertFrom({source: 'test/Converter/PiMAd-core.0-0-1.aml'}, response => {
                    expect(response.constructor.name).is.equal((new SuccessResponse()).constructor.name);
                    const testResult = response.getContent() as PEA;
                    expect((testResult.getAllDataAssemblies().getContent() as {data: DataAssembly[]}).data.length).is.equal(8);
                    expect((testResult.getAllFEAs().getContent() as {data: FEA[]}).data.length).is.equal(0);
                    expect((testResult.getAllServices().getContent() as {data: Service[]}).data.length).is.equal(2);
                    expect(JSON.stringify(testResult.getDataModel().getContent() as {data: string})).is.equal(JSON.stringify({data: ''}));
                    expect(typeof (testResult.getDataModelVersion().getContent() as SemanticVersion)).is.equal(typeof new BasicSemanticVersion());
                    expect(JSON.stringify(testResult.getName().getContent() as {data: string})).is.equal(JSON.stringify({data: ''}));
                    done();
                })
            });
            it('unknown source', (done) => {
                const lastChainLinkImporter = new LastChainLinkImporter();
                importer.initialize(lastChainLinkImporter);
                importer.convertFrom({source: ''}, response => {
                    expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                    done();
                })
            });
            describe('AML', () => {
                it('fake CAEX', (done) => {
                    const lastChainLinkImporter = new LastChainLinkImporter();
                    importer.initialize(lastChainLinkImporter);
                    const source = 'test/Converter/test.aml';
                    importer.convertFrom({source: source}, response => {
                        expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                        expect(response.getMessage()).is.equal('The File at ' + source + ' is not valid CAEX!');
                        done();
                    })
                });
            });
            describe('MTP', () => {
                it('MTP-AML', (done) => {
                    const lastChainLinkImporter = new LastChainLinkImporter();
                    importer.initialize(lastChainLinkImporter);
                    importer.convertFrom({source: 'test/Converter/test-aml.mtp'}, response => {
                        expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                        done();
                    })
                });
                it('MTP-XML', (done) => {
                    const lastChainLinkImporter = new LastChainLinkImporter();
                    importer.initialize(lastChainLinkImporter);
                    importer.convertFrom({source: 'test/Converter/test-xml.mtp'}, response => {
                        expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                        done();
                    })
                });
            });
            it('XML', (done) => {
                const lastChainLinkImporter = new LastChainLinkImporter();
                importer.initialize(lastChainLinkImporter);
                importer.convertFrom({source: 'test/Converter/test.xml'}, response => {
                    expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                    done();
                })
            });
            describe('ZIP', () => {
                it('ZIP-AML', (done) => {
                    const lastChainLinkImporter = new LastChainLinkImporter();
                    importer.initialize(lastChainLinkImporter);
                    importer.convertFrom({source: 'test/Converter/test-aml.zip'}, response => {
                        expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                        done();
                    })
                });
                it('ZIP-XML', (done) => {
                    const lastChainLinkImporter = new LastChainLinkImporter();
                    importer.initialize(lastChainLinkImporter);
                    importer.convertFrom({source: 'test/Converter/test-xml.zip'}, response => {
                        expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                        done();
                    })
                });
            })
        });
        it('without initialization', (done) => {
            importer.convertFrom({source: ''}, response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                expect(response.getMessage()).is.equal('The Importer is not initialized yet! Aborting ... ');
                done()
            })
        })
    });
    describe('method: initialize()', () => {
        it('base functionality', () => {
            let lastChainLinkImporter = new LastChainLinkImporter();
            expect(importer.initialize(lastChainLinkImporter)).is.true;
            lastChainLinkImporter = new LastChainLinkImporter();
            expect(importer.initialize(lastChainLinkImporter)).is.false;
        })
    });
});

describe('class: LastChainElementImporterFactory', () => {
    const factory = new LastChainElementImporterFactory();
    it('method: create', () => {
        expect(typeof factory.create()).is.equal(typeof new LastChainLinkImporter());
    });
});
