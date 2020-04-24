export interface IResponse {
    getMessage(): string
    getContent(): object
    initialize(message: string, content: object): boolean
}

abstract class Response implements IResponse {
    protected message: string;
    protected content: object;
    private initialized: boolean = false;

    constructor() {
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

export class SuccessResponse extends Response {

}

export class ErrorResponse extends Response {

}

export interface IFResponse {
    create(): IResponse;
}

abstract class FResponse implements IFResponse {
    abstract create(): IResponse;
}

export class FSuccessResponse extends FResponse {
    create(): IResponse {
        return new SuccessResponse();
    }
}

export class FErrorResponse extends FResponse {
    create(): IResponse {
        return new ErrorResponse();
    }
}

export class ResponseVendor {
    private fErrorResponse: IFResponse;
    private fSuccessResponse: IFResponse;

    constructor() {
        this.fErrorResponse = new FErrorResponse();
        this.fSuccessResponse = new FSuccessResponse();
    }
    public buyErrorResponse(): IResponse {
        return this.fErrorResponse.create()
    }
    public buySuccessResponse(): IResponse {
        return this.fSuccessResponse.create()
    }
}