import {expect} from 'chai';
import {BaseDataItemFactory, CommunicationInterfaceDataVendor, DataItem} from '../../src/ModuleAutomation';
import {
    CommunicationInterfaceDataEnum,
    OPCUANodeCommunication
} from '../../src/ModuleAutomation/CommunicationInterfaceData';
import {Backbone} from '../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor()

// TODO > Test-cases are crap
describe('class: BaseDataItem', () => {
    let dataItem: DataItem;
    beforeEach(function () {
        dataItem = new BaseDataItemFactory().create();
    });
    describe('with initialization', () => {
        beforeEach(() => {
            dataItem.initialize('Test-DataItem', new CommunicationInterfaceDataVendor().buy(CommunicationInterfaceDataEnum.OPCUANode), 'Test-ID', 'Test-MetaModelReference');
        });
        it('method: getCommunicationInterfaceData()', () => {
            //TODO: OPCServerCommunication as option
            expect(dataItem.getCommunicationInterfaceData().constructor.name).is.equal('OPCUANodeCommunication')
        });
    })
    it('method: getDataType()', () => {
        expect(dataItem.getDataType().constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
    });
    describe('method: getIdentifier()', () => {
        it('test case: standard usage', () => {
            expect(dataItem.getIdentifier()).is.equal('');
        });
    });
    describe('method: getMetaModelRef()', () => {
        it('test case: standard usage', () => {
            expect(dataItem.getMetaModelRef()).is.equal('');
        });
    });
    describe('method: initialize()', () => {
        it('test case: init twice', () => {
            expect(dataItem.initialize('', new OPCUANodeCommunication(), '', '')).is.true;
            expect(dataItem.initialize('', new OPCUANodeCommunication(), '', '')).is.false;
        });
        it('test case: standard usage', () => {
            expect(dataItem.initialize('Test-Name', new OPCUANodeCommunication(), 'Test-Identifier', 'Test-MetaModelRef')).is.true;

        });
    })
});

describe('class: BaseDataItemFactory', () => {
    it('method: create()', () => {
        const factory = new BaseDataItemFactory();
        expect(factory.create().constructor.name).is.equal('BaseDataItem');
    });
});
