import {logger} from '../Utils';

abstract class AResponse implements Backbone.PiMAdResponse {
    protected message: string;
    protected content: object;
    private initialized: boolean;

    constructor() {
        this.initialized = false;
        this.message = '';
        this.content = {};
    }

    initialize(message: string, content: {}): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.message = message;
            this.content = content;
            return (this.message == message && JSON.stringify(this.content) == JSON.stringify(content));
        } else {
            return false;
        }
    }

    getMessage(): string {
        return this.message;
    }

    getContent(): object {
        return this.content;
    }
}

abstract class AResponseFactory implements Backbone.PiMAdResponseFactory {
    abstract create(): Backbone.PiMAdResponse;
}

export class ErrorResponse extends AResponse {

}

export class DummyResponse extends AResponse {

}

export class SuccessResponse extends AResponse {

}

export class WarningResponse extends AResponse {

}

/**
 * This factory spawns an {@linkcode ErrorResponse}-Objects.
 */
class ErrorResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new ErrorResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}
/**
 * This factory spawns an {@linkcode DummyResponse}-Objects.
 */
class DummyResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new DummyResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}
/**
 * This factory spawns an {@linkcode SuccessResponse}-Objects.
 */
class SuccessResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new SuccessResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}
/**
 * This factory spawns {@linkcode WarningResponse}-Objects.
 */
class WarningResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new WarningResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}

/**
 *
 <uml>
 abstract class AResponse {
         #content: object
         #msg: string
         -initialized: boolean = false
     }
 abstract class AResponseFactory
 class PiMAdResponseVendor {
     -dummyResponseFactory: PiMAdResponseFactory
     -errorResponseFactory: PiMAdResponseFactory
     -successResponseFactory: PiMAdResponseFactory
     -warningResponseFactory: PiMAdResponseFactory
     +buyDummyResponse(): PiMAdResponse
     +buyErrorResponse(): PiMAdResponse
     +buySuccessResponse(): PiMAdResponse
     +buyWarningResponse(): PiMAdResponse
 }
 class PiMAdResponseHandler {
    -responseVendor: ResponseVendor
    +handleCallbackWithResponse(type: ResponseTypes, message: string, content: object, callback: (response: Response) => void): void
 }
 enum PiMAdResponseTypes {
     DUMMY
     ERROR
     SUCCESS
     WARNING
 }
 interface PiMAdResponse {
     +getMessage(): string
     +getContent(): object
     +initialize(message: string, content: object): boolean
 }
 interface PiMAdResponseFactory {
     +create(): PiMAdResponse
 }
 PiMAdResponse <|.. AResponse
 PiMAdResponse <-- PiMAdResponseFactory
 PiMAdResponse <-- PiMAdResponseVendor
 PiMAdResponseFactory <|.. AResponseFactory
 AResponse <|-- DummyResponse
 AResponse <|-- ErrorResponse
 AResponse <|-- SuccessResponse
 AResponse <|-- WarningResponse
 AResponseFactory <|-- DummyResponseFactory
 AResponseFactory <|-- ErrorResponseFactory
 AResponseFactory <|-- SuccessResponseFactory
 AResponseFactory <|-- WarningResponseFactory
 PiMAdResponseHandler "1" o-- "1" PiMAdResponseVendor
 PiMAdResponseVendor "1" o-- "1..*" PiMAdResponseFactory
 </uml>
 */
export namespace Backbone {
    /**
     *
     */
    export interface PiMAdResponse {
        getMessage(): string;
        getContent(): object;
        initialize(message: string, content: object): boolean;
    }

    export interface PiMAdResponseFactory {
        create(): PiMAdResponse;
    }

    export class PiMAdResponseVendor {
        private dummyResponseFactory: PiMAdResponseFactory;
        private errorResponseFactory: PiMAdResponseFactory;
        private successResponseFactory: PiMAdResponseFactory;
        private warningResponseFactory: PiMAdResponseFactory;

        constructor() {
            this.errorResponseFactory = new ErrorResponseFactory();
            this.dummyResponseFactory = new DummyResponseFactory();
            this.successResponseFactory = new SuccessResponseFactory();
            this.warningResponseFactory = new WarningResponseFactory();
        }
        public buyDummyResponse(): PiMAdResponse {
            return this.dummyResponseFactory.create();
        }
        public buyErrorResponse(): PiMAdResponse {
            return this.errorResponseFactory.create();
        }
        public buySuccessResponse(): PiMAdResponse {
            return this.successResponseFactory.create();
        }
        public buyWarningResponse(): PiMAdResponse {
            return this.warningResponseFactory.create();
        }
    }

    export enum PiMAdResponseTypes {
        DUMMY,
        ERROR,
        SUCCESS,
        WARNING
    }

    export class PiMAdResponseHandler {
        private responseVendor: PiMAdResponseVendor;

        constructor() {
            this.responseVendor = new PiMAdResponseVendor();
        }

        public handleCallbackWithResponse(type: PiMAdResponseTypes, message: string, content: object, callback: (response: PiMAdResponse) => void): void {
            let response: PiMAdResponse = this.responseVendor.buyDummyResponse();
            switch (type) {
                case PiMAdResponseTypes.DUMMY:
                    response = this.responseVendor.buyDummyResponse();
                    break;
                case PiMAdResponseTypes.ERROR:
                    response = this.responseVendor.buyErrorResponse();
                    break;
                case PiMAdResponseTypes.SUCCESS:
                    response = this.responseVendor.buySuccessResponse();
                    break;
                case PiMAdResponseTypes.WARNING:
                    response = this.responseVendor.buyWarningResponse();
                    break;
            }
            response.initialize(message, content);
            callback(response);
        }
    }
}
