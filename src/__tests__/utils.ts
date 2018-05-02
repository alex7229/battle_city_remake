import { splitInParts } from '../utils';

describe('split in parts', () => {

  it('should return whole array if array is shorter that part length', () => {
    expect(splitInParts([23, 42], 6)).toEqual([[23, 42]]);
  });

  it('should divide array in parts evenly', () => {
    expect(splitInParts([23, 24, 52], 1)).toEqual([[23], [24], [52]]);
  });

  it('should add last part of array as it is if it`s too short', () => {
    expect(splitInParts(['as', 'ma', 'da'], 2)).toEqual([['as', 'ma'], ['da']]);
  });
});