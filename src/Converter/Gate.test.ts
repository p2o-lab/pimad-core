import { expect } from 'chai';
import {FMTPGate, MTPGate} from "./Gate";

describe("class MTPGate", () => {
    const factory = new FMTPGate()
    let gate = factory.create()
    it("method: initialize", () => {
        expect(gate.initialize()).is.false;
    })
    it("method: send", () => {
        expect(gate.send()).is.false;
    })
    it("method: receive", () => {
        expect(gate.receive()).is.false;
    })
    it("method: open", () => {
        expect(gate.open()).is.false;
    })
    it("method: close", () => {
        expect(gate.close()).is.false;
    })
})

describe("class: FMTPGate", () => {
    const factory = new FMTPGate();
    it("method: create()", () => {
        expect(typeof factory.create()).is.equal(typeof new MTPGate())
    })
});