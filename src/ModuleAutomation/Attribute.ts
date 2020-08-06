import {logger} from '../Utils/Logger';
import {ResponseVendor, Response} from '../Backbone/Response';

export interface Attribute {
    getDataType(): Response;
    initialize(data: InitializeAttribute): boolean;
}

abstract class AAttribute implements Attribute {
    private dataType: string;
    private name: string;
    private initialized: boolean;
    private responseVendor: ResponseVendor;
    private value: string;

    getDataType(): Response {
        let response: Response;
        if(this.initialized) {
            response = this.responseVendor.buySuccessResponse();
            response.initialize('Success!', {data: this.dataType});
        } else {
            response = this.responseVendor.buyErrorResponse();
            response.initialize('Attribute is not initialized!', {});
        }
        return response;
    }

    initialize(data: InitializeAttribute): boolean {
        if(!this.initialized) {
            this.dataType = data.DataType;
            this.name = data.Name;
            this.value = data.Value;
            this.initialized = (this.dataType === data.DataType && this.name === data.Name && this.value === data.Value);
            return this.initialized;
        } else {
            return false;
        }
    };

    constructor() {
        this.dataType = 'dataType: undefined';
        this.name = 'name: undefined';
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
        this.value = 'value: undefined';
    }
}

class ServiceAttribute extends AAttribute {
    initialize(data: InitializeServiceAttribute): boolean {
        return super.initialize(data);
    };
}

class ProcedureAttribute extends AAttribute {
    initialize(data: InitializeProcedureAttribute): boolean {
        return super.initialize(data);
    };
}

/* Factories */

export interface AttributeFactory {
    create(): Attribute;
}

abstract class AAttributeFactory implements AttributeFactory {
    abstract create(): Attribute;
}

class ServiceAttributeFactory extends AAttributeFactory {
    public create(): Attribute {
        const localeAttribute = new ServiceAttribute();
        logger.debug(this.constructor.name + ' creates a ' + localeAttribute.constructor.name);
        return localeAttribute;
    }
}

class ProcedureAttributeFactory extends AAttributeFactory {
    public create(): Attribute {
        const localeAttribute = new ProcedureAttribute();
        logger.debug(this.constructor.name + ' creates a ' + localeAttribute.constructor.name);
        return localeAttribute;
    }
}

export class AttributeFactoryVendor {
    public buyServiceAttributeFactory(): AttributeFactory {
        const localAttributeFactory = new ServiceAttributeFactory();
        logger.debug(this.constructor.name + ' sells a ' + localAttributeFactory.constructor.name);
        return localAttributeFactory;
    };
    public buyProcedureAttributeFactory(): AttributeFactory {
        const localAttributeFactory = new ProcedureAttributeFactory();
        logger.debug(this.constructor.name + ' sells a ' + localAttributeFactory.constructor.name);
        return localAttributeFactory;
    };
}

/* types */

export type InitializeAttribute = {
    DataType: string;
    Name: string;
    Value: string;
}

export type InitializeServiceAttribute = InitializeAttribute & {

}

export type InitializeProcedureAttribute = InitializeAttribute & {

}