import type { FormulaResult, ImageDataSummary, MethodKey } from '../types';
import { dftCoefficient, formatNumber, solveLeastSquares } from './math';

const signedTerm = (value: number, token: string): string => {
  const formatted = formatNumber(Math.abs(value));
  return value < 0 ? `-${formatted}${token}` : `+${formatted}${token}`;
};

const polynomialFeatures = (x: number, y: number): number[] => [1, x, y, x * y, x * x, y * y];

const polynomialFormula = (summary: ImageDataSummary): FormulaResult => {
  const design = summary.points.map((point) => polynomialFeatures(point.x, point.y));
  const red = solveLeastSquares(design, summary.points.map((point) => point.color[0]));
  const green = solveLeastSquares(design, summary.points.map((point) => point.color[1]));
  const blue = solveLeastSquares(design, summary.points.map((point) => point.color[2]));
  const basis = ['1', 'x', 'y', 'xy', 'x^2', 'y^2'];

  const channelLatex = (coefficients: number[]) =>
    coefficients
      .map((coefficient, index) => `${formatNumber(coefficient)}${basis[index] === '1' ? '' : `\\,${basis[index]}`}`)
      .join(' + ');

  return {
    latex: String.raw`\mathbf{f}(x,y)=\begin{pmatrix}${channelLatex(red)}\\${channelLatex(green)}\\${channelLatex(blue)}\end{pmatrix}`,
    summary:
      'Der Polynomansatz passt die abgetasteten Pixel mit der Methode der kleinsten Quadrate an eine Fläche zweiten Grades an.',
    details: [
      `Merkmalsbasis: 1, x, y, xy, x^2, y^2`,
      `Insgesamt wurden ${summary.points.length} Stützstellen verwendet.`,
      'Für jeden Farbkanal wurde eine eigene lineare Regression gelöst.',
    ],
  };
};

const gaussianFormula = (summary: ImageDataSummary): FormulaResult => {
  const sigma = Math.max(summary.gridWidth, summary.gridHeight) / 2;
  const terms = summary.points.map((point) => {
    const exponent = String.raw`e^{-\frac{(x-${point.x})^2+(y-${point.y})^2}{2\cdot ${formatNumber(sigma)}^2}}`;
    return String.raw`\begin{pmatrix}${point.color[0]}\\${point.color[1]}\\${point.color[2]}\end{pmatrix}${exponent}`;
  });

  const denominator = summary.points
    .map((point) => String.raw`e^{-\frac{(x-${point.x})^2+(y-${point.y})^2}{2\cdot ${formatNumber(sigma)}^2}}`)
    .join(' + ');

  return {
    latex: String.raw`\mathbf{f}(x,y)=\frac{${terms.join(' + ')}}{${denominator}}`,
    summary:
      'Der Gauß-/RBF-Ansatz bildet einen gewichteten Mittelwert weicher Kerne, die jeweils auf einem Beispielpixel zentriert sind.',
    details: [
      `Es wurde der Sigma-Wert ${formatNumber(sigma)} gewählt.`,
      'Die Funktion erzeugt zwischen den Stützstellen einen weichen und stetigen Farbübergang.',
      'Durch die Normalisierung im Nenner bleibt das Gesamtgewicht ungefähr bei 1.',
    ],
  };
};

const fourierFormula = (summary: ImageDataSummary): FormulaResult => {
  const maxU = Math.min(2, summary.gridWidth - 1);
  const maxV = Math.min(2, summary.gridHeight - 1);
  const channels = [0, 1, 2].map((channelIndex) => summary.points.map((point) => point.color[channelIndex]));
  const channelTerms = channels.map((values) => {
    const terms: string[] = [];

    for (let u = 0; u <= maxU; u += 1) {
      for (let v = 0; v <= maxV; v += 1) {
        const coefficient = dftCoefficient(values, summary.gridWidth, summary.gridHeight, u, v);
        const phase = String.raw`2\pi\left(\frac{${u}x}{${summary.gridWidth}}+\frac{${v}y}{${summary.gridHeight}}\right)`;
        terms.push(
          String.raw`${formatNumber(coefficient.real)}\cos\left(${phase}\right)${signedTerm(
            -coefficient.imag,
            String.raw`\sin\left(${phase}\right)`,
          )}`,
        );
      }
    }

    return terms.join(' + ');
  });

  return {
    latex: String.raw`\mathbf{f}(x,y)=\begin{pmatrix}${channelTerms[0]}\\${channelTerms[1]}\\${channelTerms[2]}\end{pmatrix}`,
    summary:
      'Der Fourier-Ansatz beschreibt das abgetastete Bild mit niedrigfrequenten Kosinus- und Sinusanteilen.',
    details: [
      `Niedrigfrequenter Ausschnitt: u=0..${maxU}, v=0..${maxV}`,
      'Für jeden Farbkanal wurden diskrete Fourier-Koeffizienten berechnet.',
      'Die Beschränkung auf niedrige Frequenzen hält die Formel lesbar und bewahrt trotzdem die Grundstruktur.',
    ],
  };
};

export const buildFormula = (method: MethodKey, summary: ImageDataSummary): FormulaResult => {
  switch (method) {
    case 'polynomial':
      return polynomialFormula(summary);
    case 'gaussian':
      return gaussianFormula(summary);
    case 'fourier':
      return fourierFormula(summary);
    default:
      return polynomialFormula(summary);
  }
};
