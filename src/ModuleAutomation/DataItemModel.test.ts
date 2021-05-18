import {expect} from 'chai';
import {BaseDataItemFactory, CommunicationInterfaceDataVendor, DataItemModel} from './index';
import {
    CommunicationInterfaceDataEnum,
    OPCUANodeCommunication
} from './CommunicationInterfaceData';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

// TODO > Test-cases are crap
describe('class: BaseDataItem', () => {
    let dataItem: DataItemModel;
    beforeEach(function () {
        dataItem = new BaseDataItemFactory().create();
    });
    describe('with initialization', () => {
        beforeEach(() => {
            dataItem.initialize({
                ciData: new CommunicationInterfaceDataVendor().buy(CommunicationInterfaceDataEnum.OPCUANode),
                dataType: 'Test-DataType',
                dataSourceIdentifier: 'Test-DataSourceIdentifier',
                metaModelRef: 'Test-MetaModelReference',
                name: 'Test-DataItem',
                pimadIdentifier: 'Test-PiMAdIdentifier'
            });
        });
        it('method: getCommunicationInterfaceData()', (done) => {
            dataItem.getCommunicationInterfaceData((response, communicationInterfaceData) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(communicationInterfaceData.constructor.name).is.equal('OPCUANodeCommunication');
                done();
            });
        });
        it('method: getDataType()', (done) => {
            dataItem.getDataType((response, dataType) =>{
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(dataType).is.equal('Test-DataType');
                done();
            });
        });
    });
    describe('without initialization', () => {
        it('method: getCommunicationInterfaceData()', (done) => {
            dataItem.getCommunicationInterfaceData((response, communicationInterfaceData) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                done();
            });
        });
        it('method: getDataType()', (done) => {
            dataItem.getDataType((response, dataType) =>{
                expect(response.constructor.name).is.equal(errorResponseAsString);
                done();
            });
        });
    });
    describe('method: initialize()', () => {
        it('test case: init twice', () => {
            expect(dataItem.initialize({
                ciData: {} as OPCUANodeCommunication,
                dataType: '',
                dataSourceIdentifier: '',
                metaModelRef: '',
                name: '',
                pimadIdentifier: ''
            })).is.true;
            expect(dataItem.initialize({
                ciData: {} as OPCUANodeCommunication,
                dataType: '',
                dataSourceIdentifier: '',
                metaModelRef: '',
                name: '',
                pimadIdentifier: ''
            })).is.false;
        });
        it('test case: standard usage', () => {
            expect((dataItem.initialize({
                ciData: {} as OPCUANodeCommunication,
                dataType: '',
                dataSourceIdentifier: '',
                metaModelRef: '',
                name: '',
                pimadIdentifier: ''
            }))).is.true;

        });
    });
});

describe('class: BaseDataItemFactory', () => {
    it('method: create()', () => {
        const factory = new BaseDataItemFactory();
        expect(factory.create().constructor.name).is.equal('BaseDataItem');
    });
});
