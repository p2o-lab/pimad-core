import {NodeId, NumericNodeId} from "./NodeId";
import {expect} from 'chai';
import {ErrorResponse, Response, SuccessResponse} from '../Backbone/Response';

describe('class: NumericNodeId', () => {
    let numericNodeId: NumericNodeId;
    beforeEach(() => {
        numericNodeId = new NumericNodeId();
    })
    it('method: getNamespaceIndex()', () => {
        let response: Response = numericNodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        numericNodeId.initialize(3, 12)
        response = numericNodeId.getNamespaceIndex()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {namespaceIndex?: number} = response.getContent()
        expect(content.namespaceIndex).is.equal(3)
    });
    it('method: getIdentifier()', () => {
        let response: Response = numericNodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        numericNodeId.initialize(1, 42)
        response = numericNodeId.getIdentifier()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {identifier?: number} = response.getContent()
        expect(content.identifier).is.equal(42)
    });
    it('method: getNodeId()', () => {
        let response: Response = numericNodeId.getNodeId()
        expect(typeof response).is.equal(typeof new ErrorResponse())
        numericNodeId.initialize(1, 4321)
        response = numericNodeId.getNodeId()
        expect(typeof response).is.equal(typeof new SuccessResponse())
        const content: {nodeid?: string} = response.getContent()
        expect(content.nodeid).is.equal('ns=1;i=4321')
    });
    it('initialize()', () => {
        expect(numericNodeId.initialize(0, 1)).is.true
        expect(numericNodeId.initialize(1, 2)).is.false
    });
})
