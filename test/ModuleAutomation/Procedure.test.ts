import {expect} from 'chai';
import {
    BaseProcedureFactory,
    BaseParameterFactory,
    Procedure,
    AttributeFactoryVendor, Attribute
} from '../../src/ModuleAutomation';
import {DataAssembly} from '../../src/ModuleAutomation';
import {Parameter} from '../../src/ModuleAutomation';
import {ErrorResponse, SuccessResponse} from '../../src/Backbone/Response';
import {BaseDataAssemblyFactory} from '../../build/ModuleAutomation';

describe('class: BaseProcedure', () => {
    let procedure: Procedure;
    const procedureFactory = new BaseProcedureFactory();
    beforeEach(function () {
        procedure = procedureFactory.create();
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
            parameter.initialize('Test-Parameter', [], '')
            const parameter2 = parameterFactory.create();
            parameter2.initialize('Test-Parameter2', [], '')
            procedure.initialize(dataAssembly,'Test-Identifier','Test-MetaModelRef','Test-Procedure', attributes, [parameter, parameter2]);

        });
        it('method: getAllAttributes()', () => {
            const response = procedure.getAllAttributes()
            expect(response.length).is.equal(3);
        });
        it('method: getAllParameters()', () => {
            const response = procedure.getAllParameters()
            expect(response.length).is.equal(2);
            expect(response[0].constructor.name).is.equal(new BaseParameterFactory().create().constructor.name);
        });
        describe('method: getAttribute()', () => {
            it('test case: standard usage', done => {
                procedure.getAttribute('Test-Attribute1', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Attribute;
                    expect((responseContent.getValue().getContent() as {data: string}).data).is.equal('1');
                    done();
                })
            });
            it('test case: requested attribute not in array', () => {
                procedure.getAttribute('Attribute', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                })
            });
        })
        it('method: getDataAssembly()', () => {
            expect(procedure.getDataAssembly().getTagName()).is.equal('Test-DataAssembly');
        });
        it('method: getIdentifier()', () => {
            expect(procedure.getIdentifier()).is.equal('Test-Identifier');
        });
        it('method: getName()', () => {
            expect(procedure.getName()).is.equal('Test-Procedure');
        });
        it('method: getMetaModelRef()', () => {
            expect(procedure.getMetaModelRef()).is.equal('Test-MetaModelRef');
        });
        describe('method: getParameter()', () => {
            it('test case: standard usage', done => {
                procedure.getParameter('Test-Parameter2', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Parameter;
                    expect(responseContent.getName()).is.equal('Test-Parameter2');
                    done();
                })
            });
            it('test case: requested attribute not in array', (done) => {
                procedure.getParameter('Parameter', response => {
                    expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
                    done();
                })
            });
        })
    })
    it('method: initialize()', () => {
        expect(procedure.initialize({} as DataAssembly,'','','',[], [])).is.true;
        expect(procedure.initialize({} as DataAssembly,'','','',[], [])).is.false;
    });
});
describe('class: BaseProcedureFactory', () => {
    it('method: create()', () => {
        const factory = new BaseProcedureFactory();
        expect(factory.create().constructor.name).is.equal('BaseProcedure');
    });
});
