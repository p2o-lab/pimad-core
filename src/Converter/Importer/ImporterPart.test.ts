import {expect} from 'chai';
import {
    ExtractDataFromCommunicationSetResponseType,
    HMIPart,
    InternalServiceType,
    MTPPart,
    ServicePart,
    TextPart
} from './ImporterPart';
import * as communicationsSetData from '../../../test/Converter/testdata-CommunicationSet-parser-logic.json';
import * as communicationsSetDataMixingDataStructure from '../../../test/Converter/testdata-CommunicationSet-mixing-data-structure.json';
import * as communicationsSetDataSpecial from '../../../test/Converter/testdata-CommunicationSet-special.json';
import * as communicationsSetDataNoRefId from '../../../test/Converter/testdata-CommunicationSet-no-RefId.json';
import * as communicationsSetDataNoCorDatatypes from '../../../test/Converter/testdata-CommunicationSet-no-corresponding-datatypes.json';
import * as servicePartTestResult from '../../../test/Converter/Results/test-result-ServicePart.json';
import * as servicePartData from '../../../test/Converter/testdata-ServicePart.json';
import { OPCUAServerCommunication } from '../../ModuleAutomation/CommunicationInterfaceData';
import {Backbone} from '../../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import {DataItemModel, ModuleAutomation} from '../../ModuleAutomation';
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

    function evaluateMTPPart(serverCommunicationInterfaceData: DataItemModel[], dataAssemblies: DataAssembly[]): void {
        expect(serverCommunicationInterfaceData.length).is.equal(1);
        // ... do server stuff
        expect(dataAssemblies.length).is.equal(1);

        const dataAssembly = dataAssemblies[0];
        dataAssembly.getName((response, name) => {
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

        // TODO: check pimadIdentifier of DataItems
        dataAssembly.getAllDataItems((response, dataItems) => {
                expect(dataItems.length).equals(8);
                // check 'xs:string' (should be enough, if only check all attributes of TagName)
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
                // check 'xs:IDREF'
                dataItems[3].getCommunicationInterfaceData((response1, cIData) =>
                    expect(cIData).to.not.be.undefined);
            }
        )
    }

    describe('method: extract()', () => {
        it('test case: standard way', () => {
            part.extract({
                CommunicationSet: communicationsSetData,
            }, (response) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                const testData: ExtractDataFromCommunicationSetResponseType =
                    response.getContent() as ExtractDataFromCommunicationSetResponseType;
                evaluateMTPPart(testData.ServerCommunicationInterfaceData, testData.DataAssemblies);
            });
        });
        it('test case: mixing data structure', () => {
            part.extract({
                CommunicationSet: communicationsSetDataMixingDataStructure,
            }, (response) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                const testData: ExtractDataFromCommunicationSetResponseType =
                    response.getContent() as ExtractDataFromCommunicationSetResponseType;
                evaluateMTPPart(testData.ServerCommunicationInterfaceData, testData.DataAssemblies);
            });
        });
        describe('Messing with CommunicationSet-Data', () => {
            describe('CommunicationSet without InstanceList and/or SourceList', () => {
                it('without InstanceList', () => {
                    const manipulatedCommunicationSetData = [communicationsSetData[0], {}];
                    part.extract({
                        CommunicationSet: manipulatedCommunicationSetData,
                    }, (response) => {
                        expect(response.constructor.name).is.equal(errorResponseAsString);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
                it('without SourceList', () => {
                    const manipulatedCommunicationSetData = [{}, communicationsSetData[1]];
                    part.extract({
                        CommunicationSet: manipulatedCommunicationSetData,
                    }, (response) => {
                        expect(response.constructor.name).is.equal(errorResponseAsString);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });
                it('without booth', () => {
                    const manipulatedCommunicationSetData = [{}, {}];
                    part.extract({
                        CommunicationSet: manipulatedCommunicationSetData,
                    }, (response) => {
                        expect(response.constructor.name).is.equal(errorResponseAsString);
                        expect(response.getMessage()).is.equal('Could not parse the CommunicationSet!');
                    });
                });

            });
        });
        describe('special cases', () => {
            it('MTP has no arrays and no xs:ID', () => {
                part.extract({
                    CommunicationSet: communicationsSetDataSpecial,
                }, (response) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
                });
            });
            it('xs:ID available, but no RefID', () => {
                part.extract({
                    CommunicationSet: communicationsSetDataNoRefId,
                }, (response) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
                });
            });
            it('no corresponding datatypes', () => {
                // initializing localDataAssembly will fail
                part.extract({
                    CommunicationSet: communicationsSetDataNoCorDatatypes
                }, (response) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
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
            part.extract({}, (response) => {
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
            part.extract({} as any, (response) => {
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
            part.extract(servicePartData, (response) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                const testData = response.getContent() as InternalServiceType[];
                expect(testData.length).is.equal(2);
                expect(JSON.stringify(testData)).is.equal(JSON.stringify(servicePartTestResult));
            });
        });
    });
});
