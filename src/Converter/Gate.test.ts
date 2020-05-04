import { expect } from 'chai';
import {FileSystemGateFactory, FileSystemGate} from './Gate';
import {ErrorResponse} from '../Backbone/Response';

describe('class FileSystemGate', () => {
    const factory = new FileSystemGateFactory()
    const gate = factory.create()
    it('method: initialize', () => {
        const address = 'Test-Address';
        expect(gate.initialize(address)).is.true;
        expect(gate.initialize(address)).is.false;
    })
    it('method: send', () => {
        expect(gate.send()).is.false;
    })
    it('method: receive', () => {
        expect(gate.receive()).is.false;
    })
    it('method: open', () => {
        const response = gate.open();
        expect(typeof response).is.equal(typeof new ErrorResponse());
    })
    it('method: close', () => {
        expect(gate.close()).is.false;
    })
    it('method: getGateAddress', () => {
        const address = 'Test-Address';
        gate.initialize(address)
        expect(gate.getGateAddress()).is.equal(address);
    })
})

describe('class: FMTPGate', () => {
    const factory = new FileSystemGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new FileSystemGate())
    })
});