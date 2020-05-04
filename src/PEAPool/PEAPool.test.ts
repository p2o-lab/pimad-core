import {WebPEAPool, CommandLinePEAPool, DependencyPEAPool, CommandLinePEAPoolFactory, DependencyPEAPoolFactory, WebPEAPoolFactory} from './PEAPool';
import {FLastChainElementImporter} from '../Converter/Importer'

import {expect} from 'chai';
import {ErrorResponse, SuccessResponse} from '../Backbone/Response';

describe('class: WebPEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    let store: WebPEAPool;
    beforeEach(function () {
        store = new WebPEAPool();
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
    const store = new CommandLinePEAPool();
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
    const store = new DependencyPEAPool();
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
        const factory = new CommandLinePEAPoolFactory();
        expect(typeof factory.create()).is.equal(typeof new CommandLinePEAPool())
    });
})

describe('class: DependencyPEAStoreFactory', () => {
    it('method: create()', () => {
        const factory = new DependencyPEAPoolFactory();
        expect(typeof factory.create()).is.equal(typeof new DependencyPEAPool())
    });
})

describe('class: WebPEAStoreFactory', () => {
    it('method: create()', () => {
        const factory = new WebPEAPoolFactory();
        expect(typeof factory.create()).is.equal(typeof new WebPEAPool())
    });
})