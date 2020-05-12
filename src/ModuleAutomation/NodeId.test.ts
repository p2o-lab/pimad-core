import {
    GUIDNodeId,
    GUIDNodeIdFactory,
    NumericNodeId,
    NumericNodeIdFactory,
    QpaqueNodeId, QpaqueNodeIdFactory,
    StringNodeId,
    StringNodeIdFactory
} from "./NodeId";
import {expect} from 'chai';
import {ErrorResponse, Response, SuccessResponse} from '../Backbone/Response';

describe('class: NumericNodeId', () => {
    let nodeId: NumericNodeId;
    beforeEach(() => {
        nodeId = new NumericNodeId();
    })
    it('method: getNamespaceIndex()', () => {
        let response: Response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(3, 12)
        response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {namespaceIndex?: number} = response.getContent()
        expect(content.namespaceIndex).is.equal(3)
    });
    it('method: getIdentifier()', () => {
        let response: Response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 42)
        response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {identifier?: number} = response.getContent()
        expect(content.identifier).is.equal(42)
    });
    it('method: getNodeId()', () => {
        let response: Response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 4321)
        response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {nodeId?: string} = response.getContent()
        expect(content.nodeId).is.equal('ns=1;i=4321')
    });
    it('initialize()', () => {
        expect(nodeId.initialize(0, 1)).is.true
        expect(nodeId.initialize(1, 2)).is.false
    });
})

describe('class: QpaqueNodeId', () => {
    let nodeId: QpaqueNodeId;
    beforeEach(() => {
        nodeId = new QpaqueNodeId();
    })
    it('method: getNamespaceIndex()', () => {
        let response: Response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 'M/RbKBsRVkePCePcx24oRA==')
        response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {namespaceIndex?: number} = response.getContent()
        expect(content.namespaceIndex).is.equal(1)
    });
    it('method: getIdentifier()', () => {
        let response: Response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 'M/RbKBsRVkePCePcx24oRA==')
        response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {identifier?: string} = response.getContent()
        expect(content.identifier).is.equal('M/RbKBsRVkePCePcx24oRA==')
    });
    it('method: getNodeId()', () => {
        let response: Response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 'M/RbKBsRVkePCePcx24oRA==')
        response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {nodeId?: string} = response.getContent()
        expect(content.nodeId).is.equal('ns=1;b=M/RbKBsRVkePCePcx24oRA==')
    });
    it('initialize()', () => {
        expect(nodeId.initialize(0, 'M/RbKBsRVkePCePcx24oRA==')).is.true
        expect(nodeId.initialize(1, 'M/RbKBsRVkePCePcx24oRA==')).is.false
    });
})

describe('class: StringNodeId', () => {
    let nodeId: StringNodeId;
    beforeEach(() => {
        nodeId = new StringNodeId();
    })
    it('method: getNamespaceIndex()', () => {
        let response: Response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 'MyTemperature')
        response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {namespaceIndex?: number} = response.getContent()
        expect(content.namespaceIndex).is.equal(1)
    });
    it('method: getIdentifier()', () => {
        let response: Response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 'MyTemperature')
        response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {identifier?: string} = response.getContent()
        expect(content.identifier).is.equal('MyTemperature')
    });
    it('method: getNodeId()', () => {
        let response: Response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, 'MyTemperature')
        response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {nodeId?: string} = response.getContent()
        expect(content.nodeId).is.equal('ns=1;s=MyTemperature')
    });
    it('initialize()', () => {
        expect(nodeId.initialize(0, 'MyTemperature')).is.true
        expect(nodeId.initialize(1, 'MyTemperature')).is.false
    });
})

describe('class: GUIDNodeId', () => {
    let nodeId: GUIDNodeId;
    beforeEach(() => {
        nodeId = new GUIDNodeId();
    })
    it('method: getNamespaceIndex()', () => {
        let response: Response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, '09087e75-8e5e-499b-954f-f2a9603db28a')
        response = nodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {namespaceIndex?: number} = response.getContent()
        expect(content.namespaceIndex).is.equal(1)
    });
    it('method: getIdentifier()', () => {
        let response: Response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, '09087e75-8e5e-499b-954f-f2a9603db28a')
        response = nodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {identifier?: string} = response.getContent()
        expect(content.identifier).is.equal('09087e75-8e5e-499b-954f-f2a9603db28a')
    });
    it('method: getNodeId()', () => {
        let response: Response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        nodeId.initialize(1, '09087e75-8e5e-499b-954f-f2a9603db28a')
        response = nodeId.getNodeId()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {nodeId?: string} = response.getContent()
        expect(content.nodeId).is.equal('ns=1;g=09087e75-8e5e-499b-954f-f2a9603db28a')
    });
    it('initialize()', () => {
        expect(nodeId.initialize(0, '09087e75-8e5e-499b-954f-f2a9603db28a')).is.true
        expect(nodeId.initialize(1, '09087e75-8e5e-499b-954f-f2a9603db28a')).is.false
    });
})

describe('class: NumericNodeIdFactory', () => {
    let factory: NumericNodeIdFactory;
    beforeEach(() => {
        factory = new NumericNodeIdFactory();
    })
    it('method: create(): NodeId', () => {
        expect(typeof factory.create()).is.equal(new NumericNodeId())
    });
})

describe('class: QpaqueNodeIdFactory', () => {
    let factory: QpaqueNodeIdFactory;
    beforeEach(() => {
        factory = new QpaqueNodeIdFactory();
    })
    it('method: create(): NodeId', () => {
        expect(typeof factory.create()).is.equal(new QpaqueNodeId())
    });
})

describe('class: StringNodeIdFactory', () => {
    let factory: StringNodeIdFactory;
    beforeEach(() => {
        factory = new StringNodeIdFactory();
    })
    it('method: create(): NodeId', () => {
        expect(typeof factory.create()).is.equal(new StringNodeId())
    });
})

describe('class: GUIDNodeId', () => {
    let factory: GUIDNodeIdFactory;
    beforeEach(() => {
        factory = new GUIDNodeIdFactory();
    })
    it('method: create(): NodeId', () => {
        expect(typeof factory.create()).is.equal(new GUIDNodeId())
    });
})
