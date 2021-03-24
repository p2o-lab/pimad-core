import {
    Attribute,
    AttributeFactoryVendor,
    BaseParameterFactory,
    BaseProcedureFactory,
    ModuleAutomation,
    Service
} from './index';
import {expect} from 'chai';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;
import DataAssembly = ModuleAutomation.DataAssembly;
import {v4 as uuidv4} from 'uuid';
import {BaseServiceFactory, InitializeServiceType} from './Service';
const responseVendor = new PiMAdResponseVendor();
const dataAssemblyVendor = new DataAssemblyVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name;
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name;

describe('class: BaseService', () => {
    let service: Service;
    const serviceFactory = new BaseServiceFactory();
    beforeEach(function () {
        service = serviceFactory.create();
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

            const serviceAttributeFactory = new AttributeFactoryVendor().buyServiceAttributeFactory();
            const attribute0 = serviceAttributeFactory.create();
            attribute0.initialize({Name: 'Test-Attribute0', DataType: '', Value:''});
            const attribute1 = serviceAttributeFactory.create();
            attribute1.initialize({Name: 'Test-Attribute1', DataType: '', Value:'1'});
            const attribute2 = serviceAttributeFactory.create();
            attribute2.initialize({Name: 'Test-Attribute2', DataType: '', Value:'0'});
            const attributes: Attribute[] = [attribute0, attribute1, attribute2];

            const parameterFactory = new BaseParameterFactory();
            const parameter = parameterFactory.create();
            parameter.initialize('Test-Parameter0', [], '');
            const parameter2 = parameterFactory.create();
            parameter2.initialize('Test-Parameter1', [], '');
            const procedureFactory = new BaseProcedureFactory();
            const procedure0 = procedureFactory.create();
            procedure0.initialize({
                dataAssembly: {} as DataAssembly,
                dataSourceIdentifier: '',
                metaModelRef: '',
                name: 'Test-Procedure0', parameter: [],
                attributes: [],
                pimadIdentifier: uuidv4()
            });
            const procedure1 = procedureFactory.create();
            procedure1.initialize({
                dataAssembly: {} as DataAssembly,
                dataSourceIdentifier: '',
                metaModelRef: '',
                name: 'Test-Procedure1', parameter: [],
                attributes: [],
                pimadIdentifier: uuidv4()
            });
            service.initialize({
                attributes: attributes,
                dataAssembly: dataAssembly,
                dataSourceIdentifier: 'Test-Identifier',
                metaModelRef: 'Test-MetaModelRef',
                name: 'Test-Name',
                parameter: [parameter, parameter2],
                pimadIdentifier: uuidv4(),
                procedure: [procedure0, procedure1]
            });
        });

        it('method: getAllProcedures()', done => {
            service.getAllProcedures((response, data) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(data.length).is.equal(2);
                done();
            });
        });
        describe('method: getProcedure()', () => {
            it('test case: standard usage', done => {
                service.getProcedure('Test-Procedure1', (response, data) => {
                    expect(response.constructor.name).is.equal(successResponseAsString);
                    data.getName((response, name) => {
                        expect(name).is.equal('Test-Procedure1');
                        done();
                    });
                });
            });
            it('test case: requested attribute not in array', (done) => {
                service.getProcedure('Procedure', response => {
                    expect(response.constructor.name).is.equal(errorResponseAsString);
                    done();
                });
            });
        });
    });
    it('method: initialize()', () => {
        expect(service.initialize({} as InitializeServiceType)).is.true;
        expect(service.initialize({} as InitializeServiceType)).is.false;
    });
});
describe('class: BaseServiceFactory', () => {
    it('method: create()', () => {
        const factory = new BaseServiceFactory();
        expect(factory.create().constructor.name).is.equal('BaseService');
    });
});
