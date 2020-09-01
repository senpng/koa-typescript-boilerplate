/* tslint:disable:no-var-requires */

import defaultConfig, { Config } from './config.default';

let NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === 'test') { NODE_ENV = 'development'; }
const config = require('./config.' + NODE_ENV).default as Config;

export default { ...defaultConfig, ...config };
