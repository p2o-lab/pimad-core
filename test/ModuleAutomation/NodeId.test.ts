import {
    GUIDNodeIdFactory,
    NodeId,
    NodeIdVendor,
    NumericNodeIdFactory,
    QpaqueNodeIdFactory,
    StringNodeIdFactory
} from '../../src/ModuleAutomation';
import {expect} from 'chai';
import {Backbone} from '../../src/Backbone';
import {NodeIdTypeEnum} from 'PiMAd-types';
import PiMAdResponseVendor = Backbone.PiMAdResponseVendor;

const responseVendor = new PiMAdResponseVendor();
const errorResponseAsString = responseVendor.buyErrorResponse().constructor.name
const successResponseAsString = responseVendor.buySuccessResponse().constructor.name

describe('class: NumericNodeId', () => {
    let nodeId: NodeId;
    beforeEach(() => {
        nodeId = new NumericNodeIdFactory().create();
    });
    describe('method: initialize', () => {
        it('normal usage', () => {
            expect(nodeId.initialize({namespaceIndex: 2, identifier: '2048'})).is.true;
            expect(nodeId.initialize({namespaceIndex: 1, identifier: '1024'})).is.false;
        });
        it('wrong namespace', () => {
            expect(nodeId.initialize({namespaceIndex: -1, identifier: '2048'})).is.false;
            expect(nodeId.initialize({namespaceIndex: -958, identifier: '2048'})).is.false;
        });
        it('wrong identifier', () => {
            expect(nodeId.initialize({namespaceIndex: 0, identifier: '-1'})).is.false;
            expect(nodeId.initialize({namespaceIndex: 0, identifier: '0'})).is.false;
            expect(nodeId.initialize({namespaceIndex: 1, identifier: 'Test-NodeId as string'})).is.false;
        });
    });
    describe('with initialization', () => {
        beforeEach(() => {
            nodeId.initialize({namespaceIndex: 4, identifier: '4096'});
        });
        it('method: getIdentifier', (done) => {
            nodeId.getNodeIdIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(identifier).is.equal('4096');
                done();
            });
        });
        it('method: getNamespaceIndex', (done) => {
            nodeId.getNamespaceIndex((response, namespaceIndex) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(namespaceIndex).is.equal(4);
                done();
            });
        });
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(nodeId).is.equal('ns=4;i=4096');
                done();
            });
        });
    });
    describe('without initialization', () => {
        it('method: getIdentifier', (done) => {
            nodeId.getNodeIdIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(identifier).is.equal('-1');
                done();
            });
        });
        it('method: getNamespaceIndex', (done) => {
            nodeId.getNamespaceIndex((response, namespaceIndex) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(namespaceIndex).is.equal(-1);
                done();
            });
        });
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(nodeId).is.equal('ns=-1;i=-1');
                done();
            });
        });
    });
})

describe('class: QpaqueNodeId', () => {
    let nodeId: NodeId;
    beforeEach(() => {
        nodeId = new QpaqueNodeIdFactory().create();
    });
    describe('method: initialize', () => {
        it('normal usage', () => {
            expect(nodeId.initialize({namespaceIndex: 3, identifier: 'M/RbKBsRVkePCePcx24oRA=='})).is.true;
            expect(nodeId.initialize({namespaceIndex: 4, identifier: 'M/RbKBsRVkePCePcx44oRA=='})).is.false;
        });
    });
    describe('with initialization', () => {
        beforeEach(() => {
            nodeId.initialize({namespaceIndex: 24, identifier: 'M/RbKBsRVkePCePcx84oRA=='});
        });
        it('method: getIdentifier', (done) => {
            nodeId.getNodeIdIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(identifier).is.equal('M/RbKBsRVkePCePcx84oRA==');
                done();
            });
        });
        it('method: getNamespaceIndex', (done) => {
            nodeId.getNamespaceIndex((response, namespaceIndex) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(namespaceIndex).is.equal(24);
                done();
            });
        });
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(nodeId).is.equal('ns=24;b=M/RbKBsRVkePCePcx84oRA==');
                done();
            });
        });
    });
    describe('without initialization', () => {
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(nodeId).is.equal('ns=-1;b=identifier: not initialized');
                done();
            });
        });
    });
});

