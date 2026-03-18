import type { ImageDataSummary } from '../types';

interface SampleGridProps {
  summary: ImageDataSummary;
}

export function SampleGrid({ summary }: SampleGridProps) {
  return (
    <section className="card">
      <h2>Abgetastetes Pixelraster</h2>
      <div
        className="sample-grid"
        style={{
          gridTemplateColumns: `repeat(${summary.gridWidth}, minmax(0, 1fr))`,
        }}
      >
        {summary.points.map((point) => {
          const color = `rgb(${point.color[0]}, ${point.color[1]}, ${point.color[2]})`;
          return (
            <div key={`${point.x}-${point.y}`} className="sample-cell" style={{ backgroundColor: color }}>
              <span>
                ({point.x}, {point.y})
              </span>
              <small>{color}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
