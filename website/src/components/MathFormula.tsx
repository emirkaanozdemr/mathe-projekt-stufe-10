import katex from 'katex';
import { useMemo } from 'react';

interface MathFormulaProps {
  latex: string;
}

export function MathFormula({ latex }: MathFormulaProps) {
  const html = useMemo(
    () =>
      katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      }),
    [latex],
  );

  return <div className="formula" dangerouslySetInnerHTML={{ __html: html }} />;
}
