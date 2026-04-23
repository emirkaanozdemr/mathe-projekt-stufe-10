import numpy as np


def compute_fourier_coeffs(img: np.ndarray):
    """Berechnet die 2D-FFT pro RGB-Kanal."""
    return [np.fft.fft2(img[:, :, c].astype(float)) for c in range(3)]


def latex_fourier_ams(F, width: int, height: int, n_terms_u: int = 2, n_terms_v: int = 2):
    terms = []
    for u in range(min(n_terms_u, height)):
        for v in range(min(n_terms_v, width)):
            coef = [F[c][u, v] for c in range(3)]
            a = [np.real(c) for c in coef]
            b = [np.imag(c) for c in coef]
            inside = ",".join(
                [
                    (
                        f"{a[i]:.3f}\\cos(2\\pi({u}x/{width}+{v}y/{height}))"
                        f" - {b[i]:.3f}\\sin(2\\pi({u}x/{width}+{v}y/{height}))"
                    )
                    for i in range(3)
                ]
            )
            terms.append("\\left(" + inside + "\\right)")

    return "\\[\n f(x,y) = " + " + ".join(terms) + "\n\\]"


if __name__ == "__main__":
    img = np.random.randint(0, 256, (5, 5, 3), dtype=np.uint8)
    h, w, _ = img.shape
    F = compute_fourier_coeffs(img)
    print(latex_fourier_ams(F, width=w, height=h, n_terms_u=2, n_terms_v=2))
