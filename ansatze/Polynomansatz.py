import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures


def fit_polynomial_model(img: np.ndarray, degree: int = 2):
    """Passt ein Polynom-Regressionsmodell pro RGB-Kanal an."""
    h, w, _ = img.shape
    x = np.arange(w)
    y = np.arange(h)
    xx, yy = np.meshgrid(x, y)
    coords = np.column_stack([xx.ravel(), yy.ravel()])
    colors = img.reshape(-1, 3).astype(float)

    poly = PolynomialFeatures(degree=degree)
    X_poly = poly.fit_transform(coords)
    models = [LinearRegression().fit(X_poly, colors[:, c]) for c in range(3)]

    return poly, models


def latex_polynomial_ams(poly, models) -> str:
    feature_names = poly.get_feature_names_out(["x", "y"])
    terms = []
    for j, name in enumerate(feature_names):
        coef = [models[c].coef_[j] for c in range(3)]
        terms.append(
            f"\\left({coef[0]:.3f},{coef[1]:.3f},{coef[2]:.3f}\\right){name}"
        )

    intercept = tuple(models[c].intercept_ for c in range(3))
    intercept_fmt = f"({intercept[0]:.3f},{intercept[1]:.3f},{intercept[2]:.3f})"
    return "\\[\n f(x,y) = " + " + ".join(terms) + f" + {intercept_fmt} \n\\]"


if __name__ == "__main__":
    img = np.random.randint(0, 256, (5, 5, 3), dtype=np.uint8)
    poly, models = fit_polynomial_model(img, degree=2)
    print(latex_polynomial_ams(poly, models))
