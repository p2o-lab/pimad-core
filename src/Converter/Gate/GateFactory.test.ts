import {MockGateFactory, XMLGateFactory, ZIPGateFactory} from './GateFactory';
import {expect} from "chai";

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

describe('class: MockGateFactory', () => {
    const factory = new MockGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new MockGateFactory())
    })
});