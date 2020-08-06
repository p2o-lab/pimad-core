import {BaseDataItemFactory, BaseDataItem} from '../../src/ModuleAutomation/DataItem';
import {expect} from 'chai';
import {ErrorResponse} from '../../src/Backbone/Response';
import {OPCUANodeCommunication} from '../../src/ModuleAutomation/CommunicationInterfaceData';

describe('class: BaseDataItem', () => {
    let dataItem: BaseDataItem;
    beforeEach(function () {
        dataItem = new BaseDataItem();
    });
    it('method: getDataType()', () => {
        expect(typeof dataItem.getDataType()).is.equal(typeof new ErrorResponse());
    });

    it('method: getCommunicationInterfaceData()', () => {
        //TODO: OPCServerCommunication as option
        expect(dataItem.getCommunicationInterfaceData()).to.be.instanceOf(OPCUANodeCommunication)
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
        expect(typeof factory.create()).is.equal(typeof new BaseDataItem());
    });
});
