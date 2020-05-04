#!/usr/bin/env node

import {DependencyPEAPoolFactory} from './PEAPool/PEAPool'

const factory = new DependencyPEAPoolFactory();
const pool = factory.create()

pool.start()