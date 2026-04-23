import numpy as np

img = np.random.randint(0, 256, (5,5,3)) #!!! ACHTUNG arbeitet mit zufälliger Indizierung. !!!
y_idx, x_idx = np.meshgrid(np.arange(img.shape[0]), np.arange(img.shape[1]), indexing='ij')
coords = np.column_stack([x_idx.ravel(), y_idx.ravel()])
colors = img.reshape(-1,3)
sigma = 1.0

def latex_rbf_single():
    terms = [f"({colors[i,0]:.1f},{colors[i,1]:.1f},{colors[i,2]:.1f})*exp(-((x-{coords[i,0]})^2+(y-{coords[i,1]})^2)/(2*{sigma}^2))" 
             for i in range(len(coords))]
    denom = "*".join([f"exp(-((x-{coords[i,0]})^2+(y-{coords[i,1]})^2)/(2*{sigma}^2))" for i in range(len(coords))])
    return "f(x,y) = " + " + ".join(terms) + f" / sum_i exp(...)"

print(latex_rbf_single())
