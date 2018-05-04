import { FlattenArray } from '../utils';

const parseWave = (wave: string) => {
  const regExp = /([\d]{1,2}) (Power|Basic|Fast|Armor) Tanks/;
  const match = wave.match(regExp);
  if (!match) {
    return [];
  }
  const [, tanksCount, tankType] = match;
  const tanksCountInt = parseInt(tanksCount, 10);
  return Array(tanksCountInt).fill(tankType + ' Tank');
};

const parseLine = (line: string, flattenArray: FlattenArray) => {
  const [, , ...waves] = line.split('||');
  const wavesData = waves
    .map(wave => parseWave(wave))
    .filter((tanks) => tanks.length > 0);
  return flattenArray(wavesData);
};

export const parseTankWaves = (text: string, flattenArray: FlattenArray) => {
  return text
    .split('\n')
    .map(line => parseLine(line, flattenArray))
    .filter(tanks => tanks.length > 0);
};