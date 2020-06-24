import {expect} from 'chai';
import {LastChainElementImporterFactory, LastChainLinkImporter, MTPFreeze202001Importer} from './Importer';
import {ErrorResponse, Response} from '../../Backbone/Response';
import {BasicSemanticVersion} from '../../Backbone/SemanticVersion';

describe('class: LastChainElementImporter', () => {
    let importer: LastChainLinkImporter;
    beforeEach(() => {
        importer = new LastChainLinkImporter();
    })
    it('method: initialize()', () => {
        let localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter)).is.true;
        localImporter = new LastChainLinkImporter();
        expect(importer.initialize(localImporter)).is.false;
    });
    it('method: getMetaModelVersion(): SemanticVersion', () => {
        expect(typeof importer.getMetaModelVersion()).is.equal(typeof new BasicSemanticVersion())
    });
    it('method: convertFrom()', () => {
        importer.convertFrom({}, (response: Response) => {
            expect(typeof response).is.equal(typeof new ErrorResponse());
        });
    });
});

describe('class: MTPFreeze202001Importer', () => {
    let importer: MTPFreeze202001Importer;
    beforeEach(() => {
        importer = new MTPFreeze202001Importer();
    });
    describe('method: convertFrom()', () => {
        it('base functionality', () => {
            const lastChainLinkImporter = new LastChainLinkImporter()
            importer.initialize(lastChainLinkImporter);
            importer.convertFrom({}, response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
            })
        });
        it('without initialization', () => {
            importer.convertFrom({}, response => {
                expect(response.constructor.name).is.equal((new ErrorResponse()).constructor.name);
                expect(response.getMessage()).is.equal('The Importer is not initialized yet! Aborting ... ');
            })
        })
    })
    describe('method: initialize()', () => {
        it('base functionality', () => {
            const lastChainLinkImporter = new LastChainLinkImporter()
            expect(importer.initialize(lastChainLinkImporter)).is.true;
            expect(importer.initialize(lastChainLinkImporter)).is.false;
        })
    });
})

describe('class: LastChainElementImporterFactory', () => {
    const factory = new LastChainElementImporterFactory();
    it('method: create', () => {
        expect(typeof factory.create()).is.equal(typeof new LastChainLinkImporter());
    });
});