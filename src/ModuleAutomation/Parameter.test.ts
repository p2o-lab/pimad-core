import {BaseParameterFactory} from './index';
import {expect} from 'chai';
import {OPCUANodeCommunication} from './CommunicationInterfaceData';
import {Parameter} from './index';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor();

describe('class: BaseParameter', () => {
    let parameter: Parameter;
    beforeEach(function () {
        parameter = new BaseParameterFactory().create();
    });
    it('method: getAllCommunicationInterfaceData()', () => {
        expect(typeof parameter.getAllCommunicationInterfaceData()).is.equal(typeof new OPCUANodeCommunication());
    });
    it('method: getName()', () => {
        expect(typeof parameter.getName()).is.equal(typeof '');
    });
    it('method: getInterfaceClass()', () => {
        expect(parameter.getInterfaceClass().constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
    });
    it('method: getCommunicationInterfaceData()', () => {
        expect(typeof parameter.getCommunicationInterfaceData('test')).is.equal(typeof []);
    });
    it('method: initialize()', () => {
        expect(parameter.initialize('',[],'')).is.true;
        expect(parameter.initialize('',[],'')).is.false;
    });
});
describe('class: BaseParameterFactory', () => {
    it('method: create()', () => {
        const factory = new BaseParameterFactory();
        expect(factory.create().constructor.name).is.equal('BaseParameter');
    });
});
