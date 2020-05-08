import {expect} from 'chai';
import {FLastChainElementImporter, LastChainLinkImporter} from './Importer';
import {ErrorResponse, Response} from '../Backbone/Response';

describe('class: LastChainElementImporter', () => {
    const importer = new LastChainLinkImporter();
    it('method: initialize(nextImporter: Importer, gate: IGate)', () => {
        let localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter)).is.true;
        localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter)).is.false;
    })
    it('method: convertFrom(source: object)', () => {
        importer.convertFrom({}, (response: Response) => {
            expect(typeof response).is.equal(typeof new ErrorResponse());
        })
    })
});

describe('class: FLastChainElementImporter', () => {
    const factory = new FLastChainElementImporter();
    it('method: create', () => {
        expect(typeof factory.create()).is.equal(typeof new LastChainLinkImporter());
    })
});