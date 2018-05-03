import { ParsedImage, RGBA } from './parseImage';

interface Coordinate {
  row: number;
  column: number;
}

interface Block {
  topLeft: string | null;
  bottomLeft: string | null;
  topRight: string | null;
  bottomRight: string | null;
  pixels: RGBA[][];
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
          topLeft: null,
          bottomLeft: null,
          topRight: null,
          bottomRight: null,
          pixels: this.getBlock(topLeft, bottomRight)
        });
      }
    }
  }

  parseBlock(row: number, column: number) {
    // here new instance of this class should be created and block should be passed as image. Block count = 4
    // and block width = 4
  }

  findPixelsCount(pixels: RGBA[][], pixel: RGBA): number {
    // todo: make an abstraction from here
  }

  isBlockEmpty(pixels: RGBA[][]): boolean {
    return this.flattenArray(pixels)
      .every(pixel =>
        pixel.red === 0 && pixel.green === 0 && pixel.blue === 0 && pixel.alpha === 255
      );
  }

  isBlockGrass(pixels: RGBA[][]): boolean {
    return this.flattenArray(pixels)
      .some(pixel =>
        pixel.red === 152 && pixel.green === 232 && pixel.blue === 0 && pixel.alpha === 255
      );
  }

  isBlockWater(pixels: RGBA[][]): boolean {
    return this.flattenArray(pixels)
      .some(pixel =>
        pixel.red === 64 && pixel.green === 64 && pixel.blue === 255 && pixel.alpha === 255
      );
  }

  isBlockSteel(pixels: RGBA[][]): boolean {
    // white pixels number in steel blocks is always divisible by 16 (16, 32... etc)
    return this.flattenArray(pixels)
      .filter(pixel =>
        pixel.red === 255 && pixel.green === 255 && pixel.blue === 255 && pixel.alpha === 255
      )
      .length % 16 === 0;
  }

  isBlockIce(pixels: RGBA[][]): boolean {
    // it's the same as steel but 14
    return this.flattenArray(pixels)
      .filter(pixel =>
        pixel.red === 255 && pixel.green === 255 && pixel.blue === 255 && pixel.alpha === 255
      )
      .length % 14 === 0;
  }

  isBlockBrick(pixels: RGBA[][]): boolean {
    return this.flattenArray(pixels)
      .some(pixel =>
        pixel.red === 192 && pixel.green === 112 && pixel.blue === 0 && pixel.alpha === 255
      );
  }

  isBlockBase(pixels: RGBA[][]): boolean {

  }

}
