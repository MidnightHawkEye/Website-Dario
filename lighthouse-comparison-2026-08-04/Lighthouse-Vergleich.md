# Lighthouse-Vergleich: GSAP vs. eigene Animationen

Datum: 4. August 2026  
Lighthouse: 13.4.1  
Chrome: HeadlessChrome 150  
Profil: Mobile, 412 × 823 px, simulierte Drosselung

## Verglichene Versionen

- **Vorher:** Git-Commit `036bbe1` (`Code Cleanup`) mit GSAP 3.12.5 und ScrollTrigger 3.12.5.
- **Nachher:** Aktueller Stand mit CSS-Keyframes und eigenem JavaScript auf Basis von `IntersectionObserver`.

Beide Versionen wurden als getrennte statische Websites lokal bereitgestellt. Für jede Version wurden drei identische Lighthouse-Läufe durchgeführt. Die folgende Tabelle verwendet die Medianwerte. Dadurch beeinflusst ein einzelner schwankender Lauf das Ergebnis weniger stark.

## Medianvergleich

| Messwert | Vorher: GSAP | Nachher: Eigenbau | Veränderung |
|---|---:|---:|---:|
| Performance | 100 | 100 | 0 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| First Contentful Paint | 1,356 s | 1,357 s | +0,001 s |
| Largest Contentful Paint | 1,658 s | 1,659 s | +0,001 s |
| Speed Index | 1,356 s | 1,357 s | +0,001 s |
| Total Blocking Time | 0 ms | 0 ms | 0 ms |
| Cumulative Layout Shift | 0,018 | 0,018 | 0 |
| Main-Thread-Arbeit | 1.525 ms | 1.230 ms | **−295 ms (−19,3 %)** |
| JavaScript-Bootup | 210 ms | 173 ms | **−37 ms (−17,6 %)** |
| Gesamter Transfer | 1.335,0 KB | 1.294,7 KB | **−40,3 KB (−3,0 %)** |
| Netzwerk-Requests | 27 | 25 | **−2 Requests** |

## Einzelne Lighthouse-Läufe

| Version | Lauf 1 | Lauf 2 | Lauf 3 | Median |
|---|---:|---:|---:|---:|
| Performance vorher | 100 | 100 | 100 | 100 |
| Performance nachher | 99 | 100 | 100 | 100 |
| Accessibility vorher/nachher | 100 | 100 | 100 | 100 |
| Best Practices vorher/nachher | 100 | 100 | 100 | 100 |
| SEO vorher/nachher | 100 | 100 | 100 | 100 |

## Animationscode im Netzwerk

### Vorher

| Ressource | Übertragene Größe |
|---|---:|
| `gsap.min.js` | 25.819 Bytes |
| `ScrollTrigger.min.js` | 16.570 Bytes |
| `gsap-animations.js` | 1.361 Bytes |
| **Summe** | **43.750 Bytes** |

### Nachher

| Ressource | Übertragene Größe |
|---|---:|
| `motion-animations.js` | 1.938 Bytes |

Der übertragene Animationscode wurde damit um **41.812 Bytes beziehungsweise 95,6 %** reduziert. Gleichzeitig entfallen zwei externe CDN-Anfragen.

## Bewertung

Die neue Implementierung hält die bereits sehr guten Lighthouse-Scores vollständig. FCP, LCP und Speed Index unterscheiden sich im Median nur um eine Millisekunde und sind damit praktisch unverändert.

Der messbare Vorteil liegt bei der Ausführung: Die eigene Lösung benötigt etwa 19 % weniger Main-Thread-Arbeit und etwa 18 % weniger JavaScript-Bootup-Zeit. Zusätzlich werden zwei Netzwerk-Requests und rund 40 KB Gesamttransfer eingespart.

## Fazit

Die selbst geschriebenen Animationen sind aus Performance-Sicht die bessere Variante. Sie liefern dieselben sichtbaren Lade- und Qualitätswerte, reduzieren aber Abhängigkeiten, Netzwerkverkehr und JavaScript-Arbeit deutlich.

Als repräsentative Originalberichte wurden die Läufe mit den jeweils mittleren Main-Thread-Werten ausgewählt:

- Vorher: `before-run3`
- Nachher: `after-run2`

