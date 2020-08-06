import {BaseServiceFactory, BaseParameterFactory, BaseProcedureFactory, Service} from '../../src/ModuleAutomation';
import {expect} from 'chai';
import {Parameter} from '../../src/ModuleAutomation';
import {DataAssembly} from '../../src/ModuleAutomation';
import {AML} from 'PiMAd-types';
import Attribute = AML.Attribute;
import {ErrorResponse, SuccessResponse} from '../../src/Backbone/Response';
import {BaseDataAssemblyFactory} from '../../build/ModuleAutomation';

describe('class: BaseService', () => {
    let service: Service;
    const serviceFactory = new BaseServiceFactory();
    beforeEach(function () {
        service = serviceFactory.create();
    });
    describe('check getter', () => {
        beforeEach(function () {
            const dataAssembly = new BaseDataAssemblyFactory().create();
            dataAssembly.initialize({
                tag: 'Test-DataAssembly',
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
            service.initialize(attributes, dataAssembly,'Test-Identifier','Test-MetaModelRef','Test-Name', [parameter, parameter2], [procedure0, procedure1]);
        });
        describe('method: getAttribute()', () => {
            it('test case: standard usage', done => {
                service.getAttribute('Test-Attribute1', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Attribute;
                    expect(responseContent.Value).is.equal('1');
                    done();
                })
            });
            it('test case: requested attribute not in array', () => {
                service.getAttribute('Attribute', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                })
            });
        })
        it('method: getAllAttributes()', () => {
            const response = service.getAllAttributes().getContent() as {data: Attribute[]}
            expect(response.data.length).is.equal(3);
        })
        it('method: getAllParameters()', () => {
            const response = service.getAllParameters().getContent() as {data: Parameter[]}
            expect(response.data.length).is.equal(2);

        })
        it('method: getAllProcedures()', () => {
            const response = service.getAllProcedures().getContent() as {data: Attribute[]}
            expect(response.data.length).is.equal(2);
        })
        it('method: getDataAssembly()', () => {
            expect((service.getDataAssembly().getContent() as {data: DataAssembly}).data.getTagName()).is.equal('Test-DataAssembly');
        });
        it('method: getMetaModelRef()', () => {
            expect(JSON.stringify(service.getMetaModelReference().getContent())).is.equal(JSON.stringify({data: 'Test-MetaModelRef'}));
        });
        it('method: getName()', () => {
            expect(service.getName()).is.equal('Test-Name');
        });
        describe('method: getParameter()', () => {
            it('test case: standard usage', done => {
                service.getParameter('Test-Parameter1', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Parameter;
                    expect(responseContent.getName()).is.equal('Test-Parameter1');
                    done();
                })
            });
            it('test case: requested attribute not in array', (done) => {
                service.getParameter('Parameter', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getProcedure()', () => {
            it('test case: standard usage', done => {
                service.getProcedure('Test-Procedure1', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Parameter;
                    expect(responseContent.getName()).is.equal('Test-Procedure1');
                    done();
                })
            });
            it('test case: requested attribute not in array', (done) => {
                service.getParameter('Procedure', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        });
    })
    it('method: initialize()', () => {
        expect(service.initialize([], {} as DataAssembly, '', '', '', [], [])).is.true;
        expect(service.initialize([], {} as DataAssembly, '', '', '', [], [])).is.false;
    });
});
describe('class: BaseServiceFactory', () => {
    it('method: create()', () => {
        const factory = new BaseServiceFactory();
        expect(factory.create().constructor.name).is.equal('BaseService');
    });
});
