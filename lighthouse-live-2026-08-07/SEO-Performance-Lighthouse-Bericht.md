# Live-SEO-, Performance- und Lighthouse-Bericht

**Website:** https://dario-exe.ch/  
**Testdatum:** 7. August 2026  
**Lighthouse-Version:** 13.4.1  
**Testart:** Lighthouse-Labormessung der veröffentlichten Startseite

## Lighthouse-Ergebnisse

| Kategorie | Desktop | Mobile |
|---|---:|---:|
| Performance | 100 | 100 |
| Barrierefreiheit | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

## Leistungswerte

| Messwert | Desktop | Mobile |
|---|---:|---:|
| First Contentful Paint (FCP) | 0,5 s | 1,5 s |
| Largest Contentful Paint (LCP) | 0,5 s | 1,5 s |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0,003 | 0,018 |
| Speed Index | 0,6 s | 1,5 s |
| Time to Interactive | 0,5 s | 1,5 s |

Die gemessenen Werte sind in beiden Profilen sehr gut. Während des Tests wurden keine Browser-Konsolenfehler und keine Lighthouse-Laufwarnungen protokolliert.

## Technische SEO-Prüfung

- Startseite sowie deutsche und englische Unterseiten antworten mit HTTP 200.
- `robots.txt` ist erreichbar und erlaubt das Crawling.
- `sitemap.xml` enthält sechs URLs; alle sechs liefern HTTP 200.
- Englische und deutsche Seiten besitzen passende `lang`-Attribute.
- Canonical-Links zeigen jeweils auf die korrekte eigene URL.
- `hreflang` für `en`, `de-CH` und `x-default` ist auf allen sechs Sitemap-Seiten gegenseitig eingetragen.
- Jede geprüfte Seite besitzt genau eine H1-Überschrift.
- Seitentitel und Meta-Descriptions sind auf Deutsch und Englisch vorhanden.
- Open-Graph-Titel und -Beschreibungen sind auf Startseite und DEVLOG vorhanden und sprachlich passend.
- HTTP wird permanent auf HTTPS weitergeleitet.
- `www.dario-exe.ch` wird permanent auf `dario-exe.ch` weitergeleitet.
- Eine nicht vorhandene Adresse liefert korrekt HTTP 404.
- Links sind crawlbar und verständlich beschriftet.
- Bilder besitzen Alt-Texte; Buttons und Links besitzen zugängliche Namen.

## Gefundene Optimierungsmöglichkeiten

Diese Punkte verhindern die 100-Punkte-Ergebnisse nicht, bieten aber weiteres Potenzial:

1. **Profilbild verkleinern**  
   `assets/images/Dario-profile.webp` überträgt ungefähr 1,17 MiB. Lighthouse schätzt auf Mobile rund 1,11 MiB Einsparpotenzial. Sinnvoll wären stärkere WebP-Komprimierung sowie kleinere responsive Varianten mit `srcset` und `sizes`.

2. **EmailJS später laden**  
   Das externe EmailJS-Skript befindet sich im kritischen Ladepfad. Der mobile Bericht schätzt für render-blockierende Ressourcen insgesamt rund 700 ms Potenzial. Das Skript könnte erst beim Erreichen oder Benutzen des Kontaktformulars geladen werden.

3. **Caching langfristig verbessern**  
   Die eigenen statischen Dateien wurden mit ungefähr zehn Minuten Cache-Laufzeit ausgeliefert. Lighthouse schätzt bei wiederholten Besuchen rund 1,13 MiB Potenzial. Ob längere Cache-Header konfigurierbar sind, hängt vom Hosting ab.

4. **Open Graph auf Datenschutzseiten ergänzen (optional)**  
   Die beiden Datenschutzseiten besitzen Titel und Meta-Descriptions, aber keine Open-Graph-Metadaten. Dies beeinflusst den Lighthouse-SEO-Wert nicht, würde jedoch geteilte Links einheitlicher darstellen.

5. **Strukturierte Daten (optional)**  
   Es sind aktuell keine JSON-LD-Daten vorhanden. Eine kleine `Person`-/`WebSite`-Auszeichnung könnte Suchmaschinen zusätzliche eindeutige Informationen geben. Lighthouse bewertet die Gültigkeit strukturierter Daten nur manuell.

## Einordnung

Lighthouse liefert eine reproduzierbare Labormessung und bestätigt eine technisch sehr saubere Website. Die tatsächliche Indexierung und reale Nutzerdaten werden dadurch nicht bewiesen; dafür sollte zusätzlich die Google Search Console beziehungsweise ein Felddatenbericht beobachtet werden.

