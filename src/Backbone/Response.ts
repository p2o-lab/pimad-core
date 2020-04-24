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

export interface FResponse {
    create(): Response;
}

abstract class AFResponse implements FResponse {
    abstract create(): Response;
}

export class FSuccessResponse extends AFResponse {
    create(): Response {
        return new SuccessResponse();
    }
}

export class FErrorResponse extends AFResponse {
    create(): Response {
        return new ErrorResponse();
    }
}

export class ResponseVendor {
    private fErrorResponse: FResponse;
    private fSuccessResponse: FResponse;

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