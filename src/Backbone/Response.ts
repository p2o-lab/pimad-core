export interface IResponse {
    getMessage(): string
    getContent(): object
}

abstract class Response implements IResponse {
    protected message: string = "";
    protected content: object = {};

    constructor(message: string, content: object) {
        this.message = message;
        this.content = content;
    }

    getMessage(): string {
        return this.message;
    }

    getContent(): object {
        return this.content;
    }
}

class SuccessResponse extends  Response {

}

class ErrorResponse extends  Response {

}

export interface IResponseFactory {
    create(message: string, content: object): IResponse;
}

export abstract class ResponseFactory implements IResponseFactory {
    abstract create(message: string, content: object): IResponse;
}

export class SuccessResponseFactory extends ResponseFactory {
    create(message: string, content: object): IResponse {
        return new SuccessResponse(message, content);
    }
}

export class ErrorResponseFactory extends ResponseFactory {
    create(message: string, content: object): IResponse {
        return new ErrorResponse(message, content);
    }
}