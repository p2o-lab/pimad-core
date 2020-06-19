import {BaseDataItemFactory, BaseDataItem} from './DataItem';
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';
import {OPCUANodeCommunication} from './CommunicationInterfaceData';

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
    it('method: initialize()', () => {
        expect(dataItem.initialize('', new OPCUANodeCommunication())).is.true;
        expect(dataItem.initialize('', new OPCUANodeCommunication())).is.false;
    });
});
describe('class: BaseDataItemFactory', () => {
    it('method: create()', () => {
        const factory = new BaseDataItemFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseDataItem());
    });
});
