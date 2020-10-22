import {expect} from 'chai';
import {
    Attribute,
    AttributeFactoryVendor,
    BaseParameterFactory,
    BaseProcedureFactory, InitializeProcedureType,
    ModuleAutomation,
    Parameter,
    Procedure
} from './index';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;
import {v4 as uuidv4} from 'uuid';
const responseVendor = new PiMAdResponseVendor();
const dataAssemblyVendor = new DataAssemblyVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

describe('class: BaseProcedure', () => {
    let procedure: Procedure;
    const procedureFactory = new BaseProcedureFactory();
    beforeEach(function () {
        procedure = procedureFactory.create();
    });
    describe('check getter', () => {
        beforeEach(function () {
            const dataAssembly = dataAssemblyVendor.buy(DataAssemblyType.BASIC);
            dataAssembly.initialize({
                tag: 'Test-DataAssembly',
                description: '',
                metaModelRef: '',
                identifier: '',
                dataItems: []
            });

            const procedureAttributeFactory = new AttributeFactoryVendor().buyProcedureAttributeFactory();
            const attribute0 = procedureAttributeFactory.create();
            attribute0.initialize({Name: 'Test-Attribute0', DataType: '', Value:''});
            const attribute1 = procedureAttributeFactory.create();
            attribute1.initialize({Name: 'Test-Attribute1', DataType: '', Value:'1'});
            const attribute2 = procedureAttributeFactory.create();
            attribute2.initialize({Name: 'Test-Attribute2', DataType: '', Value:'0'});
            const attributes: Attribute[] = [attribute0, attribute1, attribute2];

            const parameterFactory = new BaseParameterFactory();
            const parameter = parameterFactory.create();
            parameter.initialize('Test-Parameter', [], '');
            const parameter2 = parameterFactory.create();
            parameter2.initialize('Test-Parameter2', [], '');
            procedure.initialize({
                dataAssembly: dataAssembly,
                dataSourceIdentifier: 'Test-Identifier',
                metaModelRef: 'Test-MetaModelRef',
                name: 'Test-ProcedureName',
                attributes: attributes,
                parameter: [parameter, parameter2],
                pimadIdentifier: uuidv4()
            });

        });

        describe('method: getAttribute()', () => {
            it('test case: standard usage', done => {
                procedure.getAttribute('Test-Attribute1', (response, data) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
                    const responseContent = data.getName().getContent() as {data: string};
                    expect(responseContent.data).is.equal('Test-Attribute1');
                    done();
                });
            });
            it('test case: requested attribute not in array', done => {
                procedure.getAttribute('Attribute', response => {
                    expect(response.constructor.name).is.equal(errorResponseAsString);
                    done();
                });
            });
        });
        it('method: getAllAttributes()', done => {
            procedure.getAllAttributes((response, data) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(data.length).is.equal(3);
                done();
            });
        });
        it('method: getAllParameters()', done => {
            procedure.getAllParameters((response, data) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(data.length).is.equal(2);
                done();
            });
        });
        it('method: getDataAssembly()', done => {
            procedure.getDataAssembly((response, data) => {
                data.getName((response, data) =>  {
                    expect(data).equals('Test-DataAssembly');
                    done();
                });
            });
        });
        it('method: getMetaModelRef()', (done) => {
            procedure.getMetaModelRef((response, metaModelRef) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(metaModelRef).is.equal('Test-MetaModelRef');
                done();
            });
        });
        it('method: getName()', (done) => {
            procedure.getName((response, name) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(name).is.equal('Test-ProcedureName');
                done();
            });
        });
        describe('method: getParameter()', () => {
            it('test case: standard usage', done => {
                procedure.getParameter('Test-Parameter', (response, data) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
                    expect(data.getName()).is.equal('Test-Parameter');
                    done();
                });
            });
            it('test case: requested attribute not in array', (done) => {
                procedure.getParameter('Parameter', response => {
                    expect(response.constructor.name).is.equal(errorResponseAsString);
                    done();
                });
            });
        });
    });
    it('method: initialize()', () => {
        expect(procedure.initialize({} as InitializeProcedureType)).is.true;
        expect(procedure.initialize({} as InitializeProcedureType)).is.false;
    });
});
describe('class: BaseProcedureFactory', () => {
    it('method: create()', () => {
        const factory = new BaseProcedureFactory();
        expect(factory.create().constructor.name).is.equal('BaseProcedure');
    });
});
