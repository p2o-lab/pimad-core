import {expect} from 'chai';
import {HMIPart, InternalServiceType, MTPPart, ServicePart, TextPart} from './ImporterPart';
import * as communicationsSetData from '../../../test/Converter/testdata-CommunicationSet-parser-logic.json';
import * as communicationsSetDataMixingDataStructure from '../../../test/Converter/testdata-CommunicationSet-mixing-data-structure.json';
import * as servicePartTestResult from '../../../test/Converter/Results/test-result-ServicePart.json';
import * as servicePartData from '../../../test/Converter/testdata-ServicePart.json';
import { OPCUAServerCommunication } from '../../ModuleAutomation/CommunicationInterfaceData';
import {Backbone} from '../../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import {ModuleAutomation} from '../../ModuleAutomation';
import DataAssembly = ModuleAutomation.DataAssembly;
import { validate as uuidValidate } from 'uuid';

const responseVendor = new PiMAdResponseVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

describe('class: MTPPart', () => {
    let part = new MTPPart();
    beforeEach(() => {
        part = new MTPPart();
    });
    function evaluateMTPPart(communicationInterfaceData: OPCUAServerCommunication[], dataAssemblies: DataAssembly[]): void {
        expect(communicationInterfaceData.length).is.equal(1);
        // ... do server stuff
        expect(dataAssemblies.length).is.equal(1);

        const dataAssembly= dataAssemblies[0];
        dataAssembly.getName((response, name) =>  {
           expect(name).is.equal('CrystalCrasher');
        });
        dataAssembly.getDataSourceIdentifier((response, identifier) => {
            expect(identifier).equals('link6');
        });
        dataAssembly.getPiMAdIdentifier((response, identifier) => {
            expect(uuidValidate(identifier)).is.true;
        });
        dataAssembly.getMetaModelRef((response, metaModelRef) => {
            expect(metaModelRef).equals('MTPDataObjectSUCLib/DataAssembly/ServiceControl');
        });

        dataAssembly.getAllDataItems((response, dataItems) => {
            expect(dataItems.length).equals(8);

            // check 'xs:string' and attributes of TagName (should be enough, if we only check TagName)
            dataItems[0].getValue((response1, value) =>
                expect(value).equals('CrystalCrasher'));
            dataItems[0].getDefaultValue((response1, value) =>
                expect(value).equals('CrystalCrasher'));
            dataItems[0].getDescription((response1, value) =>
                expect(value).equals('This is the description!'));

            // check 'xs:byte'
            dataItems[6].getValue((response1, value) =>
                expect(value).equals('0'));

            // check 'xs:boolean'
            dataItems[7].getValue((response1, value) =>
                expect(value).equals('false'));
            }
        )
    }
    describe('method: extract()', () => {
        it('test case: standard way', () => {
            part.extract({CommunicationSet: communicationsSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]; DataAssemblies?: DataAssembly[]} = response.getContent();
                evaluateMTPPart(testData.CommunicationInterfaceData as OPCUAServerCommunication[], testData.DataAssemblies as DataAssembly[]);
            });
        });
        it('test case: mixing data structure', () => {
            part.extract({CommunicationSet: communicationsSetDataMixingDataStructure, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                const testData: {CommunicationInterfaceData?: OPCUAServerCommunication[]; DataAssemblies?: DataAssembly[]} = response.getContent();

                evaluateMTPPart(testData.CommunicationInterfaceData as OPCUAServerCommunication[], testData.DataAssemblies as DataAssembly[]);
            });
        });
        describe('Messing with CommunicationSet-Data', () => {
            describe('CommunicationSet without InstanceList and/or SourceList', () => {
                it('without InstanceList', () => {
                    const manipulatedCommunicationSetData = [communicationsSetData[0], {}];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(errorResponseAsString);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
                it('without SourceList', () => {
                    const manipulatedCommunicationSetData = [{}, communicationsSetData[1]];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(errorResponseAsString);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
                it('without booth', () => {
                    const manipulatedCommunicationSetData = [{}, {}];
                    part.extract({CommunicationSet: manipulatedCommunicationSetData, HMISet: {}, ServiceSet: {}, TextSet: {}},(response) => {
                        expect(response.constructor.name).is.equal(errorResponseAsString);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
            });
        });
    });
});

describe('class: HMIPart', () => {
    let part = new HMIPart();
    beforeEach(() => {
        part = new HMIPart();
    });
    it('method: extract()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        });
    });
});

describe('class: TextPart', () => {
    let part = new TextPart();
    beforeEach(() => {
        part = new TextPart();
    });
    it('method: extract()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(errorResponseAsString);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        });
    });
});

describe('class: ServicePart', () => {
    let part = new ServicePart();
    beforeEach(() => {
        part = new ServicePart();
    });
    it('method: extract()', () => {
        part.extract(servicePartData,(response) => {
            expect(response.constructor.name).is.equal(successResponseAsString);
            const testData = response.getContent() as InternalServiceType[];
            expect(testData.length).is.equal(2);
            expect(JSON.stringify(testData)).is.equal(JSON.stringify(servicePartTestResult));
        });
    });
});
