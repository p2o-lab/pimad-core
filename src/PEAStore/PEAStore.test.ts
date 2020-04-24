import {WebPEAStore, CommandLinePEAStore, DependencyPEAStore} from './PEAStore';
import {FLastChainElementImporter} from '../Converter/Importer'

import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: WebPEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    let store = new WebPEAStore();
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

describe('class: CommandLinePEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    let store = new CommandLinePEAStore();
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

describe('class: DependencyPEAStore', () => {
    const fImporter = new FLastChainElementImporter()
    let store = new DependencyPEAStore();
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