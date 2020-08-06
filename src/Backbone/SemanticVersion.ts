import {logger} from '../Utils/Logger';

abstract class ASemanticVersion implements SemanticVersion {
    protected major: number;
    protected minor: number;
    protected patch: number;
    protected initialized: boolean;
    compatibility(semver: SemanticVersion): boolean {
        if (this.equals(semver)) {
            return true;
        }
        if (this.major != semver.getMajor()) {
            return false;
        } else {
            if (this.minor < semver.getMinor()) {
                return false;
            } else if (this.minor == semver.getMinor()) {
                return this.patch > semver.getPatch() || this.patch == semver.getPatch();
            } else {
                return true;
            }
        }
    };
    equals(semver: SemanticVersion): boolean {
        return this.major == semver.getMajor() && this.minor == semver.getMinor() && this.patch == semver.getPatch();
    };
    getMajor(): number {
        return this.major;
    };
    getMinor(): number {
        return this.minor;
    };
    getPatch(): number {
        return this.patch;
    };
    initialize(major: number, minor: number, patch: number): boolean {
        if (major < 0 || minor < 0 || patch < 0 || this.initialized) {
            return false;
        } else {
            this.major = major;
            this.minor = minor;
            this.patch = patch;
            this.initialized = true;
            return true;
        }
    };

    constructor() {
        this.major = -1;
        this.minor = -1;
        this.patch = -1;
        this.initialized = false;
    }
}

abstract class ASemanticVersionFactory implements SemanticVersionFactory {
    abstract create(): SemanticVersion;
}

export class BasicSemanticVersion extends ASemanticVersion {

}

export class BasicSemanticVersionFactory extends ASemanticVersionFactory{
    create(): SemanticVersion {
        const semver = new BasicSemanticVersion();
        logger.debug(this.constructor.name + ' creates a ' + semver.constructor.name);
        return semver;
    }
}

export class SemanticVersionVendor {
    private basicSemanticVersionFactory: SemanticVersionFactory;
    constructor() {
        this.basicSemanticVersionFactory = new BasicSemanticVersionFactory();
    }
    buyBasicSemanticVersion(): SemanticVersion {
        return this.basicSemanticVersionFactory.create();
    }
}

export interface SemanticVersion {
    compatibility(semver: SemanticVersion): boolean;
    equals(semver: SemanticVersion): boolean;
    getMajor(): number;
    getMinor(): number;
    getPatch(): number;
    initialize(major: number, minor: number, patch: number): boolean;
}
export interface SemanticVersionFactory {
    create(): SemanticVersion;
}
