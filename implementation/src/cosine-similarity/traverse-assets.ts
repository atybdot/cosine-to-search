import fs from "node:fs";
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";
const ASSETS_DIR = path.resolve("./lib/data/images");

async function returnImagesWithMetadata(dirPath: string): Promise<unknown> {
  try {
    const files = fs.readdirSync(dirPath);
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    const images = imageFiles.map(async (file) => {
      const filePath = path.join(ASSETS_DIR, file);

      const dimensions = await imageSizeFromFile(filePath);

      return {
        file: file,
        height: dimensions.height,
        width: dimensions.width,
        type: dimensions.type,
      };
    });
    return await Promise.all(images);
  } catch (err) {
    console.error("Error reading directory:", err);
    return [];
  }
}

async function returnImageMetadata(filePath: string): Promise<unknown> {
  try {
    const dimensions = await imageSizeFromFile(filePath);
    return {
      file: path.basename(filePath),
      height: dimensions.height,
      width: dimensions.width,
      type: dimensions.type,
    };
  } catch (err) {
    console.error("Error reading image metadata:", err);
    return null;
  }
}

async function main() {
  const images = (await returnImagesWithMetadata(ASSETS_DIR)) as {
    file: string;
    height: number;
    width: number;
    type: string;
  }[];

  console.log("Metadata for 100 images:");

  let sizeOnDisk = 0;
  for (const image of images.slice(0, 100)) {
    sizeOnDisk += calcVectorSizeOnDisk({
      height: image.height,
      width: image.width,
    });
  }
  console.log(`Total size of 100 images on disk: ${sizeOnDisk} bytes`);

  console.log("Metadata for 1000 images:");

  for (const image of images.slice(100, 1000)) {
    sizeOnDisk += calcVectorSizeOnDisk({
      height: image.height,
      width: image.width,
    });
  }
  console.log(`Total size of 1000 images on disk: ${sizeOnDisk} bytes`);

  console.log("Metadata for 2000 images:");
  for (const image of images.slice(1000, 2000)) {
    sizeOnDisk += calcVectorSizeOnDisk({
      height: image.height,
      width: image.width,
    });
  }
  console.log(`Total size of 2000 images on disk: ${sizeOnDisk} bytes`);

  console.log("Metadata for all images:");
  for (const image of images.slice(2000)) {
    sizeOnDisk += calcVectorSizeOnDisk({
      height: image.height,
      width: image.width,
    });
  }
  console.log(`Total size of all images on disk: ${sizeOnDisk} bytes`);
}

function calcVectorSizeOnDisk(dim: { height: number; width: number }): number {
  return dim.height * dim.width * 4;
}
void main();
