import {expect} from 'chai';
import {CommunicationInterfaceData, NodeId} from '../../src/ModuleAutomation';
import {
    CommunicationInterfaceDataEnum,
    CommunicationInterfaceDataVendor, OPCUANodeCommunication, OPCUAServerCommunication
} from '../../src/ModuleAutomation/CommunicationInterfaceData';
import {Backbone} from '../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor();

describe('class: OPCUAServerCommunication', () => {
    let opcServerCommunication: CommunicationInterfaceData;
    beforeEach(function () {
        opcServerCommunication = new CommunicationInterfaceDataVendor().buy(CommunicationInterfaceDataEnum.OPCUAServer);
    });
    describe('with initialization', () => {
        beforeEach(function () {
            opcServerCommunication.initialize({name: 'Test-Server-Communication', serverURL: 'Test-Server-URL'})
        });
        it('method: getInterfaceData()', () => {
            const content = opcServerCommunication.getInterfaceData().getContent() as {name: string; serverURL: string};
            expect(content.name).is.equal('Test-Server-Communication');
            expect(content.serverURL).is.equal('Test-Server-URL');
        });
        it('method: getName()', () => {
            const content = opcServerCommunication.getName().getContent() as {data: string};
            expect(content.data).is.equal('Test-Server-Communication');
        });
    });
    describe('without initialization', () => {
        it('method: getInterfaceData()', () => {
            expect(opcServerCommunication.getInterfaceData().constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
        });
        it('method: getName()', () => {
            expect(opcServerCommunication.getName().constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
        });
    })
    it('method: initialize()', () => {
        expect(opcServerCommunication.initialize({name: '', serverURL: ''})).is.true;
        expect(opcServerCommunication.initialize({name: '', serverURL: ''})).is.false;
    });
});

describe('class: OPCUANodeCommunication', () => {
    let opcNodeCommunication: CommunicationInterfaceData;
    beforeEach(function () {
        opcNodeCommunication = new CommunicationInterfaceDataVendor().buy(CommunicationInterfaceDataEnum.OPCUANode);
    });
    it('method: getDescription()', () => {
        expect(typeof opcNodeCommunication.getInterfaceData()).is.equal(typeof {name:'',serverURL:''});
    });
    it('method: initialize()', () => {
        expect(opcNodeCommunication.initialize({name:'', namespaceIndex:'',nodeId: {} as NodeId, dataType: ''})).is.true;
        expect(opcNodeCommunication.initialize({name:'', namespaceIndex:'',nodeId: {} as NodeId, dataType: ''})).is.false;
    });
});

describe('class: CommunicationInterfaceDataVendor', () => {
    let vendor: CommunicationInterfaceDataVendor;
    beforeEach( () => {
        vendor = new CommunicationInterfaceDataVendor();
    });
    it('method: buy > OPCUANode ', () => {
        expect(vendor.buy(CommunicationInterfaceDataEnum.OPCUANode).constructor.name).is.equal(new OPCUANodeCommunication().constructor.name)
    });
    it('method: buy > OPCUAServer', () => {
        expect(vendor.buy(CommunicationInterfaceDataEnum.OPCUAServer).constructor.name).is.equal(new OPCUAServerCommunication().constructor.name)
    });
});
