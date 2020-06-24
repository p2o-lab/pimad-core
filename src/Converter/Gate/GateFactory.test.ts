import {AMLGateFactory, MockGateFactory, MTPGateFactory, XMLGateFactory, ZIPGateFactory} from './GateFactory';
import {expect} from 'chai';

describe('class: AMLGateFactory', () => {
    const factory = new AMLGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new AMLGateFactory())
    })
});

describe('class: MockGateFactory', () => {
    const factory = new MockGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new MockGateFactory())
    })
});

describe('class: MTPGateFactory', () => {
    const factory = new MTPGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new MTPGateFactory())
    })
});

describe('class: XMLGateFactory', () => {
    const factory = new XMLGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new XMLGateFactory())
    })
});

describe('class: ZIPGateFactory', () => {
    const factory = new ZIPGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new ZIPGateFactory())
    })
});