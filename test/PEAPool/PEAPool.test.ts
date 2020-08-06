import {
    BasePEAPool,
    BasePEAPoolFactory,
    PEAPoolVendor
} from '../../src/PEAPool';
import {LastChainElementImporterFactory, MTPFreeze202001ImporterFactory} from '../../src/Converter/Importer/Importer'

import {expect} from 'chai';
import {ErrorResponse, SuccessResponse} from '../../src/Backbone/Response';

describe('class: BasePEAStore', () => {
    const fImporter = new LastChainElementImporterFactory()
    let pool = new BasePEAPool();
    beforeEach(() => {
        pool = new BasePEAPool();
    })
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(pool.initialize(fImporter.create())).is.true;
        expect(pool.initialize(fImporter.create())).is.false;
    });
    describe('without initialization', () => {
        it('method: addPEA()', () => {
            pool.addPEA({source: ''}, response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
        it('method: getPEA()', () => {
            pool.getPEA('', response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
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
            pool.addPEA({source: 'test/Converter/PiMAd-core.0-0-1.aml'}, response => {
                expect(response.constructor.name).is.equal((new SuccessResponse().constructor.name));
                expect(response.getContent().constructor.name).is.equal('BasePEA')
                done();
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
        it('method: getPEA()', () => {
            pool.getPEA('', response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
    })
});

describe('class: BasePEAPoolFactory', () => {
    it('method: create()', () => {
        const factory = new BasePEAPoolFactory();
        expect(typeof factory.create()).is.equal(typeof new BasePEAPool())
    });
})

describe('class: PEAStoreVendor', () => {
    const vendor = new PEAPoolVendor();
    it('method: buyBasePEAPool()', () => {
        expect(typeof vendor.buyDependencyPEAPool()).is.equal(typeof new BasePEAPool())
    });
})
