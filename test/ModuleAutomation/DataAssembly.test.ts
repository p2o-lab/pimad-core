import {expect} from 'chai';
import {Backbone} from '../../src/Backbone';
import {ModuleAutomation} from '../../src/ModuleAutomation';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import DataAssembly = ModuleAutomation.DataAssembly;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;
import {BasicDataAssembly} from '../../src/ModuleAutomation/DataAssembly';

const responseVendor = new PiMAdResponseVendor();
const dataAssemblyVendor = new DataAssemblyVendor();

describe('class: BaseDataAssembly', () => {
    let dataAssembly: DataAssembly;
    beforeEach(function () {
        dataAssembly = dataAssemblyVendor.buy(DataAssemblyType.BASIC);
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
