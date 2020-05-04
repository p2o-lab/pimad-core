import {WebPEAStore, CommandLinePEAStore, DependencyPEAStore, CommandLinePEAStoreFactory, DependencyPEAStoreFactory, WebPEAStoreFactory} from './PEAStore';
import {FLastChainElementImporter} from '../Converter/Importer'

import {expect} from 'chai';
import {ErrorResponse, SuccessResponse} from '../Backbone/Response';

describe('class: WebPEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    let store: WebPEAStore;
    beforeEach(function () {
        store = new WebPEAStore();
    });
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(store.initialize(fImporter.create())).is.true;
        expect(store.initialize(fImporter.create())).is.false;
    });
    it('method: start()', () => {
        expect(typeof (store.start())).is.equal(typeof new SuccessResponse());
        const response = store.start();
        expect(typeof response).is.equal(typeof new ErrorResponse());
    });
    it('method: stop()', () => {
        store.start();
        expect(typeof (store.stop())).is.equal(typeof new SuccessResponse());
        const response = store.stop();
        expect(typeof response).is.equal(typeof new ErrorResponse());
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

describe('class: CommandLinePEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    const store = new CommandLinePEAStore();
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(store.initialize(fImporter.create())).is.true;
        expect(store.initialize(fImporter.create())).is.false;
    });
    it('method: start()', () => {
        expect(typeof (store.start())).is.equal(typeof new SuccessResponse());
        const response = store.start();
        expect(typeof response).is.equal(typeof new ErrorResponse());
    });
    it('method: stop()', () => {
        store.start();
        expect(typeof (store.stop())).is.equal(typeof new SuccessResponse());
        const response = store.stop();
        expect(typeof response).is.equal(typeof new ErrorResponse());
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

describe('class: DependencyPEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    const store = new DependencyPEAStore();
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(store.initialize(fImporter.create())).is.true;
        expect(store.initialize(fImporter.create())).is.false;
    });
    it('method: start()', () => {
        expect(typeof (store.start())).is.equal(typeof new SuccessResponse());
        const response = store.start();
        expect(typeof response).is.equal(typeof new ErrorResponse());
    });
    it('method: stop()', () => {
        store.start();
        expect(typeof (store.stop())).is.equal(typeof new SuccessResponse());
        const response = store.stop();
        expect(typeof response).is.equal(typeof new ErrorResponse());
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

describe('class: CommandLinePEAStoreFactory', () => {
    it('method: create()', () => {
        const factory = new CommandLinePEAStoreFactory();
        expect(typeof factory.create()).is.equal(typeof new CommandLinePEAStore())
    });
})

describe('class: DependencyPEAStoreFactory', () => {
    it('method: create()', () => {
        const factory = new DependencyPEAStoreFactory();
        expect(typeof factory.create()).is.equal(typeof new DependencyPEAStore())
    });
})

describe('class: WebPEAStoreFactory', () => {
    it('method: create()', () => {
        const factory = new WebPEAStoreFactory();
        expect(typeof factory.create()).is.equal(typeof new WebPEAStore())
    });
})