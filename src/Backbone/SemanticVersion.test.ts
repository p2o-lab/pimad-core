import { expect } from 'chai';
import 'mocha';
import {BasicSemanticVersion, BasicSemanticVersionFactory, SemanticVersionVendor} from './SemanticVersion';

describe('class: BasicSemanticVersion', () => {
    it('method: initialize(major: number, minor: number, patch: number)', () => {
        let semVer = new BasicSemanticVersion();
        expect(semVer.initialize(1, 0, 0)).is.true
        expect(semVer.initialize(1, 0, 0)).is.false
        // different input ;)
        expect(semVer.initialize(0, 0, 1)).is.false
        // new object
        semVer = new BasicSemanticVersion();
        expect(semVer.initialize(-1, 0, 0)).is.false
        expect(semVer.initialize(0, -1, 0)).is.false
        expect(semVer.initialize(0, 0, -1)).is.false
    });

    it('method: equals(semver: SemanticVersion)', () => {
        const semVer1 = new BasicSemanticVersion();
        const semVer2 = new BasicSemanticVersion();
        const semVer3 = new BasicSemanticVersion();
        semVer1.initialize(1, 0, 0)
        semVer2.initialize(1, 0, 0)
        semVer3.initialize(0, 0, 1)
        expect(semVer1.equals(semVer2)).is.true
        expect(semVer1.equals(semVer3)).is.false
    });

    it('method: compatibility(semver: SemanticVersion)', () => {
        const semVer1 = new BasicSemanticVersion();
        const semVer2 = new BasicSemanticVersion();
        const semVer3 = new BasicSemanticVersion();
        const semVer4 = new BasicSemanticVersion();
        semVer1.initialize(1, 0, 0);
        semVer2.initialize(1, 0, 1);
        semVer3.initialize(1, 1, 0);
        semVer4.initialize(2, 0, 0);

        expect(semVer1.compatibility(semVer1)).is.true
        expect(semVer1.compatibility(semVer2)).is.false
        expect(semVer1.compatibility(semVer3)).is.false
        expect(semVer1.compatibility(semVer4)).is.false

        expect(semVer2.compatibility(semVer1)).is.true
        expect(semVer2.compatibility(semVer2)).is.true
        expect(semVer2.compatibility(semVer3)).is.false
        expect(semVer2.compatibility(semVer4)).is.false

        expect(semVer3.compatibility(semVer1)).is.true
        expect(semVer3.compatibility(semVer2)).is.true
        expect(semVer3.compatibility(semVer3)).is.true
        expect(semVer3.compatibility(semVer4)).is.false

        expect(semVer4.compatibility(semVer1)).is.false
        expect(semVer4.compatibility(semVer2)).is.false
        expect(semVer4.compatibility(semVer3)).is.false
        expect(semVer4.compatibility(semVer4)).is.true
    });

    it('method: getMajor()', () => {
        const semVer = new BasicSemanticVersion();
        expect(semVer.getMajor()).is.equal(-1)
        semVer.initialize(2, 0, 0)
        expect(semVer.getMajor()).is.equal(2)
    });

    it('method: getMinor()', () => {
        const semVer = new BasicSemanticVersion();
        expect(semVer.getMinor()).is.equal(-1)
        semVer.initialize(0, 2, 0)
        expect(semVer.getMinor()).is.equal(2)
    });

    it('method: getPatch()', () => {
        const semVer = new BasicSemanticVersion();
        expect(semVer.getPatch()).is.equal(-1)
        semVer.initialize(0, 0, 2)
        expect(semVer.getPatch()).is.equal(2)
    });
});

describe('class: BasicSemanticVersionFactory', () => {
    it('method: create()', () => {
        const factory = new BasicSemanticVersionFactory();
        expect(typeof factory.create()).is.equal(typeof new BasicSemanticVersion())
    });
});

describe('class: SemanticVersionVendor', () => {
    it('method: buyBasicSemanticVersion()', () => {
        const vendor = new SemanticVersionVendor();
        expect(typeof vendor.buyBasicSemanticVersion()).is.equal(typeof new BasicSemanticVersion())
    });
})