import {
    PEAPool,
    PEAPoolVendor
} from '../../src/PEAPool';
import {Response} from '../../src/Backbone/Response'
import {LastChainElementImporterFactory, MTPFreeze202001ImporterFactory} from '../../src/Converter/Importer/Importer'
import {expect} from 'chai';
import {ErrorResponse, SuccessResponse} from '../../src/Backbone/Response';

describe('class: BasePEAStore', () => {
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
            pool.addPEA({source: ''}, (response: Response) => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', (response: Response) => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
        it('method: getPEA()', () => {
            pool.getPEA('', (response: Response) => {
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
            pool.addPEA({source: 'test/Converter/PiMAd-core.0-0-1.aml'}, (response: Response) => {
                expect(response.constructor.name).is.equal((new SuccessResponse().constructor.name));
                expect(response.getContent().constructor.name).is.equal('BasePEA')
                done();
            });
        });
        it('method: deletePEA()', () => {
            pool.deletePEA('', (response: Response) => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
        it('method: getPEA()', () => {
            pool.getPEA('', (response: Response) => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
            });
        });
    })
});

/*describe('class: BasePEAPoolFactory', () => {
    it('method: create()', () => {
        const factory = new PEAPoolVendor().buyDependencyPEAPool();
        expect(factory.create()).is.equal('BasePEAPool')
    });
})*/

describe('class: PEAStoreVendor', () => {
    const vendor = new PEAPoolVendor();
    it('method: buyBasePEAPool()', () => {
        expect(vendor.buyDependencyPEAPool().constructor.name).is.equal('BasePEAPool')
    });
})
