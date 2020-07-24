import {BaseServiceFactory, BaseService} from './Service';
import {expect} from 'chai';
import {ErrorResponse} from '../Backbone/Response';
import {BaseParameter} from './Parameter';
import {BaseDataAssembly, DataAssembly} from './DataAssembly';
import {Attribute} from 'AML';
import {BaseProcedure} from './Procedure';

describe('class: BaseService', () => {
    let service: BaseService;
    beforeEach(function () {
        service = new BaseService();
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
            parameter.initialize('Test-Parameter', [], '');
            const parameter2 = new BaseParameter();
            parameter2.initialize('Test-Parameter2', [], '');
            const procedure0 = new BaseProcedure();
            procedure0.initialize({} as DataAssembly, '','', 'Test-Procedure0', [],[]);
            const procedure1 = new BaseProcedure();
            procedure1.initialize({} as DataAssembly, '','', 'Test-Procedure1', [],[]);
            service.initialize(attributes, dataAssembly,'Test-Identifier','Test-MetaModelRef','Test-Name', [parameter, parameter2], [procedure0, procedure1]);
        });
        it('method: getMetaModelRef()', () => {
            expect(JSON.stringify(service.getMetaModelReference().getContent())).is.equal(JSON.stringify({data: 'Test-MetaModelRef'}));
        });
        it('method: getName()', () => {
            expect(JSON.stringify(service.getName().getContent())).is.equal(JSON.stringify({data: 'Test-Name'}));
        });
    })
    /*it('method: getAllCommunicationInterfaceData()', () => {
        expect(typeof service.getAllCommunicationInterfaceData()).is.equal(typeof new ErrorResponse());
    });
    it('method: getAllProcedures()', () => {
        expect(typeof service.getAllProcedures()).is.equal(typeof new ErrorResponse());
    });
    it('method: getAllParameters()', () => {
        expect(typeof service.getAllParameters()).is.equal(typeof new BaseParameter());
    });
    it('method: getCommunicationInterfaceData()', () => {
        expect(typeof service.getCommunicationInterfaceData('')).is.equal(typeof new ErrorResponse());
    });
    it('method: getProcedure()', () => {
        expect(typeof service.getProcedure('')).is.equal(typeof new ErrorResponse());
    });
    it('method: getParameter()', () => {
        expect(typeof service.getParameter('')).is.equal(typeof new ErrorResponse());
    });
    it('method: getName()', () => {
        expect(typeof service.getName()).is.equal(typeof '');
    }); */
    it('method: initialize()', () => {
        expect(service.initialize([], {} as DataAssembly, '', '', '', [], [])).is.true;
        expect(service.initialize([], {} as DataAssembly, '', '', '', [], [])).is.false;
    });
});
describe('class: BaseServiceFactory', () => {
    it('method: create()', () => {
        const factory = new BaseServiceFactory();
        expect(typeof factory.create()).is.equal(typeof new BaseService());
    });
});
