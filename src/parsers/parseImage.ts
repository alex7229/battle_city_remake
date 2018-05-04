interface FS {
  readFileSync(path: string): Buffer;
}

interface Image {
  height: number;
  width: number;
  data: Buffer;
}

export interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface ParsedImage {
  width: number;
  height: number;
  pixels: RGBA[][];
}

interface PNG {
  sync: {
    read(data: Buffer): Image;
  };
}

interface SplitInParts {
  <T>(input: Array<T>, partLength: number): Array<Array<T>>;
}

export const parseImage = (fs: FS, png: PNG, path: string, splitInParts: SplitInParts): ParsedImage => {
  const imageBuffer = fs.readFileSync(path);
  const image = png.sync.read(imageBuffer);
  const pixels: RGBA[] = splitInParts([...image.data], 4)
    .map(colors => {
      const [red, green, blue, alpha] = colors;
      return { red, green, blue, alpha };
    });
  return {
    width: image.width,
    height: image.height,
    pixels: splitInParts(pixels, image.width)
  };
};