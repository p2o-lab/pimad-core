import {expect} from 'chai';
import {HMIPart, InternalServiceType, MTPPart, ServicePart, TextPart} from '../../../src/Converter/Importer/ImporterPart';
import * as communicationsSetData from '../testdata-CommunicationSet-parser-logic.json';
import * as communicationsSetDataMixingDataStructure from '../testdata-CommunicationSet-mixing-data-structure.json';
import * as servicePartTestResult from '../Results/test-result-ServicePart.json';
import * as servicePartData from '../testdata-ServicePart.json';
import { OPCUAServerCommunication } from '../../../src/ModuleAutomation/CommunicationInterfaceData';
import {Backbone} from '../../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import {ModuleAutomation} from '../../../src/ModuleAutomation';
import DataAssembly = ModuleAutomation.DataAssembly;

const responseVendor = new PiMAdResponseVendor()

describe('class: MTPPart', () => {
    let part = new MTPPart();
    beforeEach(() => {
        part = new MTPPart();
    })
    function evaluateMTPPart(communicationInterfaceData: OPCUAServerCommunication[], dataAssemblies: DataAssembly[]): void {
        expect(communicationInterfaceData.length).is.equal(1);
        // ... do server stuff
        expect(dataAssemblies.length).is.equal(1);
        dataAssemblies[0].getName((response, name) =>  {
           expect(name).is.equal('CrystalCrasher')
        });
        dataAssemblies[0].getPiMAdIdentifier((response, identifier) => {
            expect(identifier).equals('link6');
        });
        dataAssemblies[0].getMetaModelRef((response, metaModelRef) => {
            expect(metaModelRef).equals('MTPDataObjectSUCLib/DataAssembly/ServiceControl');
        });
    }
    describe('method: extract()', () => {
        it('test case: standard way', () => {
            part.extract({CommunicationSet: communicationsSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]; DataAssemblies?: DataAssembly[]} = response.getContent();
                evaluateMTPPart(testData.CommunicationInterfaceData as OPCUAServerCommunication[], testData.DataAssemblies as DataAssembly[]);
            })
        })
        it('test case: mixing data structure', () => {
            part.extract({CommunicationSet: communicationsSetDataMixingDataStructure, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]; DataAssemblies?: DataAssembly[]} = response.getContent();

                evaluateMTPPart(testData.CommunicationInterfaceData as OPCUAServerCommunication[], testData.DataAssemblies as DataAssembly[]);
            })
        })
        describe('Messing with CommunicationSet-Data', () => {
            describe('CommunicationSet without InstanceList and/or SourceList', () => {
                it('without InstanceList', () => {
                    const manipulatedCommunicationSetData = [communicationsSetData[0], {}];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
                it('without SourceList', () => {
                    const manipulatedCommunicationSetData = [{}, communicationsSetData[1]];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    })
                });
                it('without booth', () => {
                    const manipulatedCommunicationSetData = [{}, {}];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
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
            expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
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
            expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
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
            expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
            const testData = response.getContent() as InternalServiceType[];
            expect(testData.length).is.equal(2);
            expect(JSON.stringify(testData)).is.equal(JSON.stringify(servicePartTestResult))
        })
    })
});
