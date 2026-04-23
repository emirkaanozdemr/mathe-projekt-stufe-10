# Mathe Projekt Stufe 10
Mathe-Projekt von E. K. Özdemir in der Klassenstufe 10 (2025-2026)

## Test mit dem vorgegebenen Bild-Link
Der folgende Befehl lädt das Bild von der URL, skaliert es und berechnet die Funktionsdarstellungen (LaTeX) mit allen drei Methoden:

```bash
python3 test_with_image.py --url "https://kultur.istanbul/gorsel/2025/07/yildizli-gece-1889_1000x792.jpg" --width 8 --height 8
```

## Test mit lokaler Datei (falls URL blockiert ist)
Wenn der Zugriff auf URLs in der Umgebung blockiert ist, zuerst lokal speichern und dann so ausführen:

```bash
python3 test_with_image.py --image ./yildizli-gece.jpg --width 8 --height 8
```

## Ausgaben
Die Dateien werden in `outputs/` gespeichert:
- `outputs/polynomial_output.tex`
- `outputs/gaussian_rbf_output.tex`
- `outputs/fourier_output.tex`
