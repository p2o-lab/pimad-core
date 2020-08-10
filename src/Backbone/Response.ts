import {logger} from '../Utils';

abstract class AResponse implements Response {
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

export class ErrorResponse extends AResponse {

}

export class DummyResponse extends AResponse {

}

export class SuccessResponse extends AResponse {

}

export class WarningResponse extends AResponse {

}

export interface Response {
    getMessage(): string;
    getContent(): object;
    initialize(message: string, content: object): boolean;
}

/* Factories */

export interface ResponseFactory {
    create(): Response;
}

abstract class AResponseFactory implements ResponseFactory {
    abstract create(): Response;
}

export class ErrorResponseFactory extends AResponseFactory {
    create(): Response {
        const response = new ErrorResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}

export class DummyResponseFactory extends AResponseFactory {
    create(): Response {
        const response = new DummyResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}

export class SuccessResponseFactory extends AResponseFactory {
    create(): Response {
        const response = new SuccessResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}

export class WarningResponseFactory extends AResponseFactory {
    create(): Response {
        const response = new WarningResponse();
        logger.debug(this.constructor.name + ' creates a ' + response.constructor.name);
        return response;
    }
}


export class ResponseVendor {
    private fDummyResponse: ResponseFactory;
    private fErrorResponse: ResponseFactory;
    private fSuccessResponse: ResponseFactory;
    private fWarningResponse: ResponseFactory;

    constructor() {
        this.fErrorResponse = new ErrorResponseFactory();
        this.fDummyResponse = new DummyResponseFactory();
        this.fSuccessResponse = new SuccessResponseFactory();
        this.fWarningResponse = new WarningResponseFactory();
    }
    public buyErrorResponse(): Response {
        return this.fErrorResponse.create();
    }
    public buyDummyResponse(): Response {
        return this.fSuccessResponse.create();
    }
    public buySuccessResponse(): Response {
        return this.fSuccessResponse.create();
    }
    public buyWarningResponse(): Response {
        return this.fWarningResponse.create();
    }
}

export enum ResponseTypes {
    DUMMY,
    ERROR,
    SUCCESS,
    WARNING
}

export class ResponseHandler {
    private responseVendor: ResponseVendor;

    constructor() {
        this.responseVendor = new ResponseVendor();
    }

    public handleCallbackWithResponse(type: ResponseTypes, message: string, content: {}, callback: (response: Response) => void): void {
        let response: Response = this.responseVendor.buyDummyResponse();
        switch (type) {
            case ResponseTypes.DUMMY:
                response = this.responseVendor.buyDummyResponse();
                break;
            case ResponseTypes.ERROR:
                response = this.responseVendor.buyErrorResponse();
                break;
            case ResponseTypes.SUCCESS:
                response = this.responseVendor.buySuccessResponse();
                break;
            case ResponseTypes.WARNING:
                response = this.responseVendor.buyWarningResponse();
                break;
        }
        response.initialize(message, content);
        callback(response);
    }
}