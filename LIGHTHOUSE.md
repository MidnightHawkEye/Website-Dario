# Lighthouse-Ergebnisse

Diese Datei dokumentiert die wichtigsten Lighthouse-Messungen von
DARIO.exe. Die vollständigen HTML- und JSON-Berichte bleiben als
Originalnachweise im Projekt erhalten.

## Aktueller Live-Test

**Website:** [https://dario-exe.ch/](https://dario-exe.ch/)  
**Testdatum:** 7. August 2026  
**Getestete Website-Version:** v1.2.1  
**Lighthouse-Version:** 13.4.1  
**Testart:** Labormessung der veröffentlichten Startseite

### Kategorie-Ergebnisse

| Kategorie | Desktop | Mobile |
|---|---:|---:|
| Performance | 100 | 100 |
| Barrierefreiheit | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

### Leistungswerte

| Messwert | Desktop | Mobile |
|---|---:|---:|
| First Contentful Paint (FCP) | 0,5 s | 1,5 s |
| Largest Contentful Paint (LCP) | 0,5 s | 1,5 s |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0,003 | 0,018 |
| Speed Index | 0,6 s | 1,5 s |
| Time to Interactive | 0,5 s | 1,5 s |

Während der Messungen wurden keine Browser-Konsolenfehler und keine
Lighthouse-Laufwarnungen protokolliert.

### Originalberichte

- [Zusammenfassung mit SEO-Prüfung](lighthouse-live-2026-08-07/SEO-Performance-Lighthouse-Bericht.md)
- [Desktop-Bericht als HTML](lighthouse-live-2026-08-07/desktop.report.html)
- [Desktop-Rohdaten als JSON](lighthouse-live-2026-08-07/desktop.report.json)
- [Mobile-Bericht als HTML](lighthouse-live-2026-08-07/mobile.report.html)
- [Mobile-Rohdaten als JSON](lighthouse-live-2026-08-07/mobile.report.json)

## Vergleich der Animationsumstellung

Am 4. August 2026 wurden die frühere GSAP-Version und die neue Lösung
mit CSS-Keyframes und eigenem JavaScript in jeweils drei mobilen
Lighthouse-Läufen miteinander verglichen. Die Tabelle zeigt die
dokumentierten Medianwerte.

| Messwert | Vorher: GSAP | Nachher: Eigenbau | Veränderung |
|---|---:|---:|---:|
| Performance | 100 | 100 | 0 |
| Barrierefreiheit | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| Main-Thread-Arbeit | 1.525 ms | 1.230 ms | −295 ms (−19,3 %) |
| JavaScript-Bootup | 210 ms | 173 ms | −37 ms (−17,6 %) |
| Gesamter Transfer | 1.335,0 KB | 1.294,7 KB | −40,3 KB (−3,0 %) |
| Netzwerk-Requests | 27 | 25 | −2 Requests |

Der Animationscode selbst wurde von 43.750 Bytes auf 1.938 Bytes
reduziert. Damit sank seine übertragene Größe um 41.812 Bytes
beziehungsweise 95,6 Prozent; gleichzeitig entfielen zwei externe
CDN-Anfragen.

Der vollständige Vergleich mit allen Messwerten und den ausgewählten
Originalberichten befindet sich in der
[Lighthouse-Vergleichsdokumentation](lighthouse-comparison-2026-08-04/Lighthouse-Vergleich.md).

## Dokumentierte Optimierungsmöglichkeiten

Die folgenden Punkte stammen aus dem Live-Bericht. Sie verhinderten die
100-Punkte-Ergebnisse nicht:

- Profilbild stärker komprimieren und responsive Varianten prüfen
- EmailJS bei Bedarf später laden
- längere Cache-Laufzeiten prüfen, sofern das Hosting dies erlaubt
- Open-Graph-Daten auf den Datenschutzseiten optional ergänzen
- strukturierte Daten wie `Person` oder `WebSite` optional ergänzen

## Einordnung

Lighthouse ist eine reproduzierbare Labormessung. Die Ergebnisse
bestätigen den technischen Zustand zum jeweiligen Testzeitpunkt, ersetzen
aber keine realen Nutzerdaten und beweisen keine Suchmaschinenindexierung.

## Vorlage für zukünftige Messungen

Neue Ergebnisse werden oberhalb der älteren Messungen ergänzt. Die
zugehörigen HTML- und JSON-Berichte sollten in einem datierten Ordner
gespeichert und hier verlinkt werden.

```md
## Live-Test vom TT. Monat JJJJ

**Website:** URL
**Getestete Version:** vX.Y.Z
**Lighthouse-Version:** X.Y.Z
**Testart:** Desktop und Mobile

| Kategorie | Desktop | Mobile |
|---|---:|---:|
| Performance | – | – |
| Barrierefreiheit | – | – |
| Best Practices | – | – |
| SEO | – | – |

### Auffälligkeiten

- Keine oder konkrete Beobachtungen eintragen

### Originalberichte

- Desktop: Pfad zum HTML- und JSON-Bericht
- Mobile: Pfad zum HTML- und JSON-Bericht
```
