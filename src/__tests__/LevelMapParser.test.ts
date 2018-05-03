import { parseImageFactory } from '../parseImageFactory';
import { LevelMapParser } from '../LevelMapParser';
import { flattenArray } from '../utils';

describe('parsing map image into level config data', () => {

  const image = parseImageFactory('./prerequisites/levels/Battle_City_Stage04.png');
  const iceImage = parseImageFactory('./prerequisites/levels/Battle_City_Stage24.png');
  const defaultParams = {
    mapImage: image,
    flattenArray: jest.fn()
  };

  it('should return block with one pixel width and height', () => {
    const parser = new LevelMapParser(defaultParams);
    const topLeft = { row: 0, column: 0 };
    const bottomRight = { row: 1, column: 1 };
    expect(parser.getBlock(topLeft, bottomRight)).toEqual([[{red: 0, green: 0, blue: 0, alpha: 255}]]);
  });

  it('should return 16 * 20 blocks correctly', () => {
    const parser = new LevelMapParser(defaultParams);
    const topLeft = { row: 12, column: 12 };
    const bottomRight = { row: 28, column: 32 };
    const block = parser.getBlock(topLeft, bottomRight);
    expect(block.length).toBe(16);
    expect(block.every((row) => row.length === 20)).toBe(true);
  });

  it('should divide on blocks correctly', () => {
    const parser = new LevelMapParser(defaultParams);
    parser.divideOnBlocks();
    const randomBlock = parser.blocks[6][6];
    expect(parser.blocks.length).toBe(parser.blocksCount);
    expect(parser.blocks.every(block => block.length === parser.blocksCount)).toBe(true);
    expect(randomBlock.bottomLeft).toBe(null);
    expect(randomBlock.bottomRight).toBe(null);
    expect(randomBlock.topLeft).toBe(null);
    expect(randomBlock.topRight).toBe(null);
    expect(randomBlock.pixels.length).toBe(parser.blockWidth);
    expect(randomBlock.pixels.every(row => row.length === parser.blockWidth)).toBe(true);
  });

  it.skip('should parse black blocks correctly', () => {
    const parser = new LevelMapParser(defaultParams);
    parser.divideOnBlocks();
    parser.parseBlock(0, 0);
    let block = parser.blocks[0][0];
    delete block.pixels;
    expect(block).toEqual({
      topLeft: 'empty',
      topRight: 'empty',
      bottomLeft: 'empty',
      bottomRight: 'empty'
    });
  });

  it('should validate black block as empty', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    parser.divideOnBlocks();
    const blackBlock = parser.blocks[0][0];
    const greenBlock = parser.blocks[0][1];
    expect(parser.isBlockEmpty(blackBlock.pixels)).toBe(true);
    expect(parser.isBlockEmpty(greenBlock.pixels)).toBe(false);
  });

  it('should validate whole grass block', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    parser.divideOnBlocks();
    const blackBlock = parser.blocks[0][0];
    const greenBlock = parser.blocks[0][1];
    expect(parser.isBlockGrass(blackBlock.pixels)).toBe(false);
    expect(parser.isBlockGrass(greenBlock.pixels)).toBe(true);
  });

  it('should validate whole water block', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    parser.divideOnBlocks();
    const blackBlock = parser.blocks[0][0];
    const waterBlock = parser.blocks[5][0];
    expect(parser.isBlockWater(blackBlock.pixels)).toBe(false);
    expect(parser.isBlockWater(waterBlock.pixels)).toBe(true);
  });

  it('should validate whole steel and ice block', () => {
    const parser = new LevelMapParser({mapImage: iceImage, flattenArray});
    parser.divideOnBlocks();
    const steelBlock = parser.blocks[0][2];
    const iceBlock = parser.blocks[12][12];
    expect(parser.isBlockSteel(steelBlock.pixels)).toBe(true);
    expect(parser.isBlockSteel(iceBlock.pixels)).toBe(false);
    expect(parser.isBlockIce(steelBlock.pixels)).toBe(false);
    expect(parser.isBlockIce(iceBlock.pixels)).toBe(true);
  });

  it('should validate whole brick and base block', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    parser.divideOnBlocks();
    const brickBlock = parser.blocks[6][2];
    const baseBlock = parser.blocks[6][12];
    expect(parser.isBlockBrick(brickBlock.pixels)).toBe(true);
    expect(parser.isBlockBrick(baseBlock.pixels)).toBe(false);
  });

});