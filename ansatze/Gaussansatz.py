import numpy as np


def build_rbf_components(img: np.ndarray, sigma: float = 1.0):
    """Bereitet Koordinaten und RGB-Werte für die Gauß-RBF-Darstellung vor."""
    h, w, _ = img.shape
    y_idx, x_idx = np.meshgrid(np.arange(h), np.arange(w), indexing="ij")
    coords = np.column_stack([x_idx.ravel(), y_idx.ravel()])
    colors = img.reshape(-1, 3).astype(float)
    return coords, colors, sigma


def latex_rbf_single(coords: np.ndarray, colors: np.ndarray, sigma: float) -> str:
    terms = [
        (
            f"({colors[i,0]:.1f},{colors[i,1]:.1f},{colors[i,2]:.1f})"
            f"\\exp(-((x-{coords[i,0]})^2+(y-{coords[i,1]})^2)/(2\\cdot{sigma}^2))"
        )
        for i in range(len(coords))
    ]

    return (
        "f(x,y) = \\frac{"
        + " + ".join(terms)
        + "}{\\sum_i \\exp(-((x-x_i)^2+(y-y_i)^2)/(2\\cdot"
        + f"{sigma}"
        + "^2))}"
    )


if __name__ == "__main__":
    img = np.random.randint(0, 256, (5, 5, 3), dtype=np.uint8)
    coords, colors, sigma = build_rbf_components(img, sigma=1.0)
    print(latex_rbf_single(coords, colors, sigma))
