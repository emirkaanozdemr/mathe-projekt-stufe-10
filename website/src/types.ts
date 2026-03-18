export type MethodKey = 'polynomial' | 'gaussian' | 'fourier';

export type RGB = [number, number, number];

export interface SamplePoint {
  x: number;
  y: number;
  color: RGB;
}

export interface ImageDataSummary {
  imageUrl: string;
  width: number;
  height: number;
  gridWidth: number;
  gridHeight: number;
  points: SamplePoint[];
}

export interface FormulaResult {
  latex: string;
  summary: string;
  details: string[];
}
