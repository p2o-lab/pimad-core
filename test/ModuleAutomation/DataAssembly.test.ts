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
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name

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
                description: 'Test-Description',
                dataItems: [dataItemOne, dataItemTwo, dataItemThree],
                identifier: 'Test-Identifier',
                metaModelRef: 'Test-MetaModelRef'
            });
        });
        it('method: getAllDataItems', () => {
            dataAssembly.getAllDataItems((response, dataItems) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(dataItems.length).is.equal(3);
            })
        });
        describe('method: getDataItem', () => {
            it('DataItem exists', () => {
                dataAssembly.getDataItem('DataItemTwo', (response, dataItem) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
                    expect(dataItem.getName()).is.equal('DataItemTwo');
                });
            });
            it('DataItem does not exist', () => {
                dataAssembly.getDataItem('DataItemFour', (response, dataItem) => {
                    expect(response.constructor.name).is.equal(errorResponseAsString);
                });
            });
        });
        it('method: getInterfaceClass()', () => {
            dataAssembly.getInterfaceClass((response, interfaceClass) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(response.getMessage()).is.equal('Not implemented yet!');
            });
        });
        it('method: getHumanReadableDescription()', () => {
            dataAssembly.getHumanReadableDescription((response, tagDescription) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(tagDescription).is.equal('Test-Description');
            });
        });
        it('method: getName()', () => {
            dataAssembly.getName((response, name) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(name).is.equal('Test-DataAssembly');
            });
        });
        it('method: getIdentifier()', () => {
            dataAssembly.getIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(identifier).is.equal('Test-Identifier');
            });
        });
        it('method: getMetaModelRef()', () => {
            dataAssembly.getMetaModelRef((response, metaModelRef) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(metaModelRef).is.equal('Test-MetaModelRef');
            });
        });
    });
    describe('without initialization', () => {
        it('method: getAllDataItems', () => {
            dataAssembly.getAllDataItems((response, dataItems) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('method: getDataItem', () => {
            dataAssembly.getDataItem('Test-DataItem',(response, dataItems) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('method: getInterfaceClass()', () => {
            dataAssembly.getInterfaceClass((response, interfaceClass) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('method: getDescription()', () => {
            dataAssembly.getHumanReadableDescription((response, tagDescription) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(tagDescription).is.equal('description: undefined');
            });
        });
        it('method: getName()', () => {
            dataAssembly.getName((response, name) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(name).is.equal('name: undefined');
            });
        });
        it('method: getIdentifier()', () => {
            dataAssembly.getIdentifier((response, identifier) => {
                expect(response.constructor.name).equals(errorResponseAsString);
                expect(identifier).equals('identifier: undefined');
            });
        });
        it('method: getMetaModelRef()', () => {
            dataAssembly.getMetaModelRef((response, metaModelRef) => {
                expect(response.constructor.name).equals(errorResponseAsString);
                expect(metaModelRef).equals('metaModelRef: undefined');
            });
        });
    });
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
