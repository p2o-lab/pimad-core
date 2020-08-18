import {Backbone} from '../../src/Backbone';
import ResponseVendor = Backbone.PiMAdResponseVendor
//import { ResponseVendor } from '../../src/Backbone';
import { expect } from 'chai';
import 'mocha';

describe('class: SuccessResponse', () => {
    it('method: initialize()', () => {
        const response = new ResponseVendor().buySuccessResponse();
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
        const response = new ResponseVendor().buyErrorResponse();
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

describe('class: ResponseVendor', () => {
    it('method: buyDummyResponse()', () => {
        const vendor = new ResponseVendor();
        expect(vendor.buyDummyResponse().constructor.name).is.equal('DummyResponse');
    })
    it('method: buyErrorResponse()', () => {
        const vendor = new ResponseVendor();
        expect(vendor.buyErrorResponse().constructor.name).is.equal('ErrorResponse');
    })
    it('method: buySuccessResponse()', () => {
        const vendor = new ResponseVendor();
        expect(vendor.buySuccessResponse().constructor.name).is.equal('SuccessResponse');
    });
    it('method: buyWarningResponse()', () => {
        const vendor = new ResponseVendor();
        expect(vendor.buyWarningResponse().constructor.name).is.equal('WarningResponse');
    });
})
