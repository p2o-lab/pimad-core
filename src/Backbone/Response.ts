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

export interface IResponseFactory {
    create(message: string, content: object): IResponse;
}

export abstract class ResponseFactory implements IResponseFactory {
    abstract create(message: string, content: object): IResponse;
}

export class SuccessResponseFactory extends ResponseFactory {
    create(message: string, content: object): IResponse {
        let response = new SuccessResponse();
        response.initialize(message, content)
        return response;
    }
}

export class ErrorResponseFactory extends ResponseFactory {
    create(message: string, content: object): IResponse {
        let response = new ErrorResponse();
        response.initialize(message, content)
        return response;
    }
}