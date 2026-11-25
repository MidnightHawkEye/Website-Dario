# Blackridge Technical

Die statische Website liegt unter `/blackridge/`. Sie verwendet Schweizer Hochdeutsch und lädt ihre Bilder, Stylesheets, Icons und Skripte aus dem eigenen Ordner. DARIO.exe verweist in beiden Sprachversionen aus dem Projektbereich auf Blackridge.

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite mit Hero, Leistungsübersicht und Kontaktverweis |
| `leistungen/index.html` | Dienstleistungen, Ablauf und FAQ |
| `preise/index.html` | Richtpreise und Konditionen |
| `ueber-mich/index.html` | Gründer, Blackridge Approach und persönliche Entwicklung |
| `kontakt/index.html` | Kontaktformular, WhatsApp-Link und Projektstatus |
| `datenschutz/index.html` | Datenschutzerklärung für Hosting, Formular und WhatsApp |

Alle Seiten verwenden `css/style.css` und `js/main.js`. Header und Footer stehen in den HTML-Dateien, damit Links und die Markierung der aktuellen Seite ohne JavaScript funktionieren. Bei Änderungen an der Navigation sind auch `impressum/index.html` und `datenschutz/index.html` zu berücksichtigen. Die früheren Adressen `impressum.html` und `datenschutz.html` führen zu den jeweiligen Seiten weiter.

## Lokal anzeigen

