import {BaseParameterFactory} from '../../src/ModuleAutomation';
import {expect} from 'chai';
import {ErrorResponse} from '../../src/Backbone';
import {OPCUANodeCommunication} from '../../src/ModuleAutomation/CommunicationInterfaceData';
import {Parameter} from '../../src/ModuleAutomation';

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
        expect(typeof parameter.getInterfaceClass()).is.equal(typeof new ErrorResponse());
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
