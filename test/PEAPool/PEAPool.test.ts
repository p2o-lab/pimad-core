import {
    PEAPool,
    PEAPoolVendor
} from '../../src/PEAPool';
import {LastChainElementImporterFactory, MTPFreeze202001ImporterFactory} from '../../src/Converter/Importer/Importer'
import {expect} from 'chai';
import {Backbone} from '../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor()

describe('class: BasePEAPool', () => {
    const fImporter = new LastChainElementImporterFactory()
    const poolVendor = new PEAPoolVendor();
    let pool: PEAPool;
    beforeEach(() => {
        pool = poolVendor.buyDependencyPEAPool();
    })
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(pool.initialize(fImporter.create())).is.true;
        expect(pool.initialize(fImporter.create())).is.false;
    });
    describe('without initialization', () => {
        it('method: addPEA()', () => {
            pool.addPEA({source: ''}, (response) => {
                expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name)
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', (response) => {
                expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name)
            });
        });
        it('method: getPEA()', () => {
            pool.getPEA('', (response) => {
                expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name)
            });
        });
    });
    describe('with initialization', () => {
        beforeEach(() => {
            const mtpFreeze202001Importer = new MTPFreeze202001ImporterFactory().create();
            mtpFreeze202001Importer.initialize(fImporter.create());
            pool.initialize(mtpFreeze202001Importer);
        });
        it('method: addPEA()', (done) => {
            pool.getAllPEAs((response, peas) => {
                expect(peas.length).equals(0);
                pool.addPEA({source: 'test/Converter/PiMAd-core.0-0-1.aml'}, (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                    expect(response.getContent().constructor.name).is.equal('BasePEA');
                    //done();
                    pool.getAllPEAs((response, peas) => {
                        expect(peas.length).equals(1);
                        done()
                    });
                });
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', (response) => {
                expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name)
            });
        });
        describe('method: getPEA()', () => {
            beforeEach(() => {
                pool.addPEA({source: 'test/Converter/PiMAd-core.0-0-1.aml'}, (response) => {
                    //done();
                });
            });
            it('method: getPEA()', () => {
                pool.getPEA('', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name)
                });
            });
        })
    })
});

describe('class: PEAPoolVendor', () => {
    const vendor = new PEAPoolVendor();
    it('method: buyBasePEAPool()', () => {
        expect(vendor.buyDependencyPEAPool().constructor.name).is.equal('BasePEAPool')
    });
})
