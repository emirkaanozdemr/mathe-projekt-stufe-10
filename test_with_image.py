from __future__ import annotations

import argparse
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

import numpy as np
from PIL import Image

from ansatze.Fourieransatz import compute_fourier_coeffs, latex_fourier_ams
from ansatze.Gaussansatz import build_rbf_components, latex_rbf_single
from ansatze.Polynomansatz import fit_polynomial_model, latex_polynomial_ams

STANDARD_BILD_URL = "https://kultur.istanbul/gorsel/2025/07/yildizli-gece-1889_1000x792.jpg"
AUSGABE_ORDNER = Path("outputs")


def load_image(source: str, max_size: tuple[int, int]) -> np.ndarray:
    """Lädt ein Bild von URL oder lokalem Pfad und gibt ein RGB-Array zurück."""
    if source.startswith("http://") or source.startswith("https://"):
        try:
            with urlopen(source) as response:
                img = Image.open(response).convert("RGB")
        except URLError as exc:
            raise RuntimeError(
                "Das Bild konnte nicht von der URL geladen werden. "
                "Möglicherweise blockiert Netzwerk/Proxy den Zugriff. "
                "Bitte lokal speichern und mit --image übergeben."
            ) from exc
    else:
        img = Image.open(source).convert("RGB")

    img = img.resize(max_size, Image.Resampling.LANCZOS)
    return np.array(img, dtype=np.uint8)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Führt Polynom-, Gauß-RBF- und Fourier-Ansatz für ein Bild aus."
    )
    parser.add_argument(
        "--url",
        default=STANDARD_BILD_URL,
        help="Bild-URL für den Test (Standard: vorgegebene Sternennacht-URL).",
    )
    parser.add_argument(
        "--image",
        default=None,
        help="Lokaler Bildpfad. Wenn gesetzt, wird statt URL verwendet.",
    )
    parser.add_argument("--width", type=int, default=8, help="Breite nach Skalierung.")
    parser.add_argument("--height", type=int, default=8, help="Höhe nach Skalierung.")
    parser.add_argument(
        "--sigma", type=float, default=1.3, help="Gauß-Sigma für den RBF-Ansatz."
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    AUSGABE_ORDNER.mkdir(exist_ok=True)

    source = args.image if args.image else args.url
    img = load_image(source=source, max_size=(args.width, args.height))
    h, w, _ = img.shape

    poly, models = fit_polynomial_model(img, degree=2)
    poly_latex = latex_polynomial_ams(poly, models)

    coords, colors, sigma = build_rbf_components(img, sigma=args.sigma)
    rbf_latex = latex_rbf_single(coords, colors, sigma)

    F = compute_fourier_coeffs(img)
    fourier_latex = latex_fourier_ams(F, width=w, height=h, n_terms_u=3, n_terms_v=3)

    poly_path = AUSGABE_ORDNER / "polynomial_output.tex"
    rbf_path = AUSGABE_ORDNER / "gaussian_rbf_output.tex"
    fourier_path = AUSGABE_ORDNER / "fourier_output.tex"

    poly_path.write_text(poly_latex, encoding="utf-8")
    rbf_path.write_text(rbf_latex, encoding="utf-8")
    fourier_path.write_text(fourier_latex, encoding="utf-8")

    print(f"Quelle: {source}")
    print(f"Bildgröße nach Skalierung: {w}x{h}")
    print("\n--- Polynom-Ansatz ---\n")
    print(poly_latex)
    print("\n--- Gauß-RBF-Ansatz ---\n")
    print(rbf_latex)
    print("\n--- Fourier-Ansatz ---\n")
    print(fourier_latex)

    print("\nAusgabedateien:")
    print(f"- {poly_path.as_posix()}")
    print(f"- {rbf_path.as_posix()}")
    print(f"- {fourier_path.as_posix()}")


if __name__ == "__main__":
    main()
