import {expect} from 'chai';
import {Attribute, AttributeFactoryVendor} from './index';

describe('class: AttributeFactoryVendor', () => {
    const factoryVendor = new AttributeFactoryVendor();
    it('method: buyProcedureAttributeFactory()', () => {
        expect(factoryVendor.buyProcedureAttributeFactory().constructor.name).is.equal('ProcedureAttributeFactory');
    });
    it('method: buyServiceAttributeFactory()', () => {
        expect(factoryVendor.buyServiceAttributeFactory().constructor.name).is.equal('ServiceAttributeFactory');
    });
});

describe('class: ProcedureAttributeFactory', () => {
    it('method: create()', () => {
        const attributeFactory = new AttributeFactoryVendor().buyProcedureAttributeFactory();
        expect(attributeFactory.create().constructor.name).is.equal('ProcedureAttribute');
    });
});

describe('class: ServiceAttributeFactory', () => {
    it('method: create()', () => {
        const attributeFactory = new AttributeFactoryVendor().buyServiceAttributeFactory();
        expect(attributeFactory.create().constructor.name).is.equal('ServiceAttribute');
    });
});

describe('class: ProcedureAttribute', () => {
    const attributeFactory = new AttributeFactoryVendor().buyProcedureAttributeFactory();
    let localAttribute: Attribute;
    beforeEach(function () {
        localAttribute = attributeFactory.create();
    });
    describe('with initialisation', () => {
        beforeEach(function () {
            localAttribute.initialize({DataType: 'Test-DataType', Name: 'Test-Name', Value: 'Test-Value'});
        });
        it('method: getDataType()', () => {
            const response = localAttribute.getDataType();
            expect(response.constructor.name).is.equal('SuccessResponse');
            expect((response.getContent() as {data: string}).data).is.equal('Test-DataType');
        });
        it('method: getName()', () => {
            const response = localAttribute.getName();
            expect(response.constructor.name).is.equal('SuccessResponse');
            expect((response.getContent() as {data: string}).data).is.equal('Test-Name');
        });
        it('method: getValue()', () => {
            const response = localAttribute.getValue();
            expect(response.constructor.name).is.equal('SuccessResponse');
            expect((response.getContent() as {data: string}).data).is.equal('Test-Value');
        });
    });
    describe('without initialisation', () => {
        it('method: getDataType()', () => {
            expect(localAttribute.getDataType().constructor.name).is.equal('ErrorResponse');
        });
        it('method: getName()', () => {
            expect(localAttribute.getName().constructor.name).is.equal('ErrorResponse');
        });
        it('method: getValue()', () => {
            expect(localAttribute.getValue().constructor.name).is.equal('ErrorResponse');
        });
    });
    describe('method: initialize()', () => {
        it('normal usage', () => {
            expect(localAttribute.initialize({DataType: '',Name: '', Value: ''})).is.true;
        });
        it('initial twice', () => {
            expect(localAttribute.initialize({DataType: '',Name: '', Value: ''})).is.true;
            expect(localAttribute.initialize({DataType: '',Name: '', Value: ''})).is.false;
        });
    });
});

describe('class: ServiceAttribute', () => {
    const attributeFactory = new AttributeFactoryVendor().buyServiceAttributeFactory();
    let localAttribute: Attribute;
    beforeEach(function () {
        localAttribute = attributeFactory.create();
    });
    describe('with initialisation', () => {
        beforeEach(function () {
            localAttribute.initialize({DataType: 'Test-DataType',Name: 'Test-Name', Value: 'Test-Value'});
        });
        it('method: getDataType()', () => {
            const response = localAttribute.getDataType();
            expect(response.constructor.name).is.equal('SuccessResponse');
            expect((response.getContent() as {data: string}).data).is.equal('Test-DataType');
        });
        it('method: getName()', () => {
            const response = localAttribute.getName();
            expect(response.constructor.name).is.equal('SuccessResponse');
            expect((response.getContent() as {data: string}).data).is.equal('Test-Name');
        });
        it('method: getValue()', () => {
            const response = localAttribute.getValue();
            expect(response.constructor.name).is.equal('SuccessResponse');
            expect((response.getContent() as {data: string}).data).is.equal('Test-Value');
        });
    });
    describe('without initialisation', () => {
        it('method: getDataType()', () => {
            expect(localAttribute.getDataType().constructor.name).is.equal('ErrorResponse');
        });
        it('method: getName()', () => {
            expect(localAttribute.getName().constructor.name).is.equal('ErrorResponse');
        });
        it('method: getValue()', () => {
            expect(localAttribute.getValue().constructor.name).is.equal('ErrorResponse');
        });
    });
    describe('method: initialize()', () => {
        it('normal usage', () => {
            expect(localAttribute.initialize({DataType: '',Name: '', Value: ''})).is.true;
        });
        it('initial twice', () => {
            expect(localAttribute.initialize({DataType: '',Name: '', Value: ''})).is.true;
            expect(localAttribute.initialize({DataType: '',Name: '', Value: ''})).is.false;
        });
    });
});
