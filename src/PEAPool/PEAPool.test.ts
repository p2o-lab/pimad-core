import {
    BasePEAPool,
    BasePEAPoolFactory,
    PEAPoolVendor
} from './PEAPool';
import {FLastChainElementImporter} from '../Converter/Importer'

import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: BasePEAStore', () => {
    const fImporter = new FLastChainElementImporter()
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
        expect(typeof store.getPEA('')).is.equal(typeof new ErrorResponse())
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
