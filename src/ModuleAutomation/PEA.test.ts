import {BasePEAFactory, BasePEA} from './PEA'
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: BasePEA', () => {
    let pea: BasePEA;
    beforeEach(function () {
        pea = new BasePEA();
    });
    it('method: getAllActuators()', () => {
        expect(typeof pea.getAllActuators()).is.equal(typeof new ErrorResponse())
    });
    it('method: getAllFEAs()', () => {
        expect(typeof pea.getAllFEAs()).is.equal(typeof new ErrorResponse())
    });
    it('method: getAllDataAssemblies()', () => {
        expect(typeof pea.getAllDataAssemblies()).is.equal(typeof new ErrorResponse())
    });
    it('method: getAllSensors()', () => {
        expect(typeof pea.getAllSensors()).is.equal(typeof new ErrorResponse())
    });
    it('method: getAllServices()', () => {
        expect(typeof pea.getAllServices()).is.equal(typeof new ErrorResponse())
    });
    it('method: getActuator(tag: string)', () => {
        const tag = 'Test-Tag';
        expect(typeof pea.getActuator(tag)).is.equal(typeof new ErrorResponse())
    });
    it('method: getFEA(tag: string)', () => {
        const tag = 'Test-Tag';
        expect(typeof pea.getFEA(tag)).is.equal(typeof new ErrorResponse())
    });
    it('method: getDataAssembly(tag: string)', () => {
        const tag = 'Test-Tag';
        expect(typeof pea.getDataAssembly(tag)).is.equal(typeof new ErrorResponse())
    });
    it('method: getSensor(tag: string)', () => {
        const tag = 'Test-Tag';
        expect(typeof pea.getSensor(tag)).is.equal(typeof new ErrorResponse())
    });
    it('method: getService(tag: string)', () => {
        const tag = 'Test-Tag';
        expect(typeof pea.getService(tag)).is.equal(typeof new ErrorResponse())
    });
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(pea.initialize()).is.true;
        expect(pea.initialize()).is.false;
    });
})

describe('class: BasePEAFactory', () => {
    it('method: create()', () => {
        const factory = new BasePEAFactory();
        expect(typeof factory.create()).is.equal(typeof new BasePEA())
    });
})