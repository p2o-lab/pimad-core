import {logger} from '../../Utils/Logger';
import {AMLGate, Gate, MockGate, XMLGate, ZIPGate} from './Gate';

abstract class AGateFactory implements GateFactory {
    abstract create(): Gate;
}

export class AMLGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new AMLGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export class MockGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new MockGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export class XMLGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new XMLGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export class ZIPGateFactory extends AGateFactory {
    create(): Gate {
        const gate = new ZIPGate();
        logger.debug(this.constructor.name + ' creates a ' + gate.constructor.name);
        return gate;
    }
}

export interface GateFactory {
    create(): Gate;
}