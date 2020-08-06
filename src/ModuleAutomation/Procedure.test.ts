import {expect} from 'chai';
import {BaseProcedureFactory, BaseProcedure} from './Procedure';
import {BaseDataAssembly, DataAssembly} from './DataAssembly';
import {AML} from 'PiMAd-types';
import Attribute = AML.Attribute;
import {BaseParameter, Parameter} from './Parameter';
import {ErrorResponse, SuccessResponse} from '../Backbone/Response';

describe('class: BaseProcedure', () => {
    let procedure: BaseProcedure;
    beforeEach(function () {
        procedure = new BaseProcedure();
    });
    describe('check getter', () => {
        beforeEach(function () {
            const dataAssembly = new BaseDataAssembly();
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
            const parameter = new BaseParameter();
            parameter.initialize('Test-Parameter', [], '')
            const parameter2 = new BaseParameter();
            parameter2.initialize('Test-Parameter2', [], '')
            procedure.initialize(dataAssembly,'Test-Identifier','Test-MetaModelRef','Test-Procedure',attributes, [parameter, parameter2]);

        });
        it('method: getAllAttributes()', () => {
            const response = procedure.getAllAttributes()
            expect(response.length).is.equal(3);
        });
        it('method: getAllParameters()', () => {
            const response = procedure.getAllParameters()
            expect(response.length).is.equal(2);
            expect(response[0].constructor.name).is.equal(new BaseParameter().constructor.name);
        });
        describe('method: getAttribute()', () => {
            it('test case: standard usage', done => {
                procedure.getAttribute('Test-Attribute1', response => {
                    expect(response.constructor.name).is.equal(new SuccessResponse().constructor.name);
                    const responseContent = response.getContent() as Attribute;
                    expect(responseContent.Value).is.equal('1');
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
        expect(typeof factory.create()).is.equal(typeof new BaseProcedure());
    });
});