describe('class: StringNodeId', () => {
    let nodeId: NodeId;
    beforeEach(() => {
        nodeId = new StringNodeIdFactory().create();
    });
    describe('method: initialize', () => {
        it('normal usage', () => {
            expect(nodeId.initialize({namespaceIndex: 3, identifier: 'Test-StringNodeId-1'})).is.true;
            expect(nodeId.initialize({namespaceIndex: 4, identifier: 'Test-StringNodeId-2'})).is.false;
        });
        it('wrong namespace', () => {
            expect(nodeId.initialize({namespaceIndex: -1, identifier: 'Test-StringNodeId-1'})).is.false;
            expect(nodeId.initialize({namespaceIndex: -958, identifier: 'Test-StringNodeId-1'})).is.false;
        });
    });
    describe('with initialization', () => {
        beforeEach(() => {
            nodeId.initialize({namespaceIndex: 12, identifier: 'Test-StringNodeId-@43'});
        });
        it('method: getIdentifier', (done) => {
            nodeId.getNodeIdIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(identifier).is.equal('Test-StringNodeId-@43');
                done();
            });
        });
        it('method: getNamespaceIndex', (done) => {
            nodeId.getNamespaceIndex((response, namespaceIndex) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(namespaceIndex).is.equal(12);
                done();
            });
        });
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(nodeId).is.equal('ns=12;s=Test-StringNodeId-@43');
                done();
            });
        });
    });
    describe('without initialization', () => {
        it('method: getIdentifier', (done) => {
            nodeId.getNodeIdIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(identifier).is.equal('identifier: not initialized');
                done();
            });
        });
        it('method: getNamespaceIndex', (done) => {
            nodeId.getNamespaceIndex((response, namespaceIndex) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(namespaceIndex).is.equal(-1);
                done();
            });
        });
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(nodeId).is.equal('ns=-1;s=identifier: not initialized');
                done();
            });
        });
    });
});

describe('class: GUIDNodeId', () => {
    let nodeId: NodeId;
    beforeEach(() => {
        nodeId = new GUIDNodeIdFactory().create();
    })
    describe('method: initialize', () => {
        it('normal usage', () => {
            expect(nodeId.initialize({namespaceIndex: 5, identifier: '09087e75-8e5e-499b-954f-f2a9603db28a'})).is.true;
            expect(nodeId.initialize({namespaceIndex: 6, identifier: '09087e75-8e5e-499b-954f-f2a9603db28b'})).is.false;
        });
    });
    describe('with initialization', () => {
        beforeEach(() => {
            nodeId.initialize({namespaceIndex: 13, identifier: '09087e75-8e5e-499b-954f-f2a9603db28c'});
        });
        it('method: getIdentifier', (done) => {
            nodeId.getNodeIdIdentifier((response, identifier) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(identifier).is.equal('09087e75-8e5e-499b-954f-f2a9603db28c');
                done();
            });
        });
        it('method: getNamespaceIndex', (done) => {
            nodeId.getNamespaceIndex((response, namespaceIndex) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(namespaceIndex).is.equal(13);
                done();
            });
        });
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(successResponseAsString);
                expect(nodeId).is.equal('ns=13;g=09087e75-8e5e-499b-954f-f2a9603db28c');
                done();
            });
        });
    });
    describe('without initialization', () => {
        it('method: getNodeId', (done) => {
            nodeId.getNodeId((response, nodeId) => {
                expect(response.constructor.name).is.equal(errorResponseAsString);
                expect(nodeId).is.equal('ns=-1;g=identifier: not initialized');
                done();
            });
        });
    });
});

describe('class: NumericNodeIdFactory', () => {
    const factory = new NumericNodeIdFactory();
    it('method: create(): NodeId', () => {
        expect(factory.create().constructor.name).is.equal('NumericNodeId')
    });
});

describe('class: QpaqueNodeIdFactory', () => {
    const factory = new QpaqueNodeIdFactory();
    it('method: create(): NodeId', () => {
        expect(factory.create().constructor.name).is.equal('QpaqueNodeId')
    });
});

describe('class: StringNodeIdFactory', () => {
    const factory = new StringNodeIdFactory();
    it('method: create(): NodeId', () => {
        expect(factory.create().constructor.name).is.equal('StringNodeId')
    });
});

describe('class: GUIDNodeIdFactory', () => {
    const factory = new GUIDNodeIdFactory();
    it('method: create(): NodeId', () => {
        expect(factory.create().constructor.name).is.equal('GUIDNodeId')
    });
});

describe('class: NodeIdVendor', () => {
    const vendor = new NodeIdVendor();
    it('buy: NumericNodeId', () => {
        expect(vendor.buy(NodeIdTypeEnum.NUMERIC).constructor.name).is.equal('NumericNodeId');
    });
    it('buy: QpaqueNodeId', () => {
        expect(vendor.buy(NodeIdTypeEnum.OPAQUE).constructor.name).is.equal('QpaqueNodeId');
    });
    it('buy: StringNodeId', () => {
        expect(vendor.buy(NodeIdTypeEnum.STRING).constructor.name).is.equal('StringNodeId');
    });
    it('buy: GUIDNodeId', () => {
        expect(vendor.buy(NodeIdTypeEnum.GUID).constructor.name).is.equal('GUIDNodeId');
    });
})
