//import { CommunicationInterfaceData } from './CommunicationInterfaceData';
import {Response, ResponseVendor} from '../Backbone/Response';

export interface DataItem {
    getCommunicationInterfaceData(tag: string): Response; //CommunicationInterfaceData;
    getDataType(): Response; //string;
}

abstract class ADataItem implements DataItem {

    protected logger: any; //not defined yet
    protected cIData: any; //CommunicationInterfaceData
    protected name: string;
    protected initialized: boolean;
    protected responseVendor: ResponseVendor;

    constructor() {
        this.logger=null; //new Logger();
        this.cIData=null;
        this.name='';
        this.initialized = false;
        this.responseVendor = new ResponseVendor();
    }

    getCommunicationInterfaceData(tag: string): Response{
        // returns CommunicationInterfaceData
        // add Operations for InterfaceData by tag : CommunicationInterfaceData
        //select specific CommunicationInterfaceData out of CommunicationInterfaceData[] where CommunicationInterfaceData.name equals tag?
        //missing method for CommunicationInterfaceData?
        return this.responseVendor.buyErrorResponse();
    }
    getDataType(): Response{
    return this.responseVendor.buyErrorResponse();
    }
}

export class BaseDataItem extends ADataItem {
}

export interface DataItemFactory {
    create(): DataItem;
}
abstract class ADataItemFactory implements DataItemFactory {
    abstract create(): DataItem;
}
export class BaseDataItemFactory extends ADataItemFactory {
    create(): DataItem{return new BaseDataItem();}
}
