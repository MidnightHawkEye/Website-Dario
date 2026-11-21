# Blackridge Technical

Die statische Website liegt unter `/blackridge/`. Sie verwendet Schweizer Hochdeutsch und lädt ihre Bilder, Stylesheets, Icons und Skripte aus dem eigenen Ordner. DARIO.exe verweist in beiden Sprachversionen aus dem Projektbereich auf Blackridge.

## Lokal anzeigen

Starte im Stammverzeichnis des Repositorys mit Python 3 einen lokalen HTTP-Server.

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Öffne [Blackridge](http://127.0.0.1:8000/blackridge/) oder das [deutsche DARIO.exe-Portfolio](http://127.0.0.1:8000/de/). Alternativ lässt sich der Repository-Ordner mit VS Code Live Server öffnen. Blackridge braucht keinen Build. Die deutsche DARIO.exe-Seite wird wie bisher mit `node scripts/build-localized-pages.cjs` aus der Hauptseite erzeugt.

## Vor der Veröffentlichung

- Das Referenzbild, das Original-Logo und die Rechnungsvorlage lagen im Arbeitsstand nicht vor. Die Schwarz-Anthrazit-Palette mit blauen Akzenten folgt dem Textbriefing. Vergleiche den Entwurf mit der visuellen Vorlage, sobald sie verfügbar ist.
- Ersetze das vorläufige Signet unter `assets/logo/blackridge.svg` durch das Original. Hat die Originaldatei ein anderes Format, aktualisiere Logo- und Favicon-Pfade in den drei HTML-Dateien. Die Beschriftung neben dem Signet bleibt als HTML-Text verfügbar. Die Markenfarben stehen am Anfang von `css/style.css`.
- Die WebP-Motive unter `assets/images/` wurden eigens mit dem integrierten Bildgenerator als illustrative Hardwareaufnahmen erzeugt. Der Hero zeigt eine schwarz-blaue Workstation. Die fünf weiteren Bilder zeigen Aufbau, Hardwareauswahl, Kühlung, Innenreinigung und Arbeitsplatz. Passe bei einem Bildaustausch auch Alternativtext, Abmessungen und gegebenenfalls das Hero-`srcset` an.
- Die Kontakt-Schaltfläche führt zum vorhandenen Formular von DARIO.exe. Der optionale Blackridge-Entwurf wird als TXT auf das eigene Gerät geladen. Ein eigenes Geschäftsformular braucht eine freigegebene Empfängeradresse und einen tatsächlich eingerichteten Versanddienst mit passenden Datenschutzhinweisen. Prüfe die Zustellung beim bereits eingebundenen DARIO.exe-Formular, falls der Übergang genutzt wird.
- Ergänze und bestätige die Anbieterangaben, Geschäftsanschrift und veröffentlichbaren Kontaktangaben in `impressum.html`. In `datenschutz.html` sind insbesondere die verantwortliche Stelle und der tatsächliche Umgang mit Geschäftsanfragen zu ergänzen. Entferne die Vorschauhinweise und entscheide über `noindex`, sobald die Fassungen freigegeben sind.

## Auf eine eigene Domain umziehen

Kopiere den Inhalt dieses Ordners in das Stammverzeichnis der neuen Website. Die internen Seiten, Abschnitte und Assets verwenden relative Pfade. Ersetze die beiden Verweise auf den DARIO.exe-Kontakt und den Verweis auf dessen Datenschutzerklärung durch die dann gültigen Ziele. Aktualisiere anschliessend die beiden Portfolioverweise sowie bei Bedarf die Canonical- und Sitemap-Konfiguration am neuen Veröffentlichungsort.

Die Sprachkennung steht in den HTML-Seiten (`de-CH`). Für weitere Sprachfassungen können eigene HTML-Seiten dieselben Assets verwenden. Übersetze dabei auch die Validierungs- und Downloadtexte in `js/main.js`.

<details>
<summary>Bildprompts für den integrierten Bildgenerator</summary>

**Hero**

> Generate a single wide landscape 3:2 photorealistic editorial hero photograph for a premium independent PC hardware service website, Blackridge Technical. It is only the photograph: never include any text, logos, graphic labels, website UI, borders, or watermark. A real contemporary custom-built black desktop PC in a clean dark workstation, tower visible from a tasteful three-quarter angle with tempered glass on the RIGHT of the shot, realistic motherboard, GPU, subtle ice-blue ring-lit fans; one black thin-bezel monitor slightly left in the background showing an unlabelled low-luminance abstract dark blue ridgeline and a small black mechanical keyboard. Composition concentrates distinct tower and display in the RIGHT 65 percent, with tower around x=70%, subject within the central 70% vertically for wide cropping, left extremity almost charcoal black negative space that can blend into a web hero gradient. Industrial slate-black wall, realistic photography and delicate blue backlight reflected across a graphite desk. High-end dark moody commercial photography with real shadows and readable hardware details, neutral industrial palette, subtle contrast, strong blue detailing. No rainbow RGB, no smoke, no people. This scene is a generic illustrative workstation, never a purported real business photo.

**Hardwaremotive**

> Produce one 3:2 wide photorealistic commercial contact sheet exactly 3 columns × 2 rows, six equally sized rectangular photos touching edge-to-edge with zero gutter or border. This will be cut along the exact 1/3, 2/3 and 1/2 boundaries into six independent website images. Subject centered within each tile, never crossing seam, high enough contrast on every central subject. For a premium Swiss PC service website, all photos are coherent documentary product photography in charcoal environments with cold blue accent and neutral light. [Top left] Open black desktop chassis with graphics card and motherboard being assembled on a dark workbench; focus on premium mechanical interior. [Top middle] Desktop CPU processor aligned neatly beside a RAM module and motherboard on a charcoal ESD work surface, close-up hardware planning concept. [Top right] Close view of two black GPU cooling fans and silver heatsink fins inside a desktop case, lightly blue-lit diagnostic setting. [Bottom left] Actual careful PC interior cleaning, macro closeup of an anonymous hand with black glove guiding a soft antistatic brush across an exposed CPU heatsink and case fan, blade shapes visible, crisp brush and glove highlighted with a blue rim light. [Bottom middle] Modern dark PC technical workbench in front of a black wall, no human visible, angled black monitor with blue ambient backlighting, mechanical keyboard and neatly arranged precision tools; main objects centred. [Bottom right] A detailed diagonal closeup of a black PC motherboard with traces illuminated in cool blue, decorative technical context. Tight clean separation at tile boundaries. No text, no brand logos, no people or faces, no typography, no overlays, no awards, no watermarks. Wide landscape sheet.

</details>
