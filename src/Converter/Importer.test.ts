import { expect } from 'chai';
import {FLastChainElementImporter, LastChainLinkImporter} from './Importer';
import {FileSystemGate} from './Gate';
import {ErrorResponse} from '../Backbone/Response';

describe('class: LastChainElementImporter', () => {
    const importer = new LastChainLinkImporter();
    it('method: initialize(nextImporter: Importer, gate: IGate)', () => {
        let gate = new FileSystemGate();
        let localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter, gate)).is.true;
        gate = new FileSystemGate();
        localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter, gate)).is.false;
    })
    it('method: convertFrom(source: object)', () => {
        expect(typeof importer.convertFrom({})).is.equal(typeof new ErrorResponse());
    })
});

describe('class: FLastChainElementImporter', () => {
    const factory = new FLastChainElementImporter();
    it('method: create', () => {
        expect(typeof factory.create()).is.equal(typeof new LastChainLinkImporter());
    })
});