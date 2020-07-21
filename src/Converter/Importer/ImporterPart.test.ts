import {expect} from 'chai';
import {HMIPart, MTPPart, ServicePart, TextPart} from './ImporterPart';
import {ErrorResponse, SuccessResponse} from '../../Backbone/Response';
import * as communicationsSetData from '../../../test/Converter/testdata-CommunicationSet-parser-logic.json';
import * as dataAssemblyTestResultData from '../../../test/Converter/Results/test-result-DataAssembly.json';
import * as communicationInterfaceDataTestResultData from '../../../test/Converter/Results/tes-result-CommunicationInterfaceData.json';
import {OPCUAServerCommunication} from '../../ModuleAutomation/CommunicationInterfaceData';
import {DataAssemblyFactory} from '../../ModuleAutomation/DataAssembly';

describe('class: MTPPart', () => {
    let part = new MTPPart();
    beforeEach(() => {
        part = new MTPPart();
    })
    it('method: extract()', () => {
        part.extract({CommunicationSet: communicationsSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
            expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
            const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[], DataAssemblies?: DataAssemblyFactory[]} = response.getContent();
            expect(JSON.stringify(testData.CommunicationInterfaceData)).is.equal(JSON.stringify(communicationInterfaceDataTestResultData));
            expect(JSON.stringify(testData.DataAssemblies)).is.equal(JSON.stringify(dataAssemblyTestResultData));
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