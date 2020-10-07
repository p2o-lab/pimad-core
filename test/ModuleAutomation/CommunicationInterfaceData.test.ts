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
            })
        });
        it('method: getInterfaceData()', (done) => {
            communicationInterfaceData.getInterfaceDescription((response, interfaceDescription) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(interfaceDescription.macrocosm).is.equal('Test-Server-URL');
                expect(interfaceDescription.microcosm).is.equal('Test-Port');
                done();
            });
        });
        it('method: getName()', (done) => {
            communicationInterfaceData.getName((response, name) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(name).is.equal('Test-Server-Communication');
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
        it('method: getName()', (done) => {
            communicationInterfaceData.getName((response, name) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(name).is.equal('name: undefined');
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
        it('method: getInterfaceDescription()', (done) => {
            communicationInterfaceData.getInterfaceDescription((response, interfaceDescription) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(interfaceDescription.macrocosm).is.equal('macrocosm: undefined');
                expect(interfaceDescription.microcosm).is.equal('microcosm: undefined');
                done();
            });
        });
        it('method: getName()', (done) => {
            communicationInterfaceData.getName((response, name) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(name).is.equal('name: undefined');
                done();
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
