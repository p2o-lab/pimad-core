export interface Response {
    getMessage(): string;
    getContent(): object;
    initialize(message: string, content: object): boolean;
}

abstract class AResponse implements Response {
    protected message: string;
    protected content: object;
    private initialized: boolean;

    constructor() {
        this.initialized = false;
        this.message = '';
        this.content = {};
    }

    initialize(message: string, content: object): boolean {
        if (!this.initialized) {
            this.initialized = true;
            this.message = message;
            this.content = content;
            return (this.message == message && JSON.stringify(this.content) == JSON.stringify(content));
        } else {
            return false
        }
    }

    getMessage(): string {
        return this.message;
    }

    getContent(): object {
        return this.content;
    }
}

export class SuccessResponse extends AResponse {

}

export class ErrorResponse extends AResponse {

}

/* Factories */

export interface ResponseFactory {
    create(): Response;
}

abstract class AResponseFactory implements ResponseFactory {
    abstract create(): Response;
}

export class FSuccessResponse extends AResponseFactory {
    create(): Response {
        return new SuccessResponse();
    }
}

export class FErrorResponse extends AResponseFactory {
    create(): Response {
        return new ErrorResponse();
    }
}

export class ResponseVendor {
    private fErrorResponse: ResponseFactory;
    private fSuccessResponse: ResponseFactory;

    constructor() {
        this.fErrorResponse = new FErrorResponse();
        this.fSuccessResponse = new FSuccessResponse();
    }
    public buyErrorResponse(): Response {
        return this.fErrorResponse.create()
    }
    public buySuccessResponse(): Response {
        return this.fSuccessResponse.create()
    }
}