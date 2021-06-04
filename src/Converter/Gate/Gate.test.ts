import { expect } from 'chai';
import {AMLGateFactory, MockGateFactory, MTPGateFactory, XMLGateFactory, ZIPGateFactory} from './GateFactory';
import {Backbone} from '../../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;
import {Gate} from './Gate';
import exp = require("constants");

const responseVendor = new PiMAdResponseVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

describe('class: MockGate', () => {
    const factory = new MockGateFactory();
    let gate = factory.create();
    beforeEach(() => {
        gate = factory.create();
    });
    it('method: send()', () => {
        const instruction = {test: 'Test-Instruction for send()'};
        gate.send(instruction,(response) => {
            expect(response.constructor.name).is.equal(successResponseAsString);
            const content: {test?: string} = response.getContent();
            expect(JSON.stringify(content)).is.equal(JSON.stringify(instruction));
        });
    });
    it('method: receive()', () => {
        const instruction = {test: 'Test-Instruction for receive()'};
        gate.initialize('Test-Address');
        gate.receive(instruction,(response) => {
            expect(response.constructor.name).is.equal(successResponseAsString);
            const content: {test?: string} = response.getContent();
            expect(JSON.stringify(content)).is.equal(JSON.stringify(instruction));
        });
    });
    it('without initialization', () => {
        gate.receive({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
        });
    });
});

describe('class MTPGate', () => {
    const factory = new MTPGateFactory();
    let gate: Gate;
    beforeEach(() => {
        gate = factory.create();
    });
    it('method: initialize()', () => {
        // TODO: Do some regex, checking for the address
        const address = 'Test-Address';
        expect(gate.initialize(address)).is.true;
        expect(gate.initialize(address)).is.false;
    });
    it('method: send()', () => {
        gate.send({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        });
    });
    it('method: receive()', done => {
        const xml2jsonTest = JSON.stringify({'data':{'test':{'title':{'value':'PiMAd-XML-Gate-Test'},'greeting':'Hello, World !'}}});
        gate.initialize('test/Converter/test-xml.mtp');
        gate.receive({},(response: PiMAdResponse) => {
            const content: {data?: object[]} = response.getContent();
            if (content.data === undefined) {
                content.data = [];
            }
            expect(response.constructor.name).is.equal(successResponseAsString);
            expect(JSON.stringify(content.data[0])).is.equal(xml2jsonTest);
            done();
        });
    }).timeout(500);
    it('method: getGateAddress()', () => {
        const address = 'test/Converter/test-xml.mtp';
        gate.initialize(address);
        expect(gate.getGateAddress()).is.equal(address);
    });
    it('without initialization', () => {
        gate.receive({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
        });
    });
});

describe('class AMLGate', () => {

    const factory = new AMLGateFactory();
    let gate = factory.create();
    beforeEach(() => {
        gate = factory.create();
    });
    it('method: initialize()', () => {
        const address = 'Test-Address';
        expect(gate.initialize(address)).is.true;
        expect(gate.initialize(address)).is.false;
    });
    it('method: send()', () => {
        gate.send({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        });
    });
    describe('method: receive()', () => {
        it('base functionality', () => {
            gate.initialize('test/Converter/test.aml');
            const xml2jsonTest = JSON.stringify({'test':{'title':{'value':'PiMAd-AML-Gate-Test'},'greeting':'Hello, World !'}});
            gate.receive({source: 'test/Converter/test.aml'},(response: PiMAdResponse) => {
                const content: { data?: {}} = response.getContent();
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(JSON.stringify(content.data)).is.equal(xml2jsonTest);
            });
        });
        it('wrong path', () => {
            gate.initialize('this/is/a/wrong/path');
            gate.receive({source: 'this/is/a/wrong/path'},(response: PiMAdResponse) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
        it('without initialization', () => {
            gate.receive({source: 'test/Converter/test.aml'},(response: PiMAdResponse) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
    });
    it('method: getGateAddress()', () => {
        const address = 'Test-Address';
        gate.initialize(address);
        expect(gate.getGateAddress()).is.equal(address);
    });
});

describe('class XMLGate', () => {
    const factory = new XMLGateFactory();
    let gate = factory.create();
    beforeEach(() => {
        gate = factory.create();
    });
    it('method: initialize()', () => {
        const address = 'Test-Address';
        expect(gate.initialize(address)).is.true;
        expect(gate.initialize(address)).is.false;
    });
    it('method: send()', () => {
        gate.send({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        });
    });
    describe('method: receive()', () => {
        it('base functionality', () => {
            gate.initialize('test/Converter/test.xml');
            const xml2jsonTest = JSON.stringify({'test':{'title':{'value':'PiMAd-XML-Gate-Test'},'greeting':'Hello, World !'}});
            gate.receive({},(response: PiMAdResponse) => {
                // TODO: General way to go? Handle simple typing? Without modeling fucking a lot classes.
                const content: { data?: {}} = response.getContent();
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(JSON.stringify(content.data)).is.equal(xml2jsonTest);
            });
        });
        it('wrong path', () => {
            gate.initialize('this/is/a/wrong/path');
            gate.receive({},(response: PiMAdResponse) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
    });
    it('method: getGateAddress()', () => {
        const address = 'Test-Address';
        gate.initialize(address);
        expect(gate.getGateAddress()).is.equal(address);
    });
    it('receive() without initialization', () => {
        gate.receive({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
        });
    });
});

describe('class ZIPGate', () => {
    const factory = new ZIPGateFactory();
    let gate = factory.create();
    beforeEach(() => {
        gate = factory.create();
    });
    it('method: initialize()', () => {
        // TODO: Do some regex, checking for the address
        const address = 'Test-Address';
        expect(gate.initialize(address)).is.true;
        expect(gate.initialize(address)).is.false;
    });
    it('method: send()', () => {
        gate.send({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        });
    });
    describe('method: receive()', () => {
        it('zip-archive with single xml-file', done => {
            const xml2jsonTest = JSON.stringify({'data':{'test':{'title':{'value':'PiMAd-XML-Gate-Test'},'greeting':'Hello, World !'}}});
            //gate.initialize('test/Converter/test-xml.zip');
            gate.initialize('test/Converter/test-xml.zip');

            gate.receive({},(response: PiMAdResponse) => {
                const content: {data?: object[]} = response.getContent();
                if (content.data === undefined) {
                    content.data = [];
                }
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(JSON.stringify(content.data[0])).is.equal(xml2jsonTest);
                done();
            });
        }).timeout(500);
        it('zip-archive with single aml-file', done => {
            const xml2jsonTest = JSON.stringify({'data':{'test':{'title':{'value':'PiMAd-AML-Gate-Test'},'greeting':'Hello, World !'}}});
            gate.initialize('test/Converter/test-aml.zip');
            gate.receive({},(response: PiMAdResponse) => {
                const content: {data?: object[]} = response.getContent();
                if (content.data === undefined) {
                    content.data = [];
                }
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(JSON.stringify(content.data[0])).is.equal(xml2jsonTest);
                done();
            });
        }).timeout(500);
        it('without initialization', () => {
            gate.receive({},(response) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
            });
        });
    });
    it('method: getGateAddress()', () => {
        const address = 'test/Converter/test-xml.zip';
        gate.initialize(address);
        expect(gate.getGateAddress()).is.equal(address);
    });
});
