import {expect} from 'chai';
import {ErrorResponse} from '../../src/Backbone';
import {BaseDataItemFactory, DataItem} from '../../src/ModuleAutomation';
import {OPCUANodeCommunication} from '../../src/ModuleAutomation/CommunicationInterfaceData';

// TODO > Test-cases are crap
describe('class: BaseDataItem', () => {
    let dataItem: DataItem;
    beforeEach(function () {
        dataItem = new BaseDataItemFactory().create();
    });
    it('method: getDataType()', () => {
        expect(typeof dataItem.getDataType()).is.equal(typeof new ErrorResponse());
    });
    it('method: getCommunicationInterfaceData()', () => {
        //TODO: OPCServerCommunication as option
        expect(dataItem.getCommunicationInterfaceData().constructor.name).is.equal('OPCUANodeCommunication')
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
