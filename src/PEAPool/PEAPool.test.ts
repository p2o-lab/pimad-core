import {
    BasePEAPool,
    BasePEAPoolFactory,
    PEAPoolVendor
} from './PEAPool';
import {LastChainElementImporterFactory} from '../Converter/Importer/Importer'

import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: BasePEAStore', () => {
    const fImporter = new LastChainElementImporterFactory()
    const store = new BasePEAPool();
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(store.initialize(fImporter.create())).is.true;
        expect(store.initialize(fImporter.create())).is.false;
    });
    it('method: addPEA(any: object)', () => {
        expect(typeof store.addPEA({})).is.equal(typeof new ErrorResponse())
    })
    it('method: deletePEA(tag: string)', () => {
        expect(typeof store.deletePEA('')).is.equal(typeof new ErrorResponse())
    })
    it('method: getPEA(tag: string)', () => {
        store.getPEA('', response => {
            expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name)
        })
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
