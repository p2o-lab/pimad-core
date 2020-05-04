import {WebPEAStoreFactory, WebPEAStore} from './PEAPool/PEAStore'

const factory = new WebPEAStoreFactory();
const pool = factory.create()

while (true) {
    pool.start();
}