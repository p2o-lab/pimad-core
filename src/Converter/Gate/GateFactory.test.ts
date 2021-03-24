import {AMLGateFactory, MockGateFactory, MTPGateFactory, XMLGateFactory, ZIPGateFactory} from './GateFactory';
import {expect} from 'chai';

describe('class: AMLGateFactory', () => {
    const factory = new AMLGateFactory();
    it('method: create()', () => {
        expect(factory.create().constructor.name).is.equal('AMLGate');
    });
});

describe('class: MockGateFactory', () => {
    const factory = new MockGateFactory();
    it('method: create()', () => {
        expect(factory.create().constructor.name).is.equal('MockGate');
    });
});

describe('class: MTPGateFactory', () => {
    const factory = new MTPGateFactory();
    it('method: create()', () => {
        expect(factory.create().constructor.name).is.equal('MTPGate');
    });
});

describe('class: XMLGateFactory', () => {
    const factory = new XMLGateFactory();
    it('method: create()', () => {
        expect(factory.create().constructor.name).is.equal('XMLGate');
    });
});

describe('class: ZIPGateFactory', () => {
    const factory = new ZIPGateFactory();
    it('method: create()', () => {
        expect(factory.create().constructor.name).is.equal('ZIPGate');
    });
});
