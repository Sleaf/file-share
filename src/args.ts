// args
import { resolve } from 'path';

export const args = require('minimist')(process.argv);
export const filePath = resolve(args['_'][2] || '.');
export const shareDir = Boolean(args['r']);
export const sharePort = args['p'] || 8080;