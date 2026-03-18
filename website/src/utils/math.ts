const EPSILON = 1e-8;

export const clampColor = (value: number): number => Math.max(0, Math.min(255, value));

export const formatNumber = (value: number, digits = 2): string => {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : rounded.toString();
};

export const gaussianElimination = (matrix: number[][], vector: number[]): number[] => {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);

  for (let pivot = 0; pivot < size; pivot += 1) {
    let maxRow = pivot;
    for (let row = pivot + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[maxRow][pivot])) {
        maxRow = row;
      }
    }

    [augmented[pivot], augmented[maxRow]] = [augmented[maxRow], augmented[pivot]];

    const pivotValue = Math.abs(augmented[pivot][pivot]) < EPSILON ? EPSILON : augmented[pivot][pivot];
    for (let col = pivot; col <= size; col += 1) {
      augmented[pivot][col] /= pivotValue;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === pivot) continue;
      const factor = augmented[row][pivot];
      for (let col = pivot; col <= size; col += 1) {
        augmented[row][col] -= factor * augmented[pivot][col];
      }
    }
  }

  return augmented.map((row) => row[size]);
};

export const solveLeastSquares = (design: number[][], target: number[]): number[] => {
  const columns = design[0]?.length ?? 0;
  const normalMatrix = Array.from({ length: columns }, () => Array(columns).fill(0));
  const normalVector = Array(columns).fill(0);

  design.forEach((row, rowIndex) => {
    for (let i = 0; i < columns; i += 1) {
      normalVector[i] += row[i] * target[rowIndex];
      for (let j = 0; j < columns; j += 1) {
        normalMatrix[i][j] += row[i] * row[j];
      }
    }
  });

  for (let i = 0; i < columns; i += 1) {
    normalMatrix[i][i] += EPSILON;
  }

  return gaussianElimination(normalMatrix, normalVector);
};

export const dftCoefficient = (
  values: number[],
  width: number,
  height: number,
  u: number,
  v: number,
): { real: number; imag: number } => {
  let real = 0;
  let imag = 0;
  const total = width * height;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const angle = (-2 * Math.PI * ((u * x) / width + (v * y) / height));
      real += values[index] * Math.cos(angle);
      imag += values[index] * Math.sin(angle);
    }
  }

  return {
    real: real / total,
    imag: imag / total,
  };
};
