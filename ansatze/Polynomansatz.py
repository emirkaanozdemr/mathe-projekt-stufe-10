import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

img = np.random.randint(0, 256, (5,5,3)) # !!! ACHTUNG arbeitet mit zufälliger Indizierung. !!!

x = np.arange(img.shape[1])
y = np.arange(img.shape[0])
xx, yy = np.meshgrid(x, y)
coords = np.column_stack([xx.ravel(), yy.ravel()])
colors = img.reshape(-1,3)

poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(coords)
models = [LinearRegression().fit(X_poly, colors[:,c]) for c in range(3)]

def latex_polynomial_ams():
    feature_names = poly.get_feature_names_out(['x','y'])
    terms = []
    for j in range(len(feature_names)):
        coef = [models[c].coef_[j] for c in range(3)]
        terms.append(f"\\left({coef[0]:.1f},{coef[1]:.1f},{coef[2]:.1f}\\right){feature_names[j]}")
    intercept = tuple(models[c].intercept_ for c in range(3))
    return "\\[\n f(x,y) = " + " + ".join(terms) + f" + {intercept} \n\\]"

print(latex_polynomial_ams())
