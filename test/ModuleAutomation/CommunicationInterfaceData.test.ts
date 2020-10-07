import {expect} from 'chai';
import {CommunicationInterfaceData} from '../../src/ModuleAutomation';
import {
    CommunicationInterfaceDataEnum,
    CommunicationInterfaceDataVendor, OPCUANodeCommunication, OPCUAServerCommunication
} from '../../src/ModuleAutomation/CommunicationInterfaceData';
import {Backbone} from '../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

describe('class: OPCUAServerCommunication', () => {
    let communicationInterfaceData: CommunicationInterfaceData;
    beforeEach(function () {
        communicationInterfaceData = new CommunicationInterfaceDataVendor().buy(CommunicationInterfaceDataEnum.OPCUAServer);
    });
    describe('with initialization', () => {
        beforeEach(function () {
            communicationInterfaceData.initialize({
                dataSourceIdentifier: 'Test-DataSourceIdentifier',
                interfaceDescription: {macrocosm: 'Test-Server-URL', microcosm: 'Test-Port'},
                metaModelRef: 'Test-MetaModelRef',
                pimadIdentifier: 'Test-PiMAdIdentifier',
                name: 'Test-Server-Communication',
            });
        });
        it('method: getInterfaceDescription()', (done) => {
            communicationInterfaceData.getInterfaceDescription((response, interfaceDescription) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(interfaceDescription.macrocosm).is.equal('Test-Server-URL');
                expect(interfaceDescription.microcosm).is.equal('Test-Port');
                done();
            });
        });
    });
    describe('without initialization', () => {
        it('method: getInterfaceDescription()', (done) => {
            communicationInterfaceData.getInterfaceDescription((response, interfaceDescription) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(interfaceDescription.macrocosm).is.equal('macrocosm: undefined');
                expect(interfaceDescription.microcosm).is.equal('microcosm: undefined');
                done();
            });
        });
    })
    it('method: initialize()', () => {
        expect(communicationInterfaceData.initialize({
            dataSourceIdentifier: '',
            interfaceDescription: {macrocosm: '', microcosm: ''},
            metaModelRef: '',
            pimadIdentifier: '',
            name: '',
        })).is.true;
        expect(communicationInterfaceData.initialize({
            dataSourceIdentifier: '',
            interfaceDescription: {macrocosm: '', microcosm: ''},
            metaModelRef: '',
            pimadIdentifier: '',
            name: '',
        })).is.false;
    });
});

describe('class: OPCUANodeCommunication', () => {
    let communicationInterfaceData: CommunicationInterfaceData;
    beforeEach(function () {
        communicationInterfaceData = new CommunicationInterfaceDataVendor().buy(CommunicationInterfaceDataEnum.OPCUANode);
    });
    describe('without initialisation', () => {
        it('method: getNodeId', done => {
            (communicationInterfaceData as OPCUANodeCommunication).getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(JSON.stringify(nodeId)).is.equal(JSON.stringify({}));
                done();
            });
        });
    });
    describe('with initialisation', () => {
        beforeEach(function () {
            communicationInterfaceData.initialize({
                dataSourceIdentifier: 'Test-DataSourceIdentifier',
                interfaceDescription: {
                    macrocosm: '69',
                    microcosm: '23'
                },
                metaModelRef: 'Test-MetaModelRef',
                pimadIdentifier: 'Test-PiMAdIdentifier',
                name: 'Test-Name',
            });
        });
        it('method: getNodeId', done => {
            (communicationInterfaceData as OPCUANodeCommunication).getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                nodeId.getNodeId((response1, nodeIdAsString) => {
                    expect(response1.constructor.name).is.equal(successResponseAsString);
                    expect(nodeIdAsString).is.equal('ns=69;s=23');
                    done();
                });
            });
        });
    });
    it('method: initialize()', () => {
        expect(communicationInterfaceData.initialize({
            dataSourceIdentifier: '',
            interfaceDescription: {macrocosm: '', microcosm: ''},
            metaModelRef: '',
            pimadIdentifier: '',
            name: '',
        })).is.true;
        expect(communicationInterfaceData.initialize({
            dataSourceIdentifier: '',
            interfaceDescription: {macrocosm: '', microcosm: ''},
            metaModelRef: '',
            pimadIdentifier: '',
            name: '',
        })).is.false;
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
