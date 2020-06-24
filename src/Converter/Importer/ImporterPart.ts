import {Response, ResponseVendor} from '../../Backbone/Response';

abstract class AImporterPart implements ImporterPart {
    protected responseVendor: ResponseVendor

    convertFrom(data: object, callback: (response: Response) => void): void {
        const localResponse = this.responseVendor.buyErrorResponse()
        localResponse.initialize('Not implemented yet!', {})
        callback(localResponse)
    }
    constructor() {
        this.responseVendor = new ResponseVendor();
    }
}

export class HMIPart extends AImporterPart {

}
export class MTPPart extends AImporterPart {

}
export class ServicePart extends AImporterPart {

}
export class TextPart extends AImporterPart {

}

export interface ImporterPart {
    convertFrom(data: object, callback: (response: Response) => void): void;
}