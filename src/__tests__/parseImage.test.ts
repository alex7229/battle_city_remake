import * as fs from 'fs';
import { PNG } from 'pngjs';
import { parseImage } from '../parseImage';
import { splitInParts } from '../utils';

describe('parsing image logic', () => {
  it('real image parsing test', () => {
    const path = './src/sandbox/test_image.png';
    const expectedImage = {
      width: 2,
        height: 2,
        pixels: [
          [
            { red: 0, green: 0, blue: 0, alpha: 255 },
            { red: 255, green: 43, blue: 82, alpha: 255 }
          ],
          [
            { red: 48, green: 127, blue: 255, alpha: 255 },
            { red: 174, green: 255, blue: 104, alpha: 255 }
          ]
        ]
    };
    expect(parseImage(fs, PNG, path, splitInParts)).toEqual(expectedImage);
    });
});