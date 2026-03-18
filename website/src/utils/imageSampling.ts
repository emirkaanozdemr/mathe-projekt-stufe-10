import type { ImageDataSummary, RGB, SamplePoint } from '../types';

const DEFAULT_GRID_WIDTH = 4;
const DEFAULT_GRID_HEIGHT = 4;

const averageChannel = (data: Uint8ClampedArray, indices: number[]): RGB => {
  const sum: RGB = [0, 0, 0];

  indices.forEach((pixelIndex) => {
    sum[0] += data[pixelIndex];
    sum[1] += data[pixelIndex + 1];
    sum[2] += data[pixelIndex + 2];
  });

  return [
    Math.round(sum[0] / indices.length),
    Math.round(sum[1] / indices.length),
    Math.round(sum[2] / indices.length),
  ];
};

export const loadImageSummary = async (
  file: File,
  gridWidth = DEFAULT_GRID_WIDTH,
  gridHeight = DEFAULT_GRID_HEIGHT,
): Promise<ImageDataSummary> => {
  const imageUrl = URL.createObjectURL(file);

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('Das Bild konnte nicht geladen werden.'));
    element.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Der Canvas-Kontext konnte nicht erstellt werden.');
  }

  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, image.width, image.height);

  const points: SamplePoint[] = [];

  for (let gridY = 0; gridY < gridHeight; gridY += 1) {
    const startY = Math.floor((gridY * image.height) / gridHeight);
    const endY = Math.floor(((gridY + 1) * image.height) / gridHeight);

    for (let gridX = 0; gridX < gridWidth; gridX += 1) {
      const startX = Math.floor((gridX * image.width) / gridWidth);
      const endX = Math.floor(((gridX + 1) * image.width) / gridWidth);
      const indices: number[] = [];

      for (let y = startY; y < Math.max(endY, startY + 1); y += 1) {
        for (let x = startX; x < Math.max(endX, startX + 1); x += 1) {
          indices.push((y * image.width + x) * 4);
        }
      }

      points.push({
        x: gridX,
        y: gridY,
        color: averageChannel(data, indices),
      });
    }
  }

  return {
    imageUrl,
    width: image.width,
    height: image.height,
    gridWidth,
    gridHeight,
    points,
  };
};
