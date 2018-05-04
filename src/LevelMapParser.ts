import { ParsedImage, RGBA } from './parseImage';

interface Coordinate {
  row: number;
  column: number;
}

interface Block {
  pixels: RGBA[][];
}

interface BlockData {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

interface FlattenArray {
  <T>(input: Array<Array<T>>): Array<T>;
}

interface Config {
  mapImage: ParsedImage;
  flattenArray: FlattenArray;
  blocksCount?: number;
  blockWidth?: number;
}

export class LevelMapParser {

  public blocks: Block[][] = [];
  public blocksCount: number;
  public blockWidth: number;
  public flattenArray: FlattenArray;

  private mapImage: ParsedImage;

  constructor(config: Config) {
    this.mapImage = config.mapImage;
    this.blocksCount = config.blocksCount ? config.blocksCount : 13;
    this.blockWidth = config.blockWidth ? config.blockWidth : 16;
    this.flattenArray = config.flattenArray;
    this.divideOnBlocks();
  }

  getBlock(topLeft: Coordinate, bottomRight: Coordinate): RGBA[][] {
    return this.mapImage.pixels
      .slice(topLeft.row, bottomRight.row)
      .map(row => row.slice(topLeft.column, bottomRight.column));
  }

  divideOnBlocks() {
    for (let row = 0; row < this.blocksCount; row++) {
      this.blocks.push([]);
      for (let column = 0; column < this.blocksCount; column++) {
        const topLeft: Coordinate = {
          row: row * this.blockWidth,
          column: column * this.blockWidth
        };
        const bottomRight: Coordinate = {
          row: (row + 1) * this.blockWidth,
          column: (column + 1) * this.blockWidth
        };
        this.blocks[row].push({
          pixels: this.getBlock(topLeft, bottomRight)
        });
      }
    }
  }

  parseAllBlocks(): BlockData[][] {
    let data: BlockData[][] = [];
    for (let row = 0; row < this.blocksCount; row ++) {
      data.push([]);
      for (let column = 0; column < this.blocksCount; column ++) {
        data[row].push(this.parseBlock(row, column));
      }
    }
    return data;
  }

  parseBlock(row: number, column: number): BlockData {
    const block = this.blocks[row][column];
    const parser = new LevelMapParser({
      mapImage: {
        width: block.pixels.length,
        height: block.pixels[0].length,
        pixels: block.pixels
      },
      flattenArray: this.flattenArray,
      blockWidth: 8,
      blocksCount: 2
    });
    return {
      topLeft: parser.getBlockType(parser.blocks[0][0].pixels),
      topRight: parser.getBlockType(parser.blocks[0][1].pixels),
      bottomLeft: parser.getBlockType(parser.blocks[1][0].pixels),
      bottomRight: parser.getBlockType(parser.blocks[1][1].pixels),
    };
  }

  findPixelsCount(pixels: RGBA[][], pixel: RGBA): number {
    return this.flattenArray(pixels)
      .filter((px) =>
        px.blue === pixel.blue &&
        px.red === pixel.red &&
        px.green === pixel.green &&
        px.alpha === pixel.alpha
      ).length;
  }

  getBlockType(pixels: RGBA[][]): string {
    const pixelsCount = this.flattenArray(pixels).length;
    const colors = {
      black: { red: 0, green: 0, blue: 0, alpha: 255 },
      grass: { red: 152, green: 232, blue: 0, alpha: 255 },
      water: { red: 64, green: 64, blue: 255, alpha: 255 },
      brick: { red: 192, green: 112, blue: 0, alpha: 255 },
      white: { red: 255, green: 255, blue: 255, alpha: 255 }
    };
    if (this.findPixelsCount(pixels, colors.black) === pixelsCount) {
      return 'black';
    }
    if (this.findPixelsCount(pixels, colors.grass) > 0) {
      return 'grass';
    }
    if (this.findPixelsCount(pixels, colors.water) > 0) {
      return 'water';
    }
    if (this.findPixelsCount(pixels, colors.brick) > 0) {
      return 'brick';
    }
    const whitePixels = this.findPixelsCount(pixels, colors.white);
    if (whitePixels > 0 && whitePixels % 16 === 0) {
      return 'steel';
    }
    if (whitePixels > 0 && whitePixels % 14 === 0) {
      return 'ice';
    }
    return 'base';
  }

}
