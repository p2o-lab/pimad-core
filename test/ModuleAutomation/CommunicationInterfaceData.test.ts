import {OPCUANodeCommunication, OPCUAServerCommunication, OPCUANodeCommunicationFactory,OPCUAServerCommunicationFactory} from '../../src/ModuleAutomation/CommunicationInterfaceData';
import {expect} from 'chai';
import {NodeId} from '../../src/ModuleAutomation';

describe('class: OPCUAServerCommunication', () => {
    let opcServerCommunication: OPCUAServerCommunication;
    beforeEach(function () {
        opcServerCommunication = new OPCUAServerCommunication();
    });
    it('method: getDescription()', () => {
        expect(typeof opcServerCommunication.getDescription()).is.equal(typeof {name:'',serverURL:''});
    });
    it('method: initialize()', () => {
        expect(opcServerCommunication.initialize({name: '', serverURL: ''})).is.true;
        expect(opcServerCommunication.initialize({name: '', serverURL: ''})).is.false;
    });
});
describe('class: OPCUAServerCommunicationFactory', () => {
    it('method: create()', () => {
        const factory = new OPCUAServerCommunicationFactory();
        expect(typeof factory.create()).is.equal(typeof new OPCUAServerCommunication());
    });
});
describe('class: OPCUANodeCommunication', () => {
    let opcNodeCommunication: OPCUANodeCommunication;
    beforeEach(function () {
        opcNodeCommunication = new OPCUANodeCommunication();
    });
    it('method: getDescription()', () => {
        expect(typeof opcNodeCommunication.getDescription()).is.equal(typeof {name:'',serverURL:''});
    });
    it('method: initialize()', () => {
        expect(opcNodeCommunication.initialize({name:'', namespaceIndex:'',nodeId: {} as NodeId, dataType: ''})).is.true;
        expect(opcNodeCommunication.initialize({name:'', namespaceIndex:'',nodeId: {} as NodeId, dataType: ''})).is.false;
    });
});
describe('class: OPCUANodeCommunicationFactory', () => {
    it('method: create()', () => {
        const factory = new OPCUANodeCommunicationFactory();
        expect(typeof factory.create()).is.equal(typeof new OPCUANodeCommunication());
    });
});
