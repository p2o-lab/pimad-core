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
    it('method: initialize(firstChainElement: Importer)', () => {
        // TODO > Generate test data
        expect(pea.initialize({} as BasePEAInitializeDataType)).is.true;
        expect(pea.initialize({} as BasePEAInitializeDataType)).is.false;
    });
    describe('check getter', () => {
        beforeEach(function () {

            let dataAssemblies= Array.of(new BaseDataAssembly());
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
            dataAssemblies.push(dataAssembly1,dataAssembly2);

            let services = Array.of(new BaseService());
            const service = new BaseService();
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
            service.initialize(attributes, dataAssembly1,'Test-Identifier','Test-MetaModelRef','Test-Service1', [parameter, parameter2], [procedure0, procedure1]);
            services.push(service);

            pea.initialize({
                DataAssemblies: dataAssemblies,
                DataModel:'',
                DataModelVersion: new BasicSemanticVersion(),
                FEAs:[],
                Name:'',
                Services:services
            } as BasePEAInitializeDataType);
        });
        describe('method: getAllActuators()', () => {
            it('test case: standard usage', done => {
                pea.getAllActuators( response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        it('method: getAllFEAs()', () => {
            const response = pea.getAllFEAs().getContent() as {data: FEA[]};
            expect(response.data.length).is.equal(0);
        });
        it('method: getAllDataAssemblies()', () => {
            const response = pea.getAllDataAssemblies().getContent() as {data: DataAssembly[]};
            expect(response.data.length).is.equal(2);
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
        describe('method: getActuator()', () => {
            it('test case: standard usage', done => {
                pea.getActuator('Test-Actuator1', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getFEA()', () => {
            it('test case: standard usage', done => {
                pea.getFEA('Test-FEA1', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
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
        describe('method: getSensor()', () => {
            it('test case: standard usage', done => {
                pea.getActuator('Test-Sensor1', response => {
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
                    expect(responseContent.getName()).is.equal('Test-Service1');
                    done();
                })
            });
            it('test case: requested Service not in array', (done) => {
                pea.getDataAssembly('Service', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
    });
});
describe('class: BasePEAFactory', () => {
    it('method: create()', () => {
        const factory = new BasePEAFactory();
        expect(typeof factory.create()).is.equal(typeof new BasePEA())
    });
})
