import {BaseDataItemFactory, BaseDataItem} from './DataItem';
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';

describe('class: BaseDataItem', () => {
    let dataItem: BaseDataItem;
    beforeEach(function () {
        dataItem = new BaseDataItem();
    });
    it('method: getDataType()', () => {
        expect(typeof dataItem.getDataType()).is.equal(typeof new ErrorResponse());
    });

    it('method: getCommunicationInterfaceData()', () => {
        expect(typeof dataItem.getCommunicationInterfaceData('test')).is.equal(typeof new ErrorResponse());
    });
});
describe('class: BaseDataItemFactory', () => {
    it('method: create()', () => {
        const factory = new BaseDataItemFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseDataItem());
    });
});
