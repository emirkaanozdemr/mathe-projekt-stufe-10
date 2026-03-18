import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ImageSummaryCard } from './components/ImageSummaryCard';
import { MathFormula } from './components/MathFormula';
import { SampleGrid } from './components/SampleGrid';
import type { FormulaResult, ImageDataSummary, MethodKey } from './types';
import { buildFormula } from './utils/formulas';
import { loadImageSummary } from './utils/imageSampling';

const METHODS: Record<MethodKey, { title: string; description: string }> = {
  polynomial: {
    title: 'Polynomansatz',
    description: 'Approximation der Farbe mit einer Fläche zweiten Grades.',
  },
  gaussian: {
    title: 'Gauß-/RBF-Ansatz',
    description: 'Erzeugt um jedes Beispielpixel einen Gauß-Kern.',
  },
  fourier: {
    title: 'Fourier-Ansatz',
    description: 'Zerlegt das Bild in niedrigfrequente trigonometrische Anteile.',
  },
};

function App() {
  const [selectedMethod, setSelectedMethod] = useState<MethodKey>('polynomial');
  const [imageSummary, setImageSummary] = useState<ImageDataSummary | null>(null);
  const [formula, setFormula] = useState<FormulaResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageSummary?.imageUrl) {
        URL.revokeObjectURL(imageSummary.imageUrl);
      }
    };
  }, [imageSummary]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      if (imageSummary?.imageUrl) {
        URL.revokeObjectURL(imageSummary.imageUrl);
      }

      const summary = await loadImageSummary(file);
      setImageSummary(summary);
      setFormula(buildFormula(selectedMethod, summary));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Es ist ein unerwarteter Fehler aufgetreten.');
      setImageSummary(null);
      setFormula(null);
    } finally {
      setIsLoading(false);
    }
  };

  const methodOptions = useMemo(
    () =>
      (Object.entries(METHODS) as [MethodKey, { title: string; description: string }][]).map(([key, method]) => (
        <button
          key={key}
          type="button"
          className={`method-button ${selectedMethod === key ? 'active' : ''}`}
          onClick={() => {
            setSelectedMethod(key);
            if (imageSummary) {
              setFormula(buildFormula(key, imageSummary));
            }
          }}
        >
          <strong>{method.title}</strong>
          <span>{method.description}</span>
        </button>
      )),
    [imageSummary, selectedMethod],
  );

  return (
    <div className="app-shell">
      <header className="hero card">
        <p className="eyebrow">Mathe-Projekt • React + TypeScript</p>
        <h1>Wandle ein echtes Bild in eine mathematische Funktion um</h1>
        <p className="hero-copy">
          Lade ein Bild hoch, wähle eine Methode und untersuche, wie das System dieses Bild als Polynom, Gauß-Kern oder Fourier-Reihe in sauberer mathematischer Schreibweise darstellt.
        </p>
      </header>

      <main className="layout">
        <section className="card controls">
          <h2>1. Bild hochladen</h2>
          <label className="upload-box" htmlFor="image-upload">
            <input id="image-upload" type="file" accept="image/*" onChange={handleFileUpload} />
            <span>Wähle eine PNG-, JPG- oder andere Bilddatei aus</span>
          </label>

          <h2>2. Methode wählen</h2>
          <div className="methods">{methodOptions}</div>

          <h2>3. Funktion ansehen</h2>
          <p className="hint">
            Das System reduziert das Bild auf ein 4×4-Abtastgitter und erzeugt daraus je nach gewählter Methode eine vektorwertige Farbfunktion.
          </p>
          {isLoading && <p className="status">Bild wird verarbeitet…</p>}
          {error && <p className="error">{error}</p>}
        </section>

        <section className="results-column">
          {imageSummary && formula ? (
            <>
              <ImageSummaryCard summary={imageSummary} />
              <section className="card">
                <h2>Mathematische Funktion</h2>
                <p>{formula.summary}</p>
                <MathFormula latex={formula.latex} />
                <ul className="details-list">
                  {formula.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </section>
              <SampleGrid summary={imageSummary} />
            </>
          ) : (
            <section className="card empty-state">
              <h2>Hier erscheint das Ergebnis, sobald alles bereit ist</h2>
              <p>
                Lade zuerst ein Bild hoch. Danach wird die für den gewählten Ansatz erzeugte mathematische Funktion hier sauber mit KaTeX dargestellt.
              </p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
