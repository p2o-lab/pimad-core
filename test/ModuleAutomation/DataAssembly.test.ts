import {expect} from 'chai';
import {Backbone} from '../../src/Backbone';
import {BaseDataItemFactory, CommunicationInterfaceData, ModuleAutomation} from '../../src/ModuleAutomation';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import DataAssembly = ModuleAutomation.DataAssembly;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;
import {BasicDataAssembly} from '../../src/ModuleAutomation/DataAssembly';

const responseVendor = new PiMAdResponseVendor();
const dataAssemblyVendor = new DataAssemblyVendor();

describe('class: BaseDataAssembly', () => {
    let dataAssembly: DataAssembly;
    const dataItemFactory = new BaseDataItemFactory();
    beforeEach(function () {
        dataAssembly = dataAssemblyVendor.buy(DataAssemblyType.BASIC);
    });
    describe('with initialization', () => {
        beforeEach(() => {
            const dataItemOne = dataItemFactory.create();
            dataItemOne.initialize('DataItemOne', {} as CommunicationInterfaceData, '', '');
            const dataItemTwo = dataItemFactory.create();
            dataItemTwo.initialize('DataItemTwo', {} as CommunicationInterfaceData, '', '');
            const dataItemThree = dataItemFactory.create();
            dataItemThree.initialize('DataItemThree', {} as CommunicationInterfaceData, '', '');

            dataAssembly.initialize({
                tag: 'Test-DataAssembly',
                description: 'It is a test!',
                dataItems: [dataItemOne, dataItemTwo, dataItemThree],
                identifier: 'Test-Identifier',
                metaModelRef: 'Test-MetaModelRef'
            });
        });
        it('method: getAllDataItems', () => {
            dataAssembly.getAllDataItems((response, dataItems) => {
                expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                expect(dataItems.length).is.equal(3);
            })
        });
        describe('method: getDataItem', () => {
            it('DataItem exists', () => {
                dataAssembly.getDataItem('DataItemTwo', (response, dataItem) => {
                    expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                    expect(dataItem.getName()).is.equal('DataItemTwo');
                });
            });
            it('DataItem does not exist', () => {
                dataAssembly.getDataItem('DataItemFour', (response, dataItem) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                });
            });
        });
    });
    describe('without initialization', () => {
        it('method: getAllDataItems', () => {
            dataAssembly.getAllDataItems((response, dataItems) => {
                expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
            })
        });
        it('method: getDataItem', () => {
            dataAssembly.getDataItem('Test-DataItem',(response, dataItems) => {
                expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
            })
        });
    });
    it('method: getInterfaceClass()', () => {
        expect(dataAssembly.getInterfaceClass().constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
    });
    it('method: getTagDescription()', () => {
        expect(typeof dataAssembly.getTagDescription()).is.equal(typeof '');
    });
    it('method: getTagName()', () => {
        expect(typeof dataAssembly.getTagName()).is.equal(typeof '');
    });
    it('method: getCommunication()', () => {
        expect(dataAssembly.getCommunication().constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
    });
    it('method: getIdentifier()', () => {
        expect(dataAssembly.getIdentifier()).is.equal('');
    })
    it('method: getMetaModelRef()', () => {
        expect(dataAssembly.getMetaModelRef()).is.equal('');
    })
    it('method: initialize()', () => {
        expect(dataAssembly.initialize({
            tag: 'Test-DataAssembly',
            description: 'It is a test!',
            dataItems: [],
            identifier: 'Test-Identifier',
            metaModelRef: 'Test-MetaModelRef'
        })).is.true;
        expect(dataAssembly.initialize({
            tag: 'Test-DataAssembly',
            description: 'It is a test!',
            dataItems: [],
            identifier: 'Test-Identifier',
            metaModelRef: 'Test-MetaModelRef'
        })).is.false;
    });
});

describe('class: DataAssemblyVendor', () => {
    it('method: buy() > BASIC', () => {
        const vendor = new DataAssemblyVendor();
        expect(vendor.buy(DataAssemblyType.BASIC).constructor.name).is.equal(new BasicDataAssembly().constructor.name);
    });
});
