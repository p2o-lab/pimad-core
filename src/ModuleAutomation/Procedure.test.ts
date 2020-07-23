import {BaseProcedureFactory, BaseProcedure} from './Procedure';
import {expect} from 'chai';
import {BaseParameter} from './Parameter';
import {DataAssembly} from './DataAssembly';

describe('class: BaseProcedure', () => {
    let procedure: BaseProcedure;
    beforeEach(function () {
        procedure = new BaseProcedure();
    });
    it('method: getAllAttributes()', () => {
        expect(JSON.stringify(procedure.getAllAttributes())).is.equal(JSON.stringify([]));
    });
    it('method: getAllParameters()', () => {
        expect(typeof procedure.getAllParameters()).is.equal(typeof new BaseParameter());
    });
    it('method: getIdentifier()', () => {
        expect(procedure.getIdentifier()).is.equal('identifier: not-initialized');
    });
    it('method: getName()', () => {
        expect(procedure.getName()).is.equal('name: not-initialized');
    });
    it('method: getMetaModelRef()', () => {
        expect(procedure.getMetaModelRef()).is.equal('metaModelRef: not-initialized');
    });
    it('method: getParameter()', () => {
        //expect(typeof procedure.getParameter('')).is.equal(typeof undefined);
    });
    it('method: initialize()', () => {
        expect(procedure.initialize({} as DataAssembly,'','','',[], [])).is.true;
        expect(procedure.initialize({} as DataAssembly,'','','',[], [])).is.false;
    });
});
describe('class: BaseProcedureFactory', () => {
    it('method: create()', () => {
        const factory = new BaseProcedureFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseProcedure());
    });
});
