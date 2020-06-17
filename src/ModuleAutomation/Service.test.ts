import {BaseServiceFactory, BaseService} from './Service';
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';
import {BaseParameter} from './Parameter';

describe('class: BaseService', () => {
    let service: BaseService;
    beforeEach(function () {
        service = new BaseService();
    });
    it('method: getAllCommunicationInterfaceData()', () => {
        expect(typeof service.getAllCommunicationInterfaceData()).is.equal(typeof new ErrorResponse());
    });
    it('method: getAllProcedures()', () => {
        expect(typeof service.getAllProcedures()).is.equal(typeof new ErrorResponse());
    });
    it('method: getAllParameters()', () => {
        expect(typeof service.getAllParameters()).is.equal(typeof new BaseParameter());
    });
    it('method: getCommunicationInterfaceData()', () => {
        expect(typeof service.getCommunicationInterfaceData('')).is.equal(typeof new ErrorResponse());
    });
    it('method: getProcedure()', () => {
        expect(typeof service.getProcedure('')).is.equal(typeof new ErrorResponse());
    });
    it('method: getParameter()', () => {
        expect(typeof service.getParameter('')).is.equal(typeof new ErrorResponse());
    });
    it('method: getName()', () => {
        expect(typeof service.getName()).is.equal(typeof '');
    });
    it('method: initialize()', () => {
        expect(service.initialize([],'',[],[])).is.true;
    });
});
describe('class: BaseServiceFactory', () => {
    it('method: create()', () => {
        const factory = new BaseServiceFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseService());
    });
});
