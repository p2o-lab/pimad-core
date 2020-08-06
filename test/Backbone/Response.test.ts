import {SuccessResponse, ErrorResponse, SuccessResponseFactory, ErrorResponseFactory, ResponseVendor} from '../../src/Backbone/Response';
import { expect } from 'chai';
import 'mocha';

describe('class: SuccessResponse', () => {
    it('method: initialize()', () => {
        const response = new SuccessResponse();
        expect(response.getMessage()).to.equal('');
        expect(JSON.stringify(response.getContent())).to.equal(JSON.stringify({}));
        const msg = 'This is a test message!';
        const obj = {hello: 'test'}
        expect(response.initialize(msg, obj)).is.true
        expect(response.initialize(msg, obj)).is.false
    });
});

describe('class: ErrorResponse', () => {
    it('method: initialize()', () => {
        const response = new ErrorResponse();
        expect(response.getMessage()).to.equal('');
        expect(JSON.stringify(response.getContent())).to.equal(JSON.stringify({}));
        let msg = 'This is a test message!';
        let obj = {hello: 'test'}
        expect(response.initialize(msg, obj)).is.true
        msg = 'This is another test message';
        obj = {hello: 'hello'};
        expect(response.initialize(msg, obj)).is.false
    });
});

describe('class: FSuccessResponse', () => {
    it('method: create()', () => {
        const factory = new SuccessResponseFactory();
        expect(typeof factory.create()).is.equal(typeof new SuccessResponse())
    });
});

describe('class: FErrorResponse', () => {
    it('method: create()', () => {
        const factory = new ErrorResponseFactory();
        expect(typeof factory.create()).is.equal(typeof new ErrorResponse())
    });
});

describe('class: ResponseVendor', () => {
    it('method: buySuccessResponse()', () => {
        const vendor = new ResponseVendor();
        expect(typeof vendor.buySuccessResponse()).is.equal(typeof new SuccessResponse())
    });
    it('method: buyErrorResponse()', () => {
        const vendor = new ResponseVendor();
        expect(typeof vendor.buyErrorResponse()).is.equal(typeof new ErrorResponse())
    })
})