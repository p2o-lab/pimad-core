import { expect } from 'chai';
import {MockGateFactory, XMLGateFactory} from './Gate';
import {ErrorResponse, Response, SuccessResponse} from '../Backbone/Response';

/* Gates */
describe('class XMLGate', () => {
    const factory = new XMLGateFactory()
    const gate = factory.create()
    it('method: initialize()', () => {
        const address = 'Test-Address';
        expect(gate.initialize(address)).is.true;
        expect(gate.initialize(address)).is.false;
    })
    it('method: send()', () => {
        gate.send({},(response) => {
            expect(typeof response).is.equal(typeof new ErrorResponse());
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
    it('method: receive()', () => {
        const xml2jsonTest = JSON.stringify({'test':{'title':{'value':'PiMAd-XML-Gate-Test'},'greeting':'Hello, World !'}});
        gate.receive({source: 'test/Converter/test.xml'},(response: Response) => {
            // TODO: General way to go? Handle simple typing? Without modeling fucking a lot classes.
            const content: { data?: {}} = response.getContent();
            expect(typeof response).is.equal(typeof new SuccessResponse());
            expect(JSON.stringify(content.data)).is.equal(xml2jsonTest);
        });
        gate.receive({source: 'this/is/a/wrong/path'},(response: Response) => {
            expect(typeof response).is.equal(typeof new ErrorResponse());
        });
    })
    /*it('method: open()', () => {
        expect(typeof gate.open()).is.equal(typeof new ErrorResponse());
    })
    it('method: close()', () => {
        expect(typeof gate.close()).is.equal(typeof new ErrorResponse());
    })*/
    it('method: getGateAddress()', () => {
        const address = 'Test-Address';
        gate.initialize(address)
        expect(gate.getGateAddress()).is.equal(address);
    })
})

describe('class: MockGate', () => {
    const factory = new MockGateFactory()
    const gate = factory.create()
    it('method: send()', () => {
        const instruction = {test: 'Test-Instruction for send()'}
        gate.send(instruction,(response) => {
            expect(typeof response).is.equal(typeof new SuccessResponse());
            const content: {test?: string} = response.getContent();
            expect(JSON.stringify(content)).is.equal(JSON.stringify(instruction));
        })
    });
    it('method: receive()', () => {
        const instruction = {test: 'Test-Instruction for receive()'}
        gate.receive(instruction,(response) => {
            expect(typeof response).is.equal(typeof new SuccessResponse());
            const content: {test?: string} = response.getContent();
            expect(JSON.stringify(content)).is.equal(JSON.stringify(instruction));
        })
    });
})
/* Factories */
describe('class: XMLGateFactory', () => {
    const factory = new XMLGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new XMLGateFactory())
    })
});

describe('class: MockGateFactory', () => {
    const factory = new MockGateFactory();
    it('method: create()', () => {
        expect(typeof factory.create()).is.equal(typeof new MockGateFactory())
    })
});