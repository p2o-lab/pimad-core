import {expect} from 'chai';
import {HMIPart, InternalServiceType, MTPPart, ServicePart, TextPart} from '../../../src/Converter/Importer/ImporterPart';
import {ErrorResponse, SuccessResponse} from '../../../src/Backbone/Response';
import * as communicationsSetData from '../testdata-CommunicationSet-parser-logic.json';
import * as communicationsSetDataMixingDataStructure from '../testdata-CommunicationSet-mixing-data-structure.json';
import * as dataAssemblyTestResultData from '../Results/test-result-DataAssembly.json';
import * as servicePartTestResult from '../Results/test-result-ServicePart.json';
import * as communicationInterfaceDataTestResultData from '../Results/tes-result-CommunicationInterfaceData.json';
import * as servicePartData from '../testdata-ServicePart.json';
import {DataAssembly} from '../../../src/ModuleAutomation';
import { OPCUAServerCommunication } from '../../../src/ModuleAutomation/CommunicationInterfaceData';

describe('class: MTPPart', () => {
    let part = new MTPPart();
    beforeEach(() => {
        part = new MTPPart();
    })
    describe('method: extract()', () => {
        it('test case: standard way', () => {
            part.extract({CommunicationSet: communicationsSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]; DataAssemblies?: DataAssembly[]} = response.getContent();

                expect(JSON.stringify(testData.CommunicationInterfaceData)).is.equal(JSON.stringify(communicationInterfaceDataTestResultData));
                expect(JSON.stringify(testData.DataAssemblies)).is.equal(JSON.stringify(dataAssemblyTestResultData));
            })
        })
        it('test case: mixing data structure', () => {
            part.extract({CommunicationSet: communicationsSetDataMixingDataStructure, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]; DataAssemblies?: DataAssembly[]} = response.getContent();
                expect(JSON.stringify(testData.CommunicationInterfaceData)).is.equal(JSON.stringify(communicationInterfaceDataTestResultData));
                expect(JSON.stringify(testData.DataAssemblies)).is.equal(JSON.stringify(dataAssemblyTestResultData));
            })
        })
        describe('Messing with CommunicationSet-Data', () => {
            describe('CommunicationSet without InstanceList and/or SourceList', () => {
                it('without InstanceList', () => {
                    const manipulatedCommunicationSetData = [communicationsSetData[0], {}];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
                it('without SourceList', () => {
                    const manipulatedCommunicationSetData = [{}, communicationsSetData[1]];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    })
                });
                it('without booth', () => {
                    const manipulatedCommunicationSetData = [{}, {}];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    })
                });
            });
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
    it('method: extract()', () => {
        part.extract(servicePartData,(response) => {
            expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
            const testData = response.getContent() as InternalServiceType[];
            expect(testData.length).is.equal(2);
            expect(JSON.stringify(testData)).is.equal(JSON.stringify(servicePartTestResult))
        })
    })
});