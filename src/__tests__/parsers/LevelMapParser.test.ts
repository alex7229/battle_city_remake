import { parseImageFactory } from '../../parsers/parseImageFactory';
import { LevelMapParser } from '../../parsers/LevelMapParser';
import { flattenArray } from '../../utils';

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
    const randomBlock = parser.blocks[6][6];
    expect(parser.blocks.length).toBe(parser.blocksCount);
    expect(parser.blocks.every(block => block.length === parser.blocksCount)).toBe(true);
    expect(randomBlock.pixels.length).toBe(parser.blockWidth);
    expect(randomBlock.pixels.every(row => row.length === parser.blockWidth)).toBe(true);
  });

  it('should parse partial steel blocks', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    expect(parser.parseBlock(3, 0)).toEqual({
      topLeft: 'steel',
      topRight: 'steel',
      bottomLeft: 'black',
      bottomRight: 'black'
    });
  });

  it('should parse partial brick blocks', () => {
    const parser = new LevelMapParser({mapImage: iceImage, flattenArray});
    expect(parser.parseBlock(5, 12)).toEqual({
      topLeft: 'black',
      topRight: 'brick',
      bottomLeft: 'black',
      bottomRight: 'brick'
    });
  });

  it('should parse whole block types correctly', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    const iceMapParser = new LevelMapParser({mapImage: iceImage, flattenArray});
    const blackBlock = parser.blocks[0][0];
    const greenBlock = parser.blocks[0][1];
    const waterBlock = parser.blocks[5][0];
    const brickBlock = parser.blocks[6][2];
    const steelBlock = iceMapParser.blocks[0][2];
    const iceBlock = iceMapParser.blocks[12][12];
    const baseBlock = parser.blocks[12][6];
    expect(parser.getBlockType(blackBlock.pixels)).toBe('black');
    expect(parser.getBlockType(greenBlock.pixels)).toBe('grass');
    expect(parser.getBlockType(waterBlock.pixels)).toBe('water');
    expect(parser.getBlockType(brickBlock.pixels)).toBe('brick');
    expect(iceMapParser.getBlockType(steelBlock.pixels)).toBe('steel');
    expect(iceMapParser.getBlockType(iceBlock.pixels)).toBe('ice');
    expect(parser.getBlockType(baseBlock.pixels)).toBe('base');
  });

  it('should calculate number of pixels correctly', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    const emptyBlock = parser.blocks[0][0];
    const blackPixel = { red: 0, green: 0, blue: 0, alpha: 255 };
    expect(parser.findPixelsCount(emptyBlock.pixels, blackPixel)).toBe(256);
  });

  it('should parse all blocks correctly', () => {
    const parser = new LevelMapParser({...defaultParams, flattenArray});
    const block = {
      topLeft: 'black',
      topRight: 'ice',
      bottomLeft: 'steel',
      bottomRight: 'brick'
    };
    const parseBlockMock = jest.fn().mockReturnValue(block);
    parser.parseBlock = parseBlockMock;
    const blocksData = parser.parseAllBlocks();
    expect(parseBlockMock.mock.calls.length).toBe(169);
    // cherry picking next
    // on fifth call it would check block with column 4 and row 0
    expect(parseBlockMock.mock.calls[5][0]).toBe(0);
    expect(parseBlockMock.mock.calls[5][1]).toBe(5);
    expect(blocksData[7][11]).toBe(block);
  });

});