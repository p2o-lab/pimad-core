import {Parameter} from './Parameter';
import {Response, ResponseVendor} from '../Backbone/Response';
import {logger} from '../Utils/Logger';

export interface Service {
    getAllCommunicationInterfaceData(): Response; //CommunicationInterfaceData[];
    getAllProcedures(): Response; //Procedure[];
    getAllParameters(): Parameter[];
    getCommunicationInterfaceData(tag: string): Response; //CommunicationInterfaceData;
    getProcedure(tag: string): Response; //Procedure;
    getParameter(tag: string): Response; //Parameter;
    getName(): string;
    initialize(cidata: any[], name: string, stra: any[], para: Parameter[]): boolean;
    //initialize(cidata: CommunicationInterfaceData[], name: string, stra:Procedure[], para: Parameter[]): boolean;
}

abstract class AService implements Service{
    protected ciData: any[]; //CommunicationInterfaceData[];
    protected name: string;
    protected procedures: any[]; //Procedure[];
    protected parameters: Parameter[];
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.ciData= [];
        this.name='';
        this.procedures=[];
        this.parameters = [];
        this.initialized=false;
        this.responseVendor = new ResponseVendor();
    }
    getAllCommunicationInterfaceData(): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getAllProcedures(): Response{
        return this.responseVendor.buyErrorResponse();
        //return this.procedures;
    }
    getAllParameters(): Parameter[]{
        return this.parameters;
    }
    getCommunicationInterfaceData(tag: string): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getProcedure(tag: string): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getParameter(tag: string): Response{
        return this.responseVendor.buyErrorResponse();
    }
    getName(): string {
        return this.name;
    }
    initialize(cidata: any[], name: string, stra: any[], para: Parameter[]): boolean {
        this.ciData=cidata;
        this.name=name;
        this.procedures=stra;
        this.parameters=para;
        this.initialized=true;
        return this.initialized;
    }
}
export class BaseService extends AService {
}

export interface ServiceFactory {
    create(): Service;
}
abstract class AServiceFactory implements ServiceFactory {
    abstract create(): Service;
}
export class BaseServiceFactory extends AServiceFactory {
    create(): Service{
        const service = new BaseService();
        logger.debug(this.constructor.name + ' creates a ' + service.constructor.name);
        return service;}
}
