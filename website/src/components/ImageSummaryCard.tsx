import type { ImageDataSummary } from '../types';

interface ImageSummaryCardProps {
  summary: ImageDataSummary;
}

export function ImageSummaryCard({ summary }: ImageSummaryCardProps) {
  return (
    <section className="card image-card">
      <h2>Hochgeladenes Bild</h2>
      <img className="preview-image" src={summary.imageUrl} alt="Hochgeladenes Beispiel" />
      <div className="meta-grid">
        <div>
          <span>Originalauflösung</span>
          <strong>
            {summary.width} × {summary.height}
          </strong>
        </div>
        <div>
          <span>Mathematische Abtastung</span>
          <strong>
            {summary.gridWidth} × {summary.gridHeight}
          </strong>
        </div>
        <div>
          <span>Anzahl der Stützstellen</span>
          <strong>{summary.points.length}</strong>
        </div>
      </div>
    </section>
  );
}
