import {BasePEAFactory, BaseProcedureFactory} from '../../src/ModuleAutomation';
import {expect} from 'chai';
import {ErrorResponse, SuccessResponse} from '../../src/Backbone/Response';
import {DataAssembly} from '../../src/ModuleAutomation';
import {BasicSemanticVersion, SemanticVersion} from '../../src/Backbone/SemanticVersion';
import {FEA} from '../../src/ModuleAutomation';
import {BaseService, Service} from '../../src/ModuleAutomation';
import {AML} from 'PiMAd-types';
import Attribute = AML.Attribute;
import {BaseDataAssemblyFactory, BaseParameterFactory} from '../../build/ModuleAutomation';
import { PEAInitializeDataType, PEA } from '../../src/ModuleAutomation/PEA';
import { Response } from '../../src/Backbone/Response'

describe('class: BasePEA', () => {
    let pea: PEA;
    const peaFactory = new BasePEAFactory();
    beforeEach(function () {
        pea = peaFactory.create();
    });
    describe('check getter', () => {
        const basePEAFactory = new BaseDataAssemblyFactory();
        beforeEach(function () {
            const dataAssembly1= basePEAFactory.create();
            dataAssembly1.initialize({
                tag: 'Test-DataAssembly1',
                description: '',
                metaModelRef: '',
                identifier: '',
                dataItems: []
            });
            const dataAssembly2= basePEAFactory.create();
            dataAssembly2.initialize({
                tag: 'Test-DataAssembly2',
                description: '',
                metaModelRef: '',
                identifier: '',
                dataItems: []
            });

            const attributes: Attribute[] = [
                {Name: 'Test-Attribute0', AttributeDataType: '', Value:''},
                {Name: 'Test-Attribute1', AttributeDataType: '', Value:'1'},
                {Name: 'Test-Attribute2', AttributeDataType: '', Value:''}
            ];
            const parameterFactory = new BaseParameterFactory();
            const parameter = parameterFactory.create();
            parameter.initialize('Test-Parameter0', [], '');
            const parameter2 = parameterFactory.create();
            parameter2.initialize('Test-Parameter1', [], '');
            const procedureFactory = new BaseProcedureFactory();
            const procedure0 = procedureFactory.create();
            procedure0.initialize({} as DataAssembly, '','', 'Test-Procedure0', [],[]);
            const procedure1 = procedureFactory.create();
            procedure1.initialize({} as DataAssembly, '','', 'Test-Procedure1', [],[]);

            const service1 = new BaseService();
            service1.initialize(attributes, dataAssembly1,'Test-Identifier1','Test-MetaModelRef1','Test-Service1', [parameter, parameter2], [procedure0, procedure1]);
            const service2 = new BaseService();
            service2.initialize(attributes, dataAssembly1,'Test-Identifier2','Test-MetaModelRef2','Test-Service2', [parameter], [procedure1]);

            pea.initialize({
                DataAssemblies: [dataAssembly1,dataAssembly2],
                DataModel:'Test-DataModelRef',
                DataModelVersion: new BasicSemanticVersion(),
                FEAs:[],
                Name:'Test-PEA',
                PiMAdIdentifier: 'Test-Identifier',
                Services:[service1]
            } as PEAInitializeDataType);
        });
        describe('method: getActuator()', () => {
            it('test case: standard usage', done => {
                pea.getActuator('Test-Actuator1', (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getAllActuators()', () => {
            it('test case: standard usage', done => {
                pea.getAllActuators( (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
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
                pea.getAllSensors( (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        it('method: getAllServices()', () => {
            const response = pea.getAllServices().getContent() as {data: Service[]};
            expect(response.data.length).is.equal(1);
        });
        describe('method: getDataAssembly()', () => {
            it('test case: standard usage', done => {
                pea.getDataAssembly('Test-DataAssembly2', (response: Response) => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as DataAssembly;
                    expect(responseContent.getTagName()).is.equal('Test-DataAssembly2');
                    done();
                })
            });
            it('test case: requested DataAssembly not in array', (done) => {
                pea.getDataAssembly('DataAssembly', (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
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
                pea.getFEA('Test-FEA1', (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        it('method: getName()', () => {
            expect(pea.getName()).is.equal('Test-PEA');
        });
        it('method: getIdentifier()', () => {
            expect(pea.getPiMAdIdentifier()).is.equal('Test-Identifier');
        });
        describe('method: getSensor()', () => {
            it('test case: standard usage', done => {
                pea.getSensor('Test-Sensor1', (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getService()', () => {
            it('test case: standard usage', done => {
                pea.getService('Test-Service1', (response: Response) => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Service;
                    expect(responseContent.getName()).is.equal('Test-Service1');
                    done();
                })
            });
            it('test case: requested Service not in array', (done) => {
                pea.getService('Service', (response: Response) => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
    });
    describe('method: initialize', () => {
        it('normal behavior', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as Service]} as PEAInitializeDataType)).is.true;
        });
        it('initializing twice', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as Service]} as PEAInitializeDataType)).is.true;
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as Service]} as PEAInitializeDataType)).is.false;
        });
        it('initializing with missing data', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], Name:'', Services:[{} as Service]} as PEAInitializeDataType)).is.false;
        });
        it('second initializing try after failing the first one', () => {
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], Name:'', Services:[{} as Service]} as PEAInitializeDataType)).is.false;
            expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], PiMAdIdentifier: '', Name:'', Services:[{} as Service]} as PEAInitializeDataType)).is.true;
        });
    })
});
describe('class: BasePEAFactory', () => {
    it('method: create()', () => {
        const factory = new BasePEAFactory();
        expect(factory.create().constructor.name).is.equal('BasePEA');
    });
});
