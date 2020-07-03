import {expect} from 'chai';
import {HMIPart, MTPPart, ServicePart, TextPart} from './ImporterPart';
import {ErrorResponse, SuccessResponse} from '../../Backbone/Response';
import * as communicationsSetData from '../../../test/Converter/testdata-CommunicationSet-parser-logic.json';
import {OPCUAServerCommunication} from '../../ModuleAutomation/CommunicationInterfaceData';

describe('class: MTPPart', () => {
    let part = new MTPPart();
    beforeEach(() => {
        part = new MTPPart();
    })
    it('method: extract()', () => {
        part.extract({CommunicationSet: communicationsSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
            expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
            const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]} = response.getContent();
            if (testData.CommunicationInterfaceData == undefined) {
                testData.CommunicationInterfaceData = [];
            }
            expect(testData.CommunicationInterfaceData?.length).is.equal(1);
            const serverEndpoint: {name?: string; serverURL?: string} = testData.CommunicationInterfaceData[0].getDescription();
            expect(serverEndpoint.name).is.equal('Test Control Engine OPC UA Server');
            expect(serverEndpoint.serverURL).is.equal('opc.tcp://127.0.0.1:4840');
        })
    })
});

describe('class: HMIPart', () => {
    let part = new HMIPart();
    beforeEach(() => {
        part = new HMIPart();
    })
    it('method: extract()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});

describe('class: TextPart', () => {
    let part = new TextPart();
    beforeEach(() => {
        part = new TextPart();
    })
    it('method: extract()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});

describe('class: ServicePart', () => {
    let part = new ServicePart();
    beforeEach(() => {
        part = new ServicePart();
    })
    it('method: convertFrom()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});