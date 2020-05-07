import * as pino from 'pino';
export const logger = pino({
    name: 'PiMAd',
    level: 'debug'
})