import {BaseDataAssemblyFactory} from '../../src/ModuleAutomation';
import {expect} from 'chai';
import {DataAssembly} from '../../src/ModuleAutomation';
import {Backbone} from '../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor();

describe('class: BaseDataAssembly', () => {
    let dataAssembly: DataAssembly;
    beforeEach(function () {
        dataAssembly = new BaseDataAssemblyFactory().create();
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
describe('class: BaseDataAssemblyFactory', () => {
    it('method: create()', () => {
        const factory = new BaseDataAssemblyFactory();
        expect(factory.create().constructor.name).is.equal('BaseDataAssembly');
    });
});
