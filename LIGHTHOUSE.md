# Lighthouse-Ergebnisse

Diese Datei dokumentiert die wichtigsten Lighthouse- und
Laufzeitmessungen von DARIO.exe. Historische Originalberichte und die
kompakten Messdaten des aktuellen Audits bleiben als Nachweise im Projekt.

## Performance-Audit des v1.5-Entwicklungsstands

**Testdatum:** 25. August 2026

**Testziel:** lokaler v1.5-Entwicklungsstand

**Browser:** Google Chrome 151.0.7922.174

**Lighthouse-Version:** 13.4.1

**Betriebssystem:** Microsoft Windows Build 10.0.26200.9278

**Desktop-Profil:** 1350 × 940 Pixel, ohne Lighthouse-Drosselung

**Mobile-Profil:** 390 × 844 Pixel, Lighthouse-Mobile-Emulation mit
simulierter Netzwerk- und CPU-Drosselung

Jeder der acht Zustände wurde dreimal gemessen. Die Tabellen zeigen den
Median und nicht den besten Einzelwert. Für Winter und Nicht-Winter wurden
temporäre lokale Testseiten mit einem festen Dezember- beziehungsweise
August-Datum verwendet. Die öffentliche Website und die zentrale
Datumslogik wurden dafür nicht verändert.

### Kategorie-Ergebnisse

| Profil | Oberfläche | Winter | Performance | Barrierefreiheit | Best Practices | SEO |
|---|---|---:|---:|---:|---:|---:|
| Desktop | DARIO.exe 2026 | Aus | 100 | 100 | 100 | 100 |
| Desktop | DARIO.exe 2026 | An | 100 | 100 | 100 | 100 |
| Desktop | Win98 | Aus | 100 | 100 | 100 | 100 |
| Desktop | Win98 | An | 100 | 100 | 100 | 100 |
| Mobile-Emulation | DARIO.exe 2026 | Aus | 91 | 100 | 100 | 100 |
| Mobile-Emulation | DARIO.exe 2026 | An | 91 | 100 | 100 | 100 |
| Mobile-Emulation | Win98 | Aus | 91 | 100 | 100 | 100 |
| Mobile-Emulation | Win98 | An | 91 | 100 | 100 | 100 |

### Desktop-Medianwerte

| Oberfläche | Winter | FCP | LCP | TBT | CLS | Speed Index | Main Thread |
|---|---:|---:|---:|---:|---:|---:|---:|
| DARIO.exe 2026 | Aus | 0,446 s | 0,671 s | 0 ms | 0,003 | 0,446 s | 398 ms |
| DARIO.exe 2026 | An | 0,447 s | 0,673 s | 0 ms | 0,003 | 0,593 s | 537 ms |
| Win98 | Aus | 0,447 s | 0,671 s | 0 ms | 0,004 | 0,640 s | 370 ms |
| Win98 | An | 0,447 s | 0,692 s | 0 ms | 0,004 | 0,626 s | 446 ms |

### Mobile-Medianwerte

| Oberfläche | Winter | FCP | LCP | TBT | CLS | Speed Index | Main Thread |
|---|---:|---:|---:|---:|---:|---:|---:|
| DARIO.exe 2026 | Aus | 1,957 s | 3,235 s | 0 ms | 0,018 | 1,957 s | 1.280 ms |
| DARIO.exe 2026 | An | 1,959 s | 3,236 s | 0 ms | 0,018 | 1,959 s | 1.818 ms |
| Win98 | Aus | 1,957 s | 3,237 s | 0 ms | 0,020 | 1,998 s | 1.243 ms |
| Win98 | An | 1,960 s | 3,237 s | 0 ms | 0,020 | 1,960 s | 1.565 ms |

Der Mobile-LCP wird durch den bewusst sichtbaren Start-Loader geprägt.
Winter erhöht die gemessene Main-Thread-Arbeit, verändert aber weder den
Performance-Score noch den Median von TBT oder LCP relevant. Nur ein Lauf
von „Mobile 2026 + Winter“ enthielt 11 ms TBT; der Median bleibt 0 ms.

### Stabile Desktop-CPU

Die gesamte isolierte Chrome-Prozessgruppe wurde nach sechs Sekunden
Stabilisierung in drei Zeitfenstern zu je vier Sekunden gemessen. Die Werte
sind auf die gesamte Kapazität von 32 logischen Prozessoren normiert.

| Oberfläche | Winter | gemessener CPU-Bereich |
|---|---:|---:|
| DARIO.exe 2026 | Aus | 1,38–3,87 % |
| DARIO.exe 2026 | An | 2,32–3,55 % |
| Win98 | Aus | 0,82–2,39 % |
| Win98 | An | 1,89–2,75 % |

Diese Desktop-Labormessung ist zwischen den vier Zuständen vergleichbar.
Sie ist kein Messwert eines realen Smartphones. Mobile CPU und Mobile
Speicher wurden deshalb nicht mit einer erfundenen Zahl ergänzt.

### Laufzeit-, Resize- und Wiederholungstest

- Alle acht Zustände liefen stabil mit genau einem Partikel-/Schnee-Loop
  über `requestAnimationFrame` und einem Matrix-Intervall.
- Nach zwölf Wechseln zwischen DARIO.exe 2026 und Win98 blieben diese Zahlen
  unverändert; temporäre Zeitreise-Elemente waren vollständig entfernt.
- Nach sechs Desktop-/Mobile-Resizes passten sich beide Canvas-Flächen an;
  es entstanden keine zusätzlichen Loops oder Long Tasks.
- In den instrumentierten Zuständen wurden keine Long Tasks, doppelten
  Ressourcen-URLs, horizontalen Überläufe oder Konsolenfehler gefunden.
- Der kurze Wiederholungstest zeigte kein monotones Speicherwachstum:
  Der erfasste JS-Heap lag vor den Wechseln bei 7.592.025 Bytes, nach zwölf
  Wechseln bei 5.423.138 Bytes und nach dem Resize-Test bei 6.513.118 Bytes.
  Das ist ein Indiz gegen ein offensichtliches Leck, ersetzt aber keine
  langfristige Heap-Snapshot-Analyse.
- Bei `prefers-reduced-motion` sind Matrix und Schnee nach der Optimierung
  weiterhin korrekt sichtbar, aber ohne dauerhaften Canvas-Loop
  (`requestAnimationFrame`: 0, Intervall: 0).

Eine belastbare FPS-Zahl wurde nicht dokumentiert: Der In-App-Browser
drosselte beziehungsweise beschleunigte `requestAnimationFrame`, sobald
sein Sichtbarkeitszustand wechselte. Diese Laborzahl wäre keine reale
Website-Framerate gewesen. Die Lighthouse-Traces und interaktiven Tests
zeigten jedoch keine Long Tasks oder sichtbare schrittweise Verschlechterung.

### Gezielte Korrekturen aus dem Audit

- Der bei Reduced Motion noch laufende langsame Schnee-Loop wurde durch ein
  statisches, weiterhin sichtbares Schneebild ersetzt.
- Zwei kontrastarme Texte im Zustand „Win98 + Winter“ wurden korrigiert.
  Der anschließende sechsfach ausgeführte Desktop-/Mobile-Nachtest erreichte
  dort ebenfalls jeweils 100 Punkte Barrierefreiheit.
- Normale Animationen, Effektmengen und das sichtbare Design wurden nicht
  vorsorglich reduziert.

### Ressourcen

Der Median lag bei rund 1.545 KiB und 34 Requests; „DARIO.exe 2026 +
Winter“ benötigte durch die zusätzliche saisonale Ressource 35 Requests.
Die größte Datei ist weiterhin `assets/images/Dario-profile.webp` mit rund
1.198 KiB Transfer. Lighthouse nennt dafür rund 1.177 KiB mögliches
Einsparpotenzial. Zusätzlich werden etwa 77 KiB ungenutztes CSS und 28 KiB
ungenutztes JavaScript gemeldet. Diese gemeinsamen Mehrseiten-Dateien und
das Portrait wurden in diesem gezielten Audit nicht umgebaut, weil dafür
responsive Bildvarianten beziehungsweise eine größere Aufteilung der
gemeinsamen Styles und Übersetzungen nötig wäre.

Die kompakten Roh- und Medianwerte aller 24 Lighthouse-Läufe, die
CPU-Einzelmessungen und die Einschränkungen stehen in
[`lighthouse-v1.5-2026-08-25/measurements.json`](lighthouse-v1.5-2026-08-25/measurements.json).

## Historischer Live-Test v1.2.1

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
