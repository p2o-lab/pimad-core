import {expect} from 'chai';
import {HMIPart, MTPPart, ServicePart, TextPart} from './ImporterPart';
import {ErrorResponse} from '../../Backbone/Response';

describe('class: MTPPart', () => {
    let part = new MTPPart();
    beforeEach(() => {
        part = new MTPPart();
    })
    it('method: convertFrom()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});

describe('class: HMIPart', () => {
    let part = new HMIPart();
    beforeEach(() => {
        part = new HMIPart();
    })
    it('method: convertFrom()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});

describe('class: TextPart', () => {
    let part = new TextPart();
    beforeEach(() => {
        part = new TextPart();
    })
    it('method: convertFrom()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});

describe('class: ServicePart', () => {
    let part = new ServicePart();
    beforeEach(() => {
        part = new ServicePart();
    })
    it('method: convertFrom()', () => {
        part.extract({},(response) => {
            expect(response.constructor.name).is.equal(new ErrorResponse().constructor.name);
            expect(response.getMessage()).is.equal('Not implemented yet!');
        })
    })
});