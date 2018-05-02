import { PNG } from 'pngjs';
import * as fs from 'fs';
import { parseImageFactory } from '../parseImageFactory';

const data = fs.readFileSync('./src/sandbox/test_image.png');
// tslint:disable-next-line: no-console
console.log(PNG.sync.read(data));
parseImageFactory('./prerequisites/levels/Battle_City_Stage04.png');