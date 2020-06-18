import {logger} from '../Utils/Logger';
import {Parameter} from './Parameter';


export interface Procedure {
    getAllParameters(): Parameter[];
    getID(): number;
    getName(): string;
    getDefault(): boolean;
    getSc(): boolean;
    getParameter(tag: string): Parameter;
    initialize(id: number, name: string, def: boolean, sc: boolean, para: Parameter[]): boolean;
}

abstract class AProcedure implements Procedure {
    protected id: number;
    protected name: string;
    protected default: boolean;
    protected sc: boolean;
    protected parameters: Parameter[];
    protected initialized: boolean;

    constructor() {
        this.id= 0;
        this.name= '';
        this.default= false;
        this.sc = false;
        this.parameters= [];
        this.initialized= false;
    }
    getAllParameters(): Parameter[] {
        return this.parameters;
    }
    getID(): number {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getDefault(): boolean {
        return this.default;
    }
    getSc(): boolean {
        return this.sc;
    }
    getParameter(tag: string): Parameter {
        return this.parameters[0];
    }

    initialize(id: number, name: string, def: boolean, sc: boolean, para: Parameter[]): boolean {
        //add INIT-Operations here
        this.id= id;
        this.name= name;
        this.default= def;
        this.sc = sc;
        this.parameters= para;
        this.initialized=true;
    return this.initialized;
    }
}

export class BaseProcedure extends AProcedure {
}

export interface ProcedureFactory {
    create(): Procedure;
}
abstract class AProcedureFactory implements ProcedureFactory {
    abstract create(): Procedure;
}
export class BaseProcedureFactory extends AProcedureFactory {
    create(): Procedure{
            const procedure = new BaseProcedure();
            logger.debug(this.constructor.name + ' creates a ' + procedure.constructor.name);
        return procedure;}
}
