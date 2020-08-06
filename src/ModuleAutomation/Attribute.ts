import {logger} from '../Utils/Logger';

export interface Attribute {
    initialize(data: InitializeAttribute): boolean;
}

abstract class AAttribute implements Attribute {
    initialize(data: InitializeAttribute): boolean {
        return false;
    };
}

class ServiceAttribute extends AAttribute {
    initialize(data: InitializeServiceAttribute): boolean {
        super.initialize(data);
        return false;
    };
}

class ProcedureAttribute extends AAttribute {
    initialize(data: InitializeProcedureAttribute): boolean {
        super.initialize(data);
        return false;
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
        const localAttributeFactory = new ServiceAttributeFactory()
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

}

export type InitializeServiceAttribute = InitializeAttribute & {

}

export type InitializeProcedureAttribute = InitializeAttribute & {

}