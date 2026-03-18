import numpy as np

img = np.random.randint(0, 256, (5,5,3)) # !!! ACHTUNG arbeitet mit zufälliger Indizierung. !!!
F = [np.fft.fft2(img[:,:,c]) for c in range(3)]

def latex_fourier_ams(N_terms=2):
    terms = []
    for u in range(N_terms):
        for v in range(N_terms):
            coef = [F[c][u,v] for c in range(3)]
            a = [np.real(c) for c in coef]
            b = [np.imag(c) for c in coef]
            term = "\\left(" + ",".join([f"{a[i]:.1f}\\cos(2\\pi({u}x/5+{v}y/5)) - {b[i]:.1f}\\sin(2\\pi({u}x/5+{v}y/5))" for i in range(3)]) + "\\right)"
            terms.append(term)
    return "\\[\n f(x,y) = " + " + ".join(terms) + "\n\\]"

print(latex_fourier_ams())
