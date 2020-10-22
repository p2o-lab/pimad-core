import {logger} from '../Utils';
import {Backbone} from '../Backbone';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;
import PiMAdResponse = Backbone.PiMAdResponse;

export interface Attribute {
    getDataType(): PiMAdResponse;
    getName(): PiMAdResponse;
    getValue(): PiMAdResponse;
    initialize(data: InitializeAttribute): boolean;
}

enum AttributeGetterVariables {
    DATATYPE,
    NAME,
    VALUE
}

abstract class AAttribute implements Attribute {
    private dataType: string;
    private name: string;
    private initialized: boolean;
    private responseVendor: PiMAdResponseVendor;
    private value: string;

    private getter(variable: AttributeGetterVariables): PiMAdResponse {
        let response: PiMAdResponse;
        if(this.initialized) {
            response = this.responseVendor.buySuccessResponse();
            switch (variable) {
                case AttributeGetterVariables.DATATYPE:
                    response.initialize('Success!', {data: this.dataType});
                    break;
                case AttributeGetterVariables.NAME:
                    response.initialize('Success!', {data: this.name});
                    break;
                case AttributeGetterVariables.VALUE:
                    response.initialize('Success!', {data: this.value});
                    break;
            }
        } else {
            response = this.responseVendor.buyErrorResponse();
            response.initialize('Attribute is not initialized!', {});
        }
        return response;
    }

    getDataType(): PiMAdResponse {
        return this.getter(AttributeGetterVariables.DATATYPE);
    }

    getName(): PiMAdResponse {
        return this.getter(AttributeGetterVariables.NAME);
    }

    getValue(): PiMAdResponse {
        return this.getter(AttributeGetterVariables.VALUE);
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
    }

    constructor() {
        this.dataType = 'dataType: undefined';
        this.name = 'name: undefined';
        this.initialized = false;
        this.responseVendor = new PiMAdResponseVendor();
        this.value = 'value: undefined';
    }
}

class ServiceAttribute extends AAttribute {
    initialize(data: InitializeServiceAttribute): boolean {
        return super.initialize(data);
    }
}

class ProcedureAttribute extends AAttribute {
    initialize(data: InitializeProcedureAttribute): boolean {
        return super.initialize(data);
    }
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
    }
    public buyProcedureAttributeFactory(): AttributeFactory {
        const localAttributeFactory = new ProcedureAttributeFactory();
        logger.debug(this.constructor.name + ' sells a ' + localAttributeFactory.constructor.name);
        return localAttributeFactory;
    }
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
