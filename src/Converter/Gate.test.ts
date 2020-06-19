import { expect } from 'chai';
import {MockGateFactory, XMLGateFactory, ZIPGateFactory} from './Gate';
import {ErrorResponse, Response, SuccessResponse} from '../Backbone/Response';

/* Gates */
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
    it('method: getGateAddress()', () => {
        const address = 'Test-Address';
        gate.initialize(address)
        expect(gate.getGateAddress()).is.equal(address);
    })
})

describe('class ZIPGate', () => {
    const factory = new ZIPGateFactory()
    const gate = factory.create()
    it('method: initialize()', () => {
        // TODO: Do some regex, checking for the address
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
    it('method: receive()', done => {
        const xml2jsonTest = JSON.stringify({'data':{'test':{'title':{'value':'PiMAd-XML-Gate-Test'},'greeting':'Hello, World !'}}});
        gate.initialize('test/Converter/test-xml.zip')
        gate.receive({},(response: Response) => {
            const content: {data?: object[]} = response.getContent();
            if (content.data === undefined) {
                content.data = []
            }
            expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
            expect(JSON.stringify(content.data[0])).is.equal(xml2jsonTest);
            done();
        });
    }).timeout(500)
    it('method: getGateAddress()', () => {
        const address = 'test.zip';
        gate.initialize(address)
        expect(gate.getGateAddress()).is.equal(address);
    })
})

/* Factories */
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