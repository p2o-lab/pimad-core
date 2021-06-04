import {
    Attribute,
    AttributeFactoryVendor,
    BaseParameterFactory,
    BasePEAFactory,
    BaseProcedureFactory,
    FEA,
    ModuleAutomation,
    ServiceModel,
    Services,
    ServiceVendor
} from './index';
import {expect} from 'chai';
import {Backbone, BasicSemanticVersion, SemanticVersion} from '../Backbone';
import {PEAModel, PEAInitializeDataType} from './PEAModel';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;
import DataAssembly = ModuleAutomation.DataAssembly;
import {v4 as uuidv4} from 'uuid';

const responseVendor = new PiMAdResponseVendor();
const dataAssemblyVendor = new DataAssemblyVendor();

describe('class: BasePEA', () => {
    let pea: PEAModel;
    const peaFactory = new BasePEAFactory();
    beforeEach(function () {
        pea = peaFactory.create();
    });
    describe('check getter', () => {
        beforeEach(function () {
            const dataAssembly1= dataAssemblyVendor.buy(DataAssemblyType.BASIC);
            dataAssembly1.initialize({
                tag: 'Test-DataAssembly1',
                description: '',
                metaModelRef: '',
                identifier: '',
                dataItems: []
            });
            const dataAssembly2= dataAssemblyVendor.buy(DataAssemblyType.BASIC);
            dataAssembly2.initialize({
                tag: 'Test-DataAssembly2',
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
                name: 'Test-Procedure0',
                attributes: [],
                parameter: [],
                pimadIdentifier: uuidv4()
            });
            const procedure1 = procedureFactory.create();
            procedure1.initialize({
                dataAssembly: {} as DataAssembly,
                dataSourceIdentifier: '',
                metaModelRef: '',
                name: 'Test-Procedure1',
                attributes: [],
                parameter: [],
                pimadIdentifier: uuidv4()
            });
            const serviceVendor = new ServiceVendor();

            const service1 = serviceVendor.buy(Services.BaseService);
            service1.initialize({
                attributes: attributes,
                dataAssembly: dataAssembly1,
                dataSourceIdentifier: 'Test-DataSourceIdentifier1',
                metaModelRef: 'Test-MetaModelRef1',
                name: 'Test-Service1',
                parameter: [parameter, parameter2],
                pimadIdentifier: 'Test-PiMAdIdentifier1',
                procedure: [procedure0, procedure1]
            });
            const service2 = serviceVendor.buy(Services.BaseService);
            service2.initialize({
                attributes: attributes,
                dataAssembly: dataAssembly1,
                dataSourceIdentifier: 'Test-DataSourceIdentifier2',
                metaModelRef: 'Test-MetaModelRef2',
                name: 'Test-Service2',
                parameter: [parameter],
                pimadIdentifier: 'Test-PiMAdIdentifier2',
                procedure: [procedure1]
            });

            pea.initialize({
                DataAssemblies: [dataAssembly1,dataAssembly2],
                DataModel:'Test-DataModelRef',
                DataModelVersion: new BasicSemanticVersion(),
                FEAs:[],
                Name:'Test-PEAModel',
                PiMAdIdentifier: 'Test-Identifier',
                Services:[service1, service2],
                Endpoint:[]
            } as PEAInitializeDataType);
        });
        describe('method: getActuator()', () => {
            it('test case: standard usage', done => {
                pea.getActuator('Test-Actuator1', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
        describe('method: getAllActuators()', () => {
            it('test case: standard usage', done => {
                pea.getAllActuators( (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
        it('method: getAllDataAssemblies()', () => {
            const response = pea.getAllDataAssemblies().getContent() as {data: DataAssembly[]};
            expect(response.data.length).is.equal(2);
        });
        it('method: getAllFEAs()', () => {
            const response = pea.getAllFEAs().getContent() as {data: FEA[]};
            expect(response.data.length).is.equal(0);
        });
        describe('method: getAllSensors()', () => {
            it('test case: standard usage', done => {
                pea.getAllSensors( (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
        it('method: getAllServices()', () => {
            const response = pea.getAllServices().getContent() as {data: ServiceModel[]};
            expect(response.data.length).is.equal(2);
        });
        describe('method: getDataAssembly()', () => {
            it('test case: standard usage', done => {
                pea.getDataAssembly('Test-DataAssembly2', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                    const responseContent = response.getContent() as DataAssembly;
                    responseContent.getName((response, name) =>  {
                        expect(name).is.equal('Test-DataAssembly2');
                    });
                    done();
                });
            });
            it('test case: requested DataAssembly not in array', (done) => {
                pea.getDataAssembly('DataAssembly', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
        it('method: getDataModel()', () => {
            expect(JSON.stringify(pea.getDataModel().getContent())).is.equal(JSON.stringify({data: 'Test-DataModelRef'}));
        });
        it('method: getDataVersion()', () => {
            expect(JSON.stringify(pea.getDataModelVersion().getContent())).is.equal(JSON.stringify({data: new BasicSemanticVersion()}));
        });
        describe('method: getFEA()', () => {
            it('test case: standard usage', done => {
                pea.getFEA('Test-FEA1', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
        it('method: getName()', () => {
            expect(pea.getName()).is.equal('Test-PEAModel');
        });
        it('method: getIdentifier()', () => {
            expect(pea.getPiMAdIdentifier()).is.equal('Test-Identifier');
        });
        describe('method: getSensor()', () => {
            it('test case: standard usage', done => {
                pea.getSensor('Test-Sensor1', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
        describe('method: getService()', () => {
            it('test case: standard usage', done => {
                const services: ServiceModel[] = (pea.getAllServices().getContent() as {data: ServiceModel[]}).data;
                services[1].getPiMAdIdentifier((responsePiMAdIdentifier, identifier) => {
                    pea.getService(identifier as string, (responseGetService) => {
                        expect(responseGetService.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                        const responseContent = responseGetService.getContent() as ServiceModel;
                        responseContent.getName((responsGetName, name) => {
                            expect(name).is.equal('Test-Service2');
                            done();
                        });
                    });
                });
            });
            it('test case: requested ServiceModel not in array', (done) => {
                pea.getService('Service', (response) => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                });
            });
        });
    });
    describe('method: initialize', () => {
        it('normal behavior', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as ServiceModel]} as PEAInitializeDataType)).is.true;
        });
        it('initializing twice', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as ServiceModel]} as PEAInitializeDataType)).is.true;
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as ServiceModel]} as PEAInitializeDataType)).is.false;
        });
        it('initializing with missing data', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], Name:'', Services:[{} as ServiceModel]} as PEAInitializeDataType)).is.false;
        });
        it('second initializing try after failing the first one', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], Name:'', Services:[{} as ServiceModel]} as PEAInitializeDataType)).is.false;
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as ServiceModel]} as PEAInitializeDataType)).is.true;
        });
    });
});
describe('class: BasePEAFactory', () => {
    it('method: create()', () => {
        const factory = new BasePEAFactory();
        expect(factory.create().constructor.name).is.equal('BasePEA');
    });
});
