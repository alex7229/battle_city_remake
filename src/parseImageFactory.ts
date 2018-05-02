import { parseImage } from './parseImage';
import * as fs from 'fs';
import { PNG } from 'pngjs';
import { splitInParts } from './utils';

export const parseImageFactory = (path: string) => parseImage(fs, PNG, path, splitInParts);