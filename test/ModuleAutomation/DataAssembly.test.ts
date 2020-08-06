import {BaseDataAssemblyFactory} from '../../src/ModuleAutomation/DataAssembly';
import {expect} from 'chai';
import {ErrorResponse} from '../../src/Backbone/Response';
import {DataAssembly} from '../../build/ModuleAutomation';

describe('class: BaseDataAssembly', () => {
    let dataAssembly: DataAssembly;
    beforeEach(function () {
        dataAssembly = new BaseDataAssemblyFactory().create();
    });
    it('method: getInterfaceClass()', () => {
        expect(typeof dataAssembly.getInterfaceClass()).is.equal(typeof new ErrorResponse());
    });
    it('method: getTagDescription()', () => {
        expect(typeof dataAssembly.getTagDescription()).is.equal(typeof '');
    });
    it('method: getTagName()', () => {
        expect(typeof dataAssembly.getTagName()).is.equal(typeof '');
    });
    it('method: getCommunication()', () => {
        expect(typeof dataAssembly.getCommunication()).is.equal(typeof new ErrorResponse());
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
