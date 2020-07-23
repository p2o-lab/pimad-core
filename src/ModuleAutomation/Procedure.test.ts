import {BaseProcedureFactory, BaseProcedure} from './Procedure';
import {expect} from 'chai';
import {BaseParameter} from './Parameter';

describe('class: BaseProcedure', () => {
    let procedure: BaseProcedure;
    beforeEach(function () {
        procedure = new BaseProcedure();
    });
    it('method: getAllParameters()', () => {
        expect(typeof procedure.getAllParameters()).is.equal(typeof new BaseParameter());
    });
    it('method: getID()', () => {
        expect( typeof procedure.getIdentifier()).is.equal(typeof 0);
    });
    it('method: getName()', () => {
        expect(typeof procedure.getName()).is.equal(typeof '');
    });
    it('method: getDefault()', () => {
        expect(typeof procedure.getDefault()).is.equal(typeof true);
    });
    it('method: getSc()', () => {
        expect(typeof procedure.getSc()).is.equal(typeof true);
    });
    it('method: getParameter()', () => {
        expect(typeof procedure.getParameter('')).is.equal(typeof undefined);
    });
    it('method: initialize()', () => {
        expect(procedure.initialize(1,'',true,true,[])).is.true;
    });
});
describe('class: BaseProcedureFactory', () => {
    it('method: create()', () => {
        const factory = new BaseProcedureFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseProcedure());
    });
});