Starte im Stammverzeichnis des Repositorys mit Python 3 einen lokalen HTTP-Server.

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Öffne [Blackridge](http://127.0.0.1:8000/blackridge/) oder das [deutsche DARIO.exe-Portfolio](http://127.0.0.1:8000/de/). Alternativ lässt sich der Repository-Ordner mit VS Code Live Server öffnen. Blackridge braucht keinen Build. Die deutsche DARIO.exe-Seite wird wie bisher mit `node scripts/build-localized-pages.cjs` aus der Hauptseite erzeugt.

## Kontaktformular mit Formspree einrichten

`js/contact-form.js` sendet das Formular erst beim Absenden als HTTPS-POST an Formspree und fordert eine JSON-Antwort an. `formEnabled` ist in `js/contact-form-config.js` auf `true` gesetzt. Bei deaktiviertem Versand, ohne gültige Formular-ID oder ohne JavaScript bleiben die Felder ausgeblendet. E-Mail und WhatsApp stehen als weitere Kontaktwege zur Verfügung. Das Skript legt die Eingaben weder im Local Storage noch in Cookies ab. [Formspree-Dokumentation zum AJAX-Versand](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/)

1. Erstelle ein [Formspree-Konto](https://formspree.io/register) und bestätige die Konto-E-Mail-Adresse. Lege im Dashboard unter **New Form** ein eigenes Formular für Blackridge Technical an. [Formular anlegen](https://help.formspree.io/articles/building-your-form/building-an-html-form/)
2. Hinterlege deine geschäftliche Empfängeradresse unter **Account → Linked Emails** und bestätige sie über die Verifikationsmail. Wähle sie beim Formular unter **Workflow → Actions → Email → Settings** als Zieladresse aus. Das Feld `email` der Besucher setzt den Reply-To-Header. Das Feld `subject` setzt den Betreff der Benachrichtigung. [Empfängeradresse ändern](https://help.formspree.io/articles/form-and-project-settings/changing-a-form-email-address/) · [Reply-To](https://help.formspree.io/articles/building-your-form/email-reply-to-address/) · [E-Mail-Betreff](https://help.formspree.io/articles/building-your-form/email-subject-line/)
3. Kopiere unter **Integration** aus der Formularadresse den Teil nach `/f/` in `formId` in `js/contact-form-config.js`. Für das Frontend genügt diese öffentliche ID. Die Empfängeradresse bleibt im Formspree-Konto. Zugangsdaten und geheime Schlüssel gehören weder in diese Datei noch ins Repository. [Formular-ID finden](https://help.formspree.io/articles/building-your-form/building-an-html-form/)
4. Setze im Dashboard unter **Workflow → Validation** die Felder `subject` und `message` auf **Text** und **Required** sowie `email` auf **Email** und **Required**. Setze für `message` eine Mindestlänge von zehn Zeichen. Prüfe, dass `name` optional ist und dass keine Benachrichtigungsregel einen Namen voraussetzt. Das Formular lässt `name` bei fehlender Angabe weg. Der Browser prüft zusätzlich, ob ein Betreff ausgewählt und die Datenschutzerklärung zur Kenntnis genommen wurde. Die Kenntnisnahme bleibt im Browser. [Serverseitige Validierung](https://help.formspree.io/articles/building-your-form/getting-started-with-workflow/)
5. Formspree stellt Spam-Filter bereit und unterstützt das ausgeblendete Feld `_gotcha`. Falls für dieses Formular ein externes CAPTCHA aktiv ist, deaktiviere es unter **Settings → Spam protection**, damit der AJAX-Versand ohne CAPTCHA-Schritt funktioniert. [Spam-Filter](https://formspree.io/plans/) · [Honeypot](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering/) · [reCAPTCHA-Einstellungen](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/)

Die Betreffoptionen bearbeitest du im `<select name="subject">` in `kontakt/index.html`. Die erste Option «Bitte Betreff auswählen» bleibt leer und deaktiviert. Die Werte der übrigen Optionen werden als `subject` an Formspree übermittelt. [E-Mail-Betreff](https://help.formspree.io/articles/building-your-form/email-subject-line/)

### Testversand und Domainwechsel

Öffne nach dem Eintragen der echten ID die [lokale Kontaktseite](http://127.0.0.1:8000/blackridge/kontakt/) über den HTTP-Server. Wähle einen Betreff, bestätige die Kenntnisnahme und sende eine Testnachricht mit einer eigenen Absenderadresse und ohne vertrauliche Inhalte. Prüfe die Bestätigung auf der Kontaktseite, den Eintrag in **Submissions** sowie Betreff und Reply-To-Adresse der Benachrichtigung im geschäftlichen Postfach. Die Bestätigung auf der Seite zeigt die Annahme durch Formspree. Den Eingang der E-Mail prüfst du im Postfach. Fehlt sie, prüfe die Formspree-Ordner **Spam** und **Over Limit** sowie den Spamordner des Postfachs. [Formspree-Limits](https://help.formspree.io/articles/form-and-project-settings/over-limit-submissions/)

Mit **Restrict to Domain** kannst du Formspree auf die öffentliche Domain einschränken. Teste lokal vor dem Setzen dieser Einschränkung oder mit einem eigenen Testformular, da Formspree Anfragen von nicht freigegebenen Domains anhand des HTTP-Referrers als Spam einordnen kann. Aktualisiere die Einstellung bei einem Domainwechsel und wiederhole den Test von der neuen Domain. [Domain-Einschränkung](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain/)

## WhatsApp-Link ändern und testen

Die Nummer und der Text stehen im `href` des Buttons «Über WhatsApp kontaktieren» in `kontakt/index.html`. Ersetze die Ziffern nach `https://wa.me/` durch die vollständige Nummer im internationalen Format ohne Pluszeichen, Leerzeichen oder nationale Vorwahl-Null. Hinter `?text=` folgt der URL-kodierte Nachrichtentext. Du kannst ihn mit `encodeURIComponent` erzeugen. [WhatsApp-Hilfe zu Click-to-Chat](https://faq.whatsapp.com/5913398998672934/)

Öffne die lokale Kontaktseite auf dem Smartphone und am Desktop und wähle «Über WhatsApp kontaktieren». Prüfe, ob WhatsApp oder WhatsApp Web den vorgesehenen Chat mit dem Textentwurf öffnet und die Blackridge-Seite geöffnet bleibt. Für diese Prüfung genügt es, den Chat zu öffnen. [WhatsApp-Hilfe zu Click-to-Chat](https://faq.whatsapp.com/5913398998672934/)

## Technische Datenschutzprüfung vom 22. November 2026

Die Prüfung erfasst die Blackridge-Dateien und ihr Verhalten im lokalen Chromium-Test. Geprüft wurden alle Seiten einschliesslich der beiden alten Rechtstext-Adressen, HTML, JavaScript, CSS und SVG. Im frischen Browserprofil wurden beim normalen Seitenaufruf weder Anfragen an andere Origins noch Cookies, Local Storage, Session Storage, IndexedDB oder Cache Storage beobachtet. Die Stylesheets verwenden lokale und Systemschriften. Bilder und Icons kommen aus dem Projekt. Der Code enthält keine externen Schriftdateien, Skripte, CDN-Ressourcen, iFrames, Analytics-, Tracking- oder Marketingdienste. Der Link zu DARIO.exe führt zu einem anderen Bereich derselben Domain und ist eine normale Navigation.

| Vorgang und Auslöser | Daten und Zweck | Empfänger und Prüfnachweis |
| --- | --- | --- |
| Seiten und Assets abrufen | IP-Adresse und technische Verbindungsdaten zur Auslieferung und Sicherheit | GitHub Pages. GitHub dokumentiert die Erfassung der IP-Adresse. Das lokale Browserprofil prüft die Website, während die Anbieterunterlagen die Hostingprotokolle beschreiben. [Datenerhebung bei GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) |
| Kontaktformular bei freigegebenem Versand absenden | `email`, `subject`, `message`, optional `name` und leeres `_gotcha` zur Anfragebearbeitung und Spam-Prüfung. Technische Verbindungsdaten werden beim Aufruf des Dienstes verarbeitet. | Formspree per HTTPS, danach Dashboard und je nach Workflow das konfigurierte Empfängerpostfach. Der Browser sendet die Anfrage als Multipart-POST ohne Anbieter-Cookies. Er sendet beim HTTPS-Aufruf nur die Herkunfts-Origin als Referrer, soweit der Browser einen Referrer übermittelt. [Formspree-Datenschutzerklärung](https://formspree.io/legal/privacy-policy/) |
| Datenschutzerklärung zur Kenntnis nehmen | Die Pflicht-Checkbox wird im Browser geprüft. | `js/contact-form.js` entfernt `privacy` aus `FormData`. Die Checkbox wird weder übertragen noch von der Website dauerhaft gespeichert. |
| WhatsApp-Link öffnen oder Nachricht senden | Beim Öffnen können technische Verbindungsdaten verarbeitet werden. Beim Senden kommen Chatinhalt und für den Empfänger sichtbare Kontaktdaten hinzu. | WhatsApp und bei Nachrichtenversand Dario Hasler. Beide `wa.me`-Links in Kontakt und Impressum sind normale Links. Das WhatsApp-Symbol liegt lokal. [WhatsApp-Datenschutzrichtlinie](https://www.whatsapp.com/legal/privacy-policy-eea?lang=de) |
| Direkt per E-Mail oder Telefon Kontakt aufnehmen | Beim Senden einer E-Mail Absenderadresse, Inhalt und allfällige Anhänge. Beim Telefonieren die für das Anliegen erforderlichen Angaben. | Dario Hasler sowie die beteiligten Mail- und Telefonanbieter. `mailto:` im Impressum verweist auf Gmail. Das Formspree-Zielpostfach ist davon getrennt zu prüfen. [Google-Datenschutz](https://policies.google.com/privacy?hl=de) |

Ein separater lesender Abruf der veröffentlichten Website ergab für `/blackridge/` HTTP 200. Die sechs lokalen Unterseiten unter ihren neuen Verzeichnisadressen, einschliesslich Kontakt und Datenschutz, lieferten auf dem veröffentlichten Stand HTTP 404. Der Code- und Formularbefund beschreibt den lokalen Arbeitsstand. Prüfe nach der Veröffentlichung die produktiven URLs und Browser-Anfragen erneut.

## Offene Datenschutzpunkte vor der Veröffentlichung

Die technische Aktivierung des Formulars und die Prüfung der Konto- und Vertragsangaben sind separate Schritte. Prüfe bei der Veröffentlichung, dass die deutschen und englischen Kontakt- und Rechtstextseiten gemeinsam erreichbar sind. Für den Löschablauf Zuständigkeit, Prüfrhythmus, alle Kopien und den Umgang mit Sicherungen dokumentieren. In der öffentlichen Erklärung nur die bestätigte Praxis angeben.

- **GitHub Pages:** Kläre die für das Hosting tatsächlich relevanten Empfänger, Bearbeitungsstaaten und Garantien, soweit sie aus den allgemeinen Anbieterangaben für Pages nicht hervorgehen. Die geprüften GitHub-Pages-Unterlagen nennen keine konkrete Aufbewahrungsfrist für die IP-Protokolle. [GitHub-Datenschutz](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement#international-data-transfers)
- **Formspree und Postfach:** Bestätige den Tarif, das Zielpostfach, alle Workflow-Aktionen und etwaige Weiterleitungen oder weitere Empfänger. Kläre mit den Anbietern den Datenbearbeitungsvertrag, die beteiligten Auftragsbearbeiter, die tatsächlichen Empfängerstaaten samt USA und die für die Schweiz wirksamen Garantien. Formspree nennt US-Hosting und Standardvertragsklauseln allgemein. Prüfe deren konkrete Geltung für dein Konto. [Formspree-Sicherheitsinformationen](https://formspree.io/security/) · [EDÖB zur Auftragsbearbeitung](https://www.edoeb.admin.ch/de/outsourcing-auftragsdatenbearbeitung) · [EDÖB zur Auslandsbekanntgabe](https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland)
- **Aufbewahrung und Löschung:** Lege fest, wann und wie du abgeschlossene Anfragen im Formspree-Dashboard, im Empfängerpostfach und in WhatsApp überprüfst und löschst. Berücksichtige Spam, Over Limit, Weiterleitungen und Sicherungskopien. Prüfe, wie du beim gewählten Formspree-Tarif ältere, nicht sichtbare Einträge löschen lassen kannst. Im Free-Tarif sind die letzten 30 Tage sichtbar. Die Anzeigegrenze löscht ältere Anfragen nicht. Für technische Sicherungskopien ist keine konkrete Löschfrist für dieses Konto verifiziert. [Formspree-Kontolimits](https://help.formspree.io/articles/account-management/account-limits) · [Formspree zu Over Limit](https://help.formspree.io/articles/form-and-project-settings/over-limit-submissions)
- **WhatsApp und direktes Gmail-Postfach:** Prüfe Kontoregion, Zugriff und verknüpfte Geräte, Chat-Backups, Weiterleitungen sowie deren Empfänger, Bearbeitungsstaaten und Garantien. Die öffentlichen Anbieterangaben zum Datenschutzrahmen Schweiz–USA gelten für die jeweils erfassten Übermittlungen. Sie beantworten die Fragen zu deinen Konto- und Backup-Einstellungen nicht. [WhatsApp zum Datenschutzrahmen](https://www.whatsapp.com/legal/data-privacy-framework) · [Google zu Datenübermittlungen](https://policies.google.com/privacy/frameworks?hl=de)
- **Informationspflicht:** Ergänze die Datenschutzerklärung, sobald die einzelnen Empfängerstaaten, allfällige Garantien oder Ausnahmen und die konkrete Löschpraxis feststehen. Für die Auslandsbekanntgabe sind Art. 16, 17 und 19 DSG massgeblich. [Schweizer Datenschutzgesetz](https://www.fedlex.admin.ch/eli/cc/2022/491/de) · [EDÖB zur Informationspflicht](https://www.edoeb.admin.ch/de/informationspflicht)

## Eignung von GitHub Pages

Die Website stellt Dienstleistungen und Richtpreise vor und nimmt unverbindliche Anfragen entgegen. Aufträge werden individuell vereinbart. Vor einem geschäftlichen Start die Eignung des Hostings für die konkrete Nutzung klären. GitHub Pages schränkt unter anderem den Betrieb von Online-Geschäften und Websites ein, deren Hauptzweck kommerzielle Transaktionen sind. [GitHub-Pages-Vertragsbedingungen](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#pages) · [GitHub-Pages-Nutzungsgrenzen](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits#usage-limits)

## Weitere Hinweise zur Veröffentlichung

- Die Markenfarben stehen am Anfang von `css/style.css`. Die Rechnungsvorlage kann bei einer späteren Abstimmung der Farbwerte als zusätzliche Referenz dienen.
- Die Fotos auf der Startseite, der Dienstleistungsseite und unter «Über Blackridge» stammen aus den bereitgestellten Originalaufnahmen. Sie sind als WebP in assets/images/ abgelegt. Bei einem Bildaustausch auch Alternativtext, Abmessungen und gegebenenfalls das Hero-srcset aktualisieren.

## Berglandschaft, Logo und Favicon

- Die Sektion «Technik mit Leidenschaft» verwendet das bereitgestellte Panorama `ueber-blackridge-panorama.webp`. Für den Kontaktbereich wurde die vorhandene Tallandschaft mit dem integrierten Bildgenerator als `kontakt-alpenpanorama-nacht.webp` im dunkelblauen Stil neu abgestimmt. Für schmale Ansichten gibt es jeweils eine 960 Pixel breite WebP-Version. CSS-Pseudoelemente und Masken halten die Panoramen und ihre Überlagerungen hinter dem Inhalt.

- `assets/images/abschluss-berge-links.webp` und `abschluss-berge-rechts.webp` (je 1120 × 320) sind Randbereiche einer mit dem integrierten Bildgenerator erstellten Walliser Alpenkulisse. Links erinnert der markante Gipfel an das Matterhorn. Rechts greifen die Gipfelzüge Formen von Weisshorn, Dent Blanche und der Mischabel-Gruppe auf. CSS-Masken blenden die Berge zum oberen Bildrand und zur Mitte hin aus.
- `assets/logo/blackridge.png` (107 × 50) übernimmt das Bergsymbol aus `Blackridge_Bild2_Logo.png` mit transparentem Hintergrund. Die schmale weisse Randlinie liegt ausserhalb des Ausschnitts. Die Originalform ist freigestellt und proportional eingebunden. Das vorhandene Rasterbild begrenzt die nutzbare Grösse.
- `assets/logo/blackridge-favicon.png` (64 × 64) verwendet dasselbe Zeichen auf einer quadratischen transparenten Fläche. Wenn später eine originale SVG-Datei verfügbar wird, lassen sich Logo und Favicon zentral in den Assets und über die Verweise in den HTML-Dateien ersetzen.

## Auf eine eigene Domain umziehen

Kopiere den Inhalt dieses Ordners in das Stammverzeichnis der neuen Website. Die internen Seiten, Abschnitte, Assets und Formularskripte verwenden relative Pfade. Die Formspree-ID kann beim Umzug gleich bleiben. Prüfe die Domain-Einschränkung in Formspree und wiederhole den Testversand. Aktualisiere anschliessend die beiden Portfolioverweise sowie bei Bedarf die Datenschutzhinweise und Canonical- und Sitemap-Konfiguration am neuen Veröffentlichungsort.

## Deutsche und englische Seiten pflegen

Pflege die deutschen Inhalte in den bestehenden HTML-Seiten und die englischen Texte in `tools/english.json`. Der erste Block in der JSON-Datei enthält wiederverwendete Texte. Die übrigen Blöcke gehören zu den jeweiligen Seiten. Bei einer Änderung des deutschen Wortlauts den betroffenen deutschen Schlüssel und seine englische Übersetzung aktualisieren. Englische Formularmeldungen stehen in `js/contact-form.js`, Galeriemeldungen in `js/lightbox.js` und Spielbeschriftungen in `js/circuit-challenge.js`.

Führe im Blackridge-Ordner `node tools/build-languages.cjs` aus. Der Befehl erzeugt die englischen HTML-Seiten, Sprachlinks und SEO-Metadaten für beide Sprachen sowie `sitemap.xml`. Die bestehende `noindex`-Einstellung der rechtlichen Seiten gilt auch auf Englisch. GitHub Pages liefert die statischen Dateien direkt aus.

Bei einem Domainumzug die Basis-URL `site` in `tools/build-languages.cjs` aktualisieren und den Befehl erneut ausführen. Die Navigationslinks und gemeinsam genutzten Assets verwenden relative Pfade.

## Blackridge Assistant pflegen

Der zweisprachige FAQ-Assistent wird über die gemeinsamen Blackridge-Skripte geladen. Alle Fragen werden im Browser mit den Einträgen in `js/faq-data.mjs` abgeglichen. Der Chatverlauf bleibt im Arbeitsspeicher der geladenen Seite. Der Assistent hängt von keinen externen Diensten ab.

- Ergänze in `js/faq-data.mjs` einen Eintrag mit eindeutiger `id`, einer Kategorie, den deutschen und englischen Fragen und Antworten, typischen Begriffen in `terms` und den passenden internen `links`. Links bestehen aus dem Routenschlüssel und bei Bedarf einem vorhandenen Fragment, zum Beispiel `services#faq`. Die Liste `suggestions` bestimmt die Fragen beim Öffnen.
- Verwende `weak` zusammen mit `context` für Begriffe, die erst in Verbindung mit einem PC-Thema aussagekräftig sind. `requires` kann zusätzliche Begriffsgruppen vorgeben, etwa für Anfragen zu mitgebrachten Teilen. `shortQueries` enthält vollständig übereinstimmende Kurzfragen.
- Preise und die Leistungsübersicht im Assistenten stammen aus der Preis- und FAQ-Seite. Erzeuge nach Änderungen an den Seiten mit `node tools/build-languages.cjs` beide Sprachversionen und `js/faq-facts.mjs` neu. Die übrigen Chat-Antworten sind kurze Fassungen der veröffentlichten Inhalte. Bei Änderungen am Projektstatus diese Texte und bei einer Freigabe des Formulars auch dessen Konfiguration prüfen.
- Führe `node --test tools/faq-assistant.test.cjs` aus. Der Test prüft unter anderem Fragevarianten, uneindeutige Themen, interne Ziele und den Abgleich der gemeinsamen Fakten.

## Circuit Challenge pflegen

Die drei Level stehen in `js/circuit-puzzles.js`. Koordinaten wie `C2` bezeichnen Zeile C und Spalte 2. In `paths` werden benachbarte Felder zu Leiterbahnen verbunden. Wege zu `output` und `checkpoints` sind Pflicht. Zusätzliche Abzweige dürfen in Sackgassen enden. Mit `decoys` lassen sich auf freien Feldern einzelne Bauteile setzen. Ihre Anschlüsse sind als `N`, `E`, `S` und `W` angegeben. Felder in `fixed` behalten ihre Ausrichtung.

Passe für mehr Schwierigkeit den Verlauf der Pfade an oder ergänze irreführende Abzweige. Ändere `seed`, um neue Startwinkel für dieselbe Schaltung zu erhalten. Führe danach im Blackridge-Ordner `node --test tools/circuit-puzzles.test.cjs` aus. Der Test spielt einen gültigen Weg durch und vergleicht die kürzeste mögliche Lösung mit den Zielbereichen. Er prüft dafür die Pfade zu allen Pflichtzielen und kombiniert nur Anschlüsse, die gleichzeitig ausgerichtet werden können.

Die Punktwerte pro Level, Abzüge, Hinweisgrenze und Rangschwellen stehen in `js/circuit-score.js`. Die aktuellen Lösungsrichtwerte von 9, 15 und 32 Vierteldrehungen entsprechen den geprüften Mindestwerten. Nach Änderungen am Raster oder an `seed` den Lösbarkeitstest ausführen und `parRotations` anpassen. `node --test tools/circuit-puzzles.test.cjs tools/circuit-score.test.cjs` prüft Layouts und Bewertung gemeinsam.

Ein Hinweis wird pro markiertem Feld und Versuch einmal gezählt. «Erneut versuchen» verwirft das aktuelle Levelergebnis und behält frühere Levelpunkte. «Erneut spielen» beginnt einen neuen Durchlauf. Der Score bleibt während des Durchlaufs im JavaScript-Speicher.

<details>
<summary>Bildprompts für den integrierten Bildgenerator</summary>

**Walliser Alpenkulisse im Footer**

> Use case: stylized-concept. Asset type: panoramic footer artwork for Blackridge Technical, a minimalist and precise Swiss technology brand. Generate one wide horizontal master artwork, ideally 3:1 panoramic, for a low dark web footer. No text, logo, border or watermark.
>
> Subject and composition: a single stylized but geologically credible Valais Alps skyline at night. At the left, with the summit around 18–21% of the width, a recognisable Matterhorn-inspired landmark with a sharp asymmetric summit, a steep almost vertical face and bent, uneven rocky ridges. At the right, with the main summit around 80–83%, compose a different acute and elegant Weisshorn-inspired peak next to the broken pinnacles and closely grouped profiles of Dent Blanche and the Mischabel/Dom. Preserve full peaks with a little space above, meaningful rock strata and distinct rock faces. The two bold groupings sit at the outer edges and descend clearly into a very low, quiet, almost-black valley across the middle third. Keep their silhouettes bold enough to recognise at footer scale on a phone. This is a stylised composition inspired by real Valais profiles.
>
> Style and light: a refined editorial alpine illustration with tactile rock and subtle fine tonal layering. Cold nocturnal blacks, charcoal and desaturated navy, matching a background near #0c1017. Thin cool steel-blue ridge light and a few subdued silver-grey highlights reveal the crest and faceted upper slopes. Subtle atmospheric depth. The sky is smooth, very dark and low contrast, without moon, stars, sun, or cloud patterns. Dark practical foreground fades toward nearly black. Do not overexpose snow or make large bright grey planes. Build the drama from shapes, relief and restrained lighting. Avoid generic triangular clipart, cartoon contours, neon, heavy outlines, saturated colours, photomontage seams, buildings, lakes, or trees.
>
> Framing: keep all the distinctive silhouettes, both summits and useful upper rock faces within one shallow horizontal band in the middle of the canvas, so the master can be cropped to short panoramic left and right edges. If the canvas is taller than the landscape, leave restrained dark empty space above and below the band.
</details>
