import {WebPEAPoolFactory} from './PEAPool/PEAPool'

const factory = new WebPEAPoolFactory();
const pool = factory.create()

while (true) {
    pool.start();
}