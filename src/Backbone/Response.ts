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

class ErrorResponse extends AResponse {

}

class DummyResponse extends AResponse {

}

class SuccessResponse extends AResponse {

}

class WarningResponse extends AResponse {

}

/**
 * This factory spawns an {@link ErrorResponse}-Objects.
 */
class ErrorResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new ErrorResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}
/**
 * This factory spawns a {@link DummyResponse}-Objects.
 */
class DummyResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new DummyResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}
/**
 * This factory spawns a {@link SuccessResponse}-Objects.
 */
class SuccessResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new SuccessResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}
/**
 * This factory spawns {@link WarningResponse}-Objects.
 */
class WarningResponseFactory extends AResponseFactory {
    create(): Backbone.PiMAdResponse {
        const response = new WarningResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}

/**
 * The namespace Backbone provides the classes in PiMAd-core with various elementary functionalities. The
 * {@link PiMAdResponse} interface serves as an exchange format between individual classes or even between PiMAd and
 * docking software.
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
    +handleCallbackWithResponse(type: ResponseTypes, message: string, content: object, callback: (response: PiMAdResponse) => void): void
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
     * In PiMAd, PiMAdResponses serve the standardized exchange of responses between different classes. The executing
     * class reports the status of the response directly to the calling class using different response types.
     */
    export interface PiMAdResponse {
        /**
         * Get the message of the response.
         */
        getMessage(): string;

        /**
         * Get the content of the response.
         */
        getContent(): object;

        /**
         * Initialize the new response object.
         * @param message - The message serves as a further explanation of the response.
         * @param content - Data or information to be exchanged using the response.
         */
        initialize(message: string, content: object): boolean;
    }

    /**
     * This Factory creates Instances of {@link PiMAdResponse}.
     */
    export interface PiMAdResponseFactory {
        /**
         * Create an Instances of {@link PiMAdResponse}.
         */
        create(): PiMAdResponse;
    }

    /**
     * This vendor sells various {@link PiMAdResponseVendor}-Instances.
     */
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

        /**
         * Buy a {@link DummyResponse} as {@link PiMAdResponse}.
         */
        public buyDummyResponse(): PiMAdResponse {
            return this.dummyResponseFactory.create();
        }

        /**
         * Buy an {@link ErrorResponse} as {@link PiMAdResponse}.
         */
        public buyErrorResponse(): PiMAdResponse {
            return this.errorResponseFactory.create();
        }

        /**
         * Buy a {@link SuccessResponse} as {@link PiMAdResponse}.
         */
        public buySuccessResponse(): PiMAdResponse {
            return this.successResponseFactory.create();
        }

        /**
         * Buy a {@link WarningResponse} as {@link PiMAdResponse}.
         */
        public buyWarningResponse(): PiMAdResponse {
            return this.warningResponseFactory.create();
        }
    }

    /**
     * This enum referencing to all implementations of {@link PiMAdResponse}.
     */
    export enum PiMAdResponseTypes {
        /**
         * Referencing a {@link DummyResponse}.
         */
        DUMMY = 0,
        /**
         * Referencing an {@link ErrorResponse}.
         */
        ERROR = 1,
        /**
         * Referencing a {@link SuccessResponse}.
         */
        SUCCESS = 2,
        /**
         * Referencing a {@link WarningResponse}.
         */
        WARNING = 3
    }

    /**
     * This class generalizes the handling of objects of the response interface and thus reduces the repeated
     * occurrence of certain code fragments.
     */
    export class PiMAdResponseHandler {
        private responseVendor: PiMAdResponseVendor;

        constructor() {
            this.responseVendor = new PiMAdResponseVendor();
        }

        /**
         * This method creates the desired {@link PiMAdResponse}-Instance, initializes it with the given data and finally calls the
         * callback function.
         * @param type - The type of the response.
         * @param message - The message of the response.
         * @param content - The content of the response.
         * @param callback - The callback function that expects a {@link PiMAdResponse}-Instance as input.
         */
        public handleCallbackWithResponse(type: PiMAdResponseTypes, message: string, content: object, callback: (response: PiMAdResponse) => void): void {
            callback(this.handleResponse(type, message, content));
        }

        /**
         * This method creates the desired {@link PiMAdResponse}-Instance, initializes it with the given data and
         * returns the instance.
         * @param type - The type of the response.
         * @param message - The message of the response.
         * @param content - The content of the response.
         */
        public handleResponse(type: PiMAdResponseTypes, message: string, content: object): PiMAdResponse {
            let response: PiMAdResponse;
            switch (type) {
                case Backbone.PiMAdResponseTypes.DUMMY:
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
            return response;
        }
    }
}
