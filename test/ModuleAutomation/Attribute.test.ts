import {expect} from 'chai';
import {Attribute, AttributeFactoryVendor} from '../../src/ModuleAutomation/Attribute';

describe('class: AttributeFactoryVendor', () => {
    const factoryVendor = new AttributeFactoryVendor();
    it('method: buyProcedureAttributeFactory()', () => {
        expect(factoryVendor.buyProcedureAttributeFactory().constructor.name).is.equal('ProcedureAttributeFactory');
    })
    it('method: buyServiceAttributeFactory()', () => {
        expect(factoryVendor.buyServiceAttributeFactory().constructor.name).is.equal('ServiceAttributeFactory');
    })
})

describe('class: ProcedureAttributeFactory', () => {
    it('method: create()', () => {
        const attributeFactory = new AttributeFactoryVendor().buyProcedureAttributeFactory();
        expect(attributeFactory.create().constructor.name).is.equal('ProcedureAttribute');
    })
})

describe('class: ServiceAttributeFactory', () => {
    it('method: create()', () => {
        const attributeFactory = new AttributeFactoryVendor().buyServiceAttributeFactory();
        expect(attributeFactory.create().constructor.name).is.equal('ServiceAttribute');
    })
})

describe('class: ProcedureAttribute', () => {
    const attributeFactory = new AttributeFactoryVendor().buyProcedureAttributeFactory();
    let localAttribute: Attribute;
    beforeEach(function () {
        localAttribute = attributeFactory.create();
    })
    describe('method: initialize()', () => {
        it('normal usage', () => {
            expect(localAttribute.initialize({})).is.false;
        })
    })
})

describe('class: ServiceAttribute', () => {
    const attributeFactory = new AttributeFactoryVendor().buyServiceAttributeFactory();
    let localAttribute: Attribute;
    beforeEach(function () {
        localAttribute = attributeFactory.create();
    })
    describe('method: initialize()', () => {
        it('normal usage', () => {
            expect(localAttribute.initialize({})).is.false;
        })
    })
})