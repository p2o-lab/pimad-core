import {
    PEAPool,
    PEAPoolVendor
} from './index';
import {LastChainElementImporterFactory, MTPFreeze202001ImporterFactory} from '../Converter/Importer/Importer';
import {expect} from 'chai';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import {PEAModel} from "../ModuleAutomation";
import {BasicDataAssembly} from "../ModuleAutomation/DataAssemblyModel";
import {OPCUANodeCommunication} from "../ModuleAutomation/CommunicationInterfaceData";

const responseVendor = new PiMAdResponseVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

describe('class: BasePEAPool', () => {
    const fImporter = new LastChainElementImporterFactory();
    const poolVendor = new PEAPoolVendor();
    let pool: PEAPool;
    beforeEach(() => {
        pool = poolVendor.buyDependencyPEAPool();
    });
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(pool.initialize(fImporter.create())).is.true;
        expect(pool.initialize(fImporter.create())).is.false;
    });
    it('method: initializeMTPFreeze202001Importer()', () => {
        expect(pool.initializeMTPFreeze202001Importer()).is.true;
        expect(pool.initializeMTPFreeze202001Importer()).is.false;
    });
    describe('without initialization', () => {
        it('method: addPEA()', () => {
            pool.addPEA({source: ''}, (response) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', (response) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('method: getPEA()', () => {
            pool.getPEA('', (response) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('method: getAllPEAs()', () => {
            pool.getAllPEAs((response) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
    });
    describe('with initialization', () => {
        beforeEach(() => {
            const mtpFreeze202001Importer = new MTPFreeze202001ImporterFactory().create();
            mtpFreeze202001Importer.initialize(fImporter.create());
            pool.initialize(mtpFreeze202001Importer);
        });
        // test adding multiple Modules
        describe('method: addPEA()', () => {
            it('regular usage', (done) => {
                pool.getAllPEAs((response) => {
                    //list should be empty
                    expect((response.getContent() as PEAModel[]).length).equals(0);
                    pool.addPEA( {source: 'test/Converter/testpea_new.zip'}, (response) => {
                        expect(response.constructor.name).is.equal(successResponseAsString);
                        expect(response.getContent().constructor.name).is.equal('BasePEA');
                        pool.getAllPEAs((response) => {
                            // list should have one PEAModel added to it
                            expect((response.getContent() as PEAModel[]).length).equals(1);
                            // testing deletePEA()
                            pool.deletePEA((response.getContent() as PEAModel[])[0].getPiMAdIdentifier(), (response) => {
                                expect(response.constructor.name).is.equal(successResponseAsString);
                                pool.getAllPEAs((response) => {
                                    //list should be empty, after deleting PEAModel
                                    expect((response.getContent() as PEAModel[]).length).equals(0);
                                    done()
                                });
                            });
                        });
                    });
                });
            });

            it('import fails', done => {
                pool.addPEA({source: 'test/Converter/test.aml'}, (response) => {
                    expect(response.constructor.name).is.equal(errorResponseAsString);
                    pool.getAllPEAs((response) => {
                        expect((response.getContent() as PEAModel[]).length).equals(0);
                        done();
                    });
                });
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', (response) => {
                // we except an error, because PEAModel can not be found with empty/wrong identifier
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        describe('method: getPEA()', () => {
            it('method: getPEA()', done => {
                pool.addPEA({source: 'test/Converter/PiMAd-core.0-0-1.mtp'}, (response) => {
                    pool.getAllPEAs(response1 => {
                        const pimadIdentifier = (response1.getContent() as PEAModel[])[0].getPiMAdIdentifier()
                        pool.getPEA(pimadIdentifier, (response) => {
                            expect(response.constructor.name).is.equal(successResponseAsString);
                            done();
                        });
                    })
                });
            });
        });
    });
});

describe('class: PEAPoolVendor', () => {
    const vendor = new PEAPoolVendor();
    it('method: buyBasePEAPool()', () => {
        expect(vendor.buyDependencyPEAPool().constructor.name).is.equal('BasePEAPool');
    });
});
