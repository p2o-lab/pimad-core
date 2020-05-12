import {BaseParameterFactory, BaseParameter} from './Parameter';
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: BaseParameter', () => {
    let parameter: BaseParameter;
    beforeEach(function () {
        parameter = new BaseParameter();
    });
    it('method: getAllCommunicationInterfaceData()', () => {
        expect(typeof parameter.getAllCommunicationInterfaceData()).is.equal(typeof new ErrorResponse());
    });
    it('method: getName()', () => {
        expect(typeof parameter.getName()).is.equal(typeof '');
    });
    it('method: getInterfaceClass()', () => {
        expect(typeof parameter.getInterfaceClass()).is.equal(typeof new ErrorResponse());
    });
    it('method: getCommunicationInterfaceData()', () => {
        expect(typeof parameter.getCommunicationInterfaceData('test')).is.equal(typeof new ErrorResponse());
    });
    it('method: initialize()', () => {
        expect(parameter.initialize()).is.true;
    });
});
describe('class: BaseParameterFactory', () => {
    it('method: create()', () => {
        const factory = new BaseParameterFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseParameter());
    });
});
