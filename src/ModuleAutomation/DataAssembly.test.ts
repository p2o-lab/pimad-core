import {BaseDataAssemblyFactory, BaseDataAssembly} from './DataAssembly';
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: BaseDataAssembly', () => {
    let dataAssembly: BaseDataAssembly;
    beforeEach(function () {
        dataAssembly = new BaseDataAssembly();
    });
    it('method: getInterfaceClass()', () => {
        expect(typeof dataAssembly.getInterfaceClass()).is.equal(typeof new ErrorResponse());
    });
    it('method: getTagDescription()', () => {
        expect(typeof dataAssembly.getTagDescription()).is.equal(typeof '');
    });
    it('method: getTagName()', () => {
        expect(typeof dataAssembly.getTagName()).is.equal(typeof '');
    });
    it('method: getCommunication()', () => {
        expect(typeof dataAssembly.getCommunication()).is.equal(typeof new ErrorResponse());
    });
    it('method: initialize()', () => {
        expect(dataAssembly.initialize()).is.true;
    });
});
describe('class: BaseDataAssemblyFactory', () => {
    it('method: create()', () => {
        const factory = new BaseDataAssemblyFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseDataAssembly());
    });
});
