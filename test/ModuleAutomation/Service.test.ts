import {
    Attribute,
    AttributeFactoryVendor,
    BaseParameterFactory,
    BaseProcedureFactory,
    ModuleAutomation,
    Parameter,
    Service
} from '../../src/ModuleAutomation';
import {expect} from 'chai';
import {Backbone} from '../../src/Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import DataAssemblyVendor = ModuleAutomation.DataAssemblyVendor;
import DataAssemblyType = ModuleAutomation.DataAssemblyType;
import DataAssembly = ModuleAutomation.DataAssembly;
import {v4 as uuidv4} from 'uuid';
import {BaseServiceFactory} from '../../src/ModuleAutomation/Service';

const responseVendor = new PiMAdResponseVendor();
const dataAssemblyVendor = new DataAssemblyVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name

describe('class: BaseService', () => {
    let service: Service;
    const serviceFactory = new BaseServiceFactory();
    beforeEach(function () {
        service = serviceFactory.create();
    });
    describe('check getter', () => {
        beforeEach(function () {
            const dataAssembly = dataAssemblyVendor.buy(DataAssemblyType.BASIC)
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
            procedure0.initialize({} as DataAssembly, '','', 'Test-Procedure0', [],[]);
            const procedure1 = procedureFactory.create();
            procedure1.initialize({} as DataAssembly, '','', 'Test-Procedure1', [],[]);
            service.initialize(attributes, dataAssembly,'Test-Identifier','Test-MetaModelRef','Test-Name', [parameter, parameter2], uuidv4() ,[procedure0, procedure1]);
        });
        describe('method: getAttribute()', () => {
            it('test case: standard usage', done => {
                service.getAttribute('Test-Attribute1', response => {
                    expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Attribute;
                    expect((responseContent.getValue().getContent() as {data: string}).data).is.equal('1');
                    done();
                })
            });
            it('test case: requested attribute not in array', () => {
                service.getAttribute('Attribute', response => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
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
            (service.getDataAssembly().getContent() as {data: DataAssembly}).data.getName((response, name) => {
                expect(name).equals('Test-DataAssembly')
            });
        });
        it('method: getMetaModelRef()', (done) => {
            service.getMetaModelRef((response, metaModelRef) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(metaModelRef).is.equal('Test-MetaModelRef');
                done()
            })
        });
        it('method: getName()', (done) => {
            service.getName((response, name) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(name).is.equal('Test-Name');
                done()
            });
        });
        describe('method: getParameter()', () => {
            it('test case: standard usage', done => {
                service.getParameter('Test-Parameter1', response => {
                    expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Parameter;
                    expect(responseContent.getName()).is.equal('Test-Parameter1');
                    done();
                })
            });
            it('test case: requested attribute not in array', (done) => {
                service.getParameter('Parameter', response => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                })
            });
        });
        describe('method: getProcedure()', () => {
            it('test case: standard usage', done => {
                service.getProcedure('Test-Procedure1', response => {
                    expect(response.constructor.name).is.equal(responseVendor.buySuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Parameter;
                    expect(responseContent.getName()).is.equal('Test-Procedure1');
                    done();
                })
            });
            it('test case: requested attribute not in array', (done) => {
                service.getParameter('Procedure', response => {
                    expect(response.constructor.name).is.equal(responseVendor.buyErrorResponse().constructor.name);
                    done();
                })
            });
        });
    })
    it('method: initialize()', () => {
        expect(service.initialize([], {} as DataAssembly, '', '', '', [],'',[])).is.true;
        expect(service.initialize([], {} as DataAssembly, '', '', '', [],'',[])).is.false;
    });
});
describe('class: BaseServiceFactory', () => {
    it('method: create()', () => {
        const factory = new BaseServiceFactory();
        expect(factory.create().constructor.name).is.equal('BaseService');
    });
});
