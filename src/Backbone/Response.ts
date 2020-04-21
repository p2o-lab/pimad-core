export interface IResponse {
    getMessage(): string
    getContent(): object
    initialize(message: string, content: object): boolean
}

abstract class Response implements IResponse {
    protected message: string = '';
    protected content: object = {};
    protected initialized: boolean = false;

    constructor() {}

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

export abstract class FResponse implements IFResponse {
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