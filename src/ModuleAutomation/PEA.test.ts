import {BasePEAFactory, BasePEA, BasePEAInitializeDataType} from './PEA';
import {expect} from 'chai';
import {ErrorResponse, SuccessResponse} from '../Backbone/Response';
import {BaseDataAssembly, DataAssembly} from './DataAssembly';
import {BaseParameter} from './Parameter';
import {BaseProcedure} from './Procedure';
import {BasicSemanticVersion, SemanticVersion} from '../Backbone/SemanticVersion';
import {FEA} from './FEA';
import {BaseService, Service} from './Service';
import {AML} from 'PiMAd-types';
import Attribute = AML.Attribute;


describe('class: BasePEA', () => {
    let pea: BasePEA;
    beforeEach(function () {
        pea = new BasePEA();
    });
    describe('check getter', () => {
        beforeEach(function () {

            const dataAssembly1= new BaseDataAssembly();
            dataAssembly1.initialize({
                tag: 'Test-DataAssembly1',
                description: '',
                metaModelRef: '',
                identifier: '',
                dataItems: []
            });
            const dataAssembly2= new BaseDataAssembly();
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
            const parameter = new BaseParameter();
            parameter.initialize('Test-Parameter0', [], '');
            const parameter2 = new BaseParameter();
            parameter2.initialize('Test-Parameter1', [], '');
            const procedure0 = new BaseProcedure();
            procedure0.initialize({} as DataAssembly, '','', 'Test-Procedure0', [],[]);
            const procedure1 = new BaseProcedure();
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
                Identifier: 'Test-Identifier',
                Services:[service1]
            } as BasePEAInitializeDataType);
        });
        describe('method: getActuator()', () => {
            it('test case: standard usage', done => {
                pea.getActuator('Test-Actuator1', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getAllActuators()', () => {
            it('test case: standard usage', done => {
                pea.getAllActuators( response => {
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
                pea.getAllSensors( response => {
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
                pea.getDataAssembly('Test-DataAssembly2', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as DataAssembly;
                    expect(responseContent.getTagName()).is.equal('Test-DataAssembly2');
                    done();
                })
            });
            it('test case: requested DataAssembly not in array', (done) => {
                pea.getDataAssembly('DataAssembly', response => {
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
                pea.getFEA('Test-FEA1', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        it('method: getName()', () => {
            expect(pea.getName()).is.equal('Test-PEA');
        });
        it('method: getIdentifier()', () => {
            expect(pea.getIdentifier()).is.equal('Test-Identifier');
        });
        describe('method: getSensor()', () => {
            it('test case: standard usage', done => {
                pea.getSensor('Test-Sensor1', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getService()', () => {
            it('test case: standard usage', done => {
                pea.getService('Test-Service1', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Service;
                    expect(JSON.stringify(responseContent.getName().getContent())).is.equal(JSON.stringify({data: 'Test-Service1'}));
                    done();
                })
            });
            it('test case: requested Service not in array', (done) => {
                pea.getService('Service', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
    });
    it('method: initialize(firstChainElement: Importer)', () => {
        expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], Name:'', Services:[{} as Service]} as BasePEAInitializeDataType)).is.true;
        expect(pea.initialize({DataAssemblies: [{} as DataAssembly], DataModel: '', DataModelVersion: {} as SemanticVersion, FEAs:[{} as FEA], Name:'', Services:[{} as Service]} as BasePEAInitializeDataType)).is.false;

    });
});
describe('class: BasePEAFactory', () => {
    it('method: create()', () => {
        const factory = new BasePEAFactory();
        expect(typeof factory.create()).is.equal(typeof new BasePEA())
    });
});
