import { SuccessResponse, ErrorResponse } from './Response';
import { expect } from 'chai';
import 'mocha';

describe('class: SuccessResponse', () => {
    it('method: initialize()', () => {
        let response = new SuccessResponse();
        expect(response.getMessage()).to.equal('');
        expect(JSON.stringify(response.getContent())).to.equal(JSON.stringify({}));
        const msg = 'This is a test message!';
        const obj = {hello: 'test'}
        expect(response.initialize(msg, obj)).is.true
        expect(response.initialize(msg, obj)).is.false
    });
});