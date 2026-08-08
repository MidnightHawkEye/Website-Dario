const supportedLanguages = Object.freeze(["de", "en"]);
const languageStorageKey = "dario-exe-language";

const i18nMessages = Object.freeze({
    en: {
        "meta.description": "DARIO.exe is the personal developer portfolio of Dario Hasler, showcasing projects in web development, industrial automation and cybersecurity.",
        "meta.title": "DARIO.exe | Developer Portfolio by Dario Hasler",
        "meta.imageAlt": "Preview of the DARIO.exe developer portfolio",
        "language.selector": "Language selection",
        "language.switchToGerman": "Switch to German",
        "language.switchToEnglish": "Switch to English",
        "nav.primary": "Primary navigation",
        "nav.home": "Go to the DARIO.exe hero section",
        "nav.open": "Open navigation menu",
        "nav.close": "Close navigation menu",
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.projects": "Projects",
        "nav.devlog": "Devlog",
        "nav.contact": "Contact",
        "nav.systemOnline": "SYSTEM ONLINE",
        "loader.initializing": "INITIALIZING DARIO.exe",
        "hero.kicker": "> INITIALIZING SYSTEM...",
        "hero.enter": "> ENTER SYSTEM",
        "hero.mottoBuilding": "Building systems",
        "hero.mottoBreaking": "Breaking limits",
        "hero.mottoLearning": "Learning code",
        "hero.systemOnline": "SYSTEM ONLINE",
        "hero.scroll": "SCROLL TO CONTINUE",
        "terminal.booting": "> booting DARIO.exe...",
        "terminal.loading": "> loading modules...",
        "terminal.ai": "> initializing AI systems...",
        "terminal.network": "> connecting network...",
        "terminal.identity": "> verifying identity...",
        "terminal.granted": "ACCESS GRANTED",
        "terminal.welcome": "Welcome, USER.",
        "about.imageAlt": "Portrait of Dario Hasler",
        "about.status": "Status: Online",
        "about.heading": "Who Am I",
        "about.introRole": "Industrial Automation Specialist",
        "about.introWork": "building control systems in real-world environments.",
        "about.transitioning": "Currently transitioning into",
        "about.software": "Software Engineering,",
        "about.cybersecurity": "Cybersecurity",
        "about.products": "and building my own digital products.",
        "about.code": "Every line of code",
        "about.freedom": "is another step toward freedom.",
        "about.currentProject": "CURRENT PROJECT",
        "about.brand": "Building my personal brand.",
        "about.currentFocus": "CURRENT FOCUS",
        "about.statusLabel": "STATUS",
        "about.learning": "∞ Learning",
        "about.daily": "One step every day.",
        "skills.label": "SYSTEM ANALYSIS",
        "skills.heading": "SYSTEM CAPABILITIES",
        "skills.online": "ONLINE",
        "skills.learning": "LEARNING",
        "skills.active": "ACTIVE",
        "skills.evolving": "EVOLVING",
        "skills.proficiency": "PROFICIENCY",
        "skills.focus": "CURRENT FOCUS",
        "skills.responsiveTitle": "Responsive Web Design",
        "skills.animationsTitle": "UI Animations",
        "skills.problemSolvingTitle": "Problem Solving",
        "skills.htmlDescription": "Creating clean, responsive and accessible web interfaces with semantic HTML and modern CSS.",
        "skills.htmlFocus": "Layouts, structure and visual consistency",
        "skills.jsDescription": "Developing interactive experiences, dynamic functionality and browser-based systems.",
        "skills.jsFocus": "DOM manipulation, functions and application logic",
        "skills.responsiveDescription": "Optimizing layouts and interfaces for desktop, tablet and mobile devices.",
        "skills.responsiveFocus": "Flexible grids, media queries and mobile navigation",
        "skills.uxDescription": "Designing intuitive interfaces with clear structure, consistency and a user-focused mindset.",
        "skills.uxFocus": "Visual hierarchy, navigation and user feedback",
        "skills.animationsDescription": "Creating smooth motion, transitions and meaningful visual feedback for interactive elements.",
        "skills.animationsFocus": "Canvas effects, scroll reveals and micro-interactions",
        "skills.problemDescription": "Breaking complex problems into understandable steps and developing practical solutions.",
        "skills.problemFocus": "Debugging, code structure and independent thinking",
        "projects.heading": "Projects",
        "projects.active": "ACTIVE DEVELOPMENT",
        "projects.descriptionOne": "A modern developer portfolio built with HTML, CSS and JavaScript.",
        "projects.descriptionTwo": "Designed as an interactive experience inspired by terminals, cybersecurity and clean UI design.",
        "projects.technologies": "Technologies used",
        "projects.currentVersion": "CURRENT VERSION",
        "projects.status": "STATUS",
        "projects.building": "Building...",
        "projects.viewSource": "VIEW SOURCE",
        "projects.mission": "> Current mission: Building DARIO.exe",
        "contact.label": "SECURE CONNECTION",
        "contact.heading": "COMMUNICATION TERMINAL",
        "contact.online": "ONLINE",
        "contact.ready": "Ready to establish connection...",
        "contact.honeypot": "Leave this field empty",
        "contact.identification": "IDENTIFICATION",
        "contact.email": "EMAIL ADDRESS",
        "contact.message": "MESSAGE",
        "contact.namePlaceholder": "> Enter your name",
        "contact.emailPlaceholder": "> Enter your email",
        "contact.messagePlaceholder": "> Enter your message",
        "contact.submit": "> INITIALIZE TRANSMISSION",
        "contact.awaiting": "> Awaiting secure connection...",
        "contact.unauthorized": "Unauthorized system interaction detected.",
        "contact.offline": "> Network offline. Check your internet connection and try again.",
        "contact.retry": "> RETRY TRANSMISSION",
        "contact.cooldown": "Please wait 30 seconds before sending another message.",
        "contact.unavailable": "> Transmission service unavailable. Please try again later.",
        "contact.transmitting": "> TRANSMITTING...",
        "contact.encrypting": "> Encrypting message...",
        "contact.success": "> Transmission successful.\nConnection established.",
        "contact.complete": "> TRANSMISSION COMPLETE",
        "contact.failed": "> Transmission failed. Please try again later.",
        "contact.connectionLost": "> Network connection lost. Check your internet connection.",
        "contact.offlineStatus": "> Network connection lost. Transmission unavailable.",
        "contact.restored": "> Connection restored. Ready for secure transmission.",
        "return.button": "RETURN TO SYSTEM",
        "return.returning": "> Returning to system...",
        "return.ready": "> System ready.",
        "footer.rights": "© 2026 Dario Hasler. All rights reserved.",
        "footer.privacy": "Privacy Policy",
        "footer.devlog": "Devlog",
        "error404.title": "404 | DARIO.exe",
        "error404.systemError": "SYSTEM ERROR",
        "error404.pageNotFound": "PAGE_NOT_FOUND",
        "error404.message": "The requested resource could not be located. The system path may be invalid or no longer available.",
        "error404.detailsAria": "Error details",
        "error404.errorCode": "ERROR_CODE:",
        "error404.status": "STATUS:",
        "error404.resourceNotFound": "RESOURCE_NOT_FOUND",
        "error404.action": "ACTION:",
        "error404.returnValue": "RETURN_TO_SYSTEM",
        "error404.returnHref": "/",
        "error404.returnButton": "> RETURN TO SYSTEM",
        "privacy.metaDescription": "Privacy Policy for DARIO.exe, including information about website hosting, the contact form, EmailJS and data processing.",
        "privacy.title": "Privacy Policy | DARIO.exe",
        "privacy.back": "RETURN TO DARIO.exe",
        "privacy.label": "LEGAL DOCUMENT",
        "privacy.heading": "Privacy Policy",
        "privacy.updated": "Last updated: July 26, 2026",
        "privacy.controller.title": "1. Controller",
        "privacy.controller.intro": "The person responsible for processing personal data on this website is:",
        "privacy.controller.country": "Switzerland",
        "privacy.controller.email": "Email:",
        "privacy.general.title": "2. General information",
        "privacy.general.first": "This Privacy Policy explains how personal data is processed when you visit DARIO.exe, use the contact form or access external services linked through this website.",
        "privacy.general.second": "Personal data means information that relates to an identified or identifiable person.",
        "privacy.hosting.title": "3. Website hosting",
        "privacy.hosting.first": "This website is hosted using GitHub Pages, a service provided by GitHub.",
        "privacy.hosting.second": "When you access this website, GitHub processes technical usage and connection data. This may include:",
        "privacy.hosting.ip": "IP address",
        "privacy.hosting.device": "Device and browser information",
        "privacy.hosting.os": "Operating system",
        "privacy.hosting.date": "Date and time of the request",
        "privacy.hosting.resources": "Pages and resources accessed",
        "privacy.hosting.referrer": "Referring website",
        "privacy.hosting.purpose": "This data is processed to deliver the website, maintain security, detect misuse, troubleshoot technical problems and ensure reliable operation.",
        "privacy.hosting.countries": "GitHub may process personal data in the United States and other countries.",
        "privacy.furtherInformation": "Further information is available in the",
        "privacy.hosting.link": "GitHub Privacy Statement",
        "privacy.contact.title": "4. Contact form",
        "privacy.contact.first": "When you use the contact form, the following information is processed:",
        "privacy.contact.name": "Your name",
        "privacy.contact.email": "Your email address",
        "privacy.contact.message": "Your message",
        "privacy.contact.date": "The date and time of your request",
        "privacy.contact.metadata": "Technical metadata required to transmit the message",
        "privacy.contact.purpose": "This information is used exclusively to receive, process and respond to your request.",
        "privacy.contact.voluntary": "Providing this information is voluntary. However, a name, email address and message are required to submit the contact form.",
        "privacy.emailjs.title": "5. EmailJS",
        "privacy.emailjs.first": "The contact form uses EmailJS, a service provided by EmailJS Pte. Ltd.",
        "privacy.emailjs.second": "When the form is submitted, the entered information and technical request metadata are transmitted to EmailJS and to the email provider used to receive the message.",
        "privacy.emailjs.third": "EmailJS may temporarily process IP addresses for security, fraud prevention and protection against misuse. EmailJS uses infrastructure located in the United States. Personal data may therefore be transferred outside Switzerland.",
        "privacy.emailjs.link": "EmailJS Privacy Policy",
        "privacy.cdn.title": "6. Content delivery networks",
        "privacy.cdn.first": "This website loads external JavaScript libraries through content delivery networks.",
        "privacy.cdn.second": "The EmailJS browser library is loaded through jsDelivr. All website animations are implemented locally without external animation libraries.",
        "privacy.cdn.third": "When these resources are loaded, your browser establishes a direct connection to the respective provider. Technical connection information such as your IP address, browser information, request time and requested file is transmitted as part of this connection.",
        "privacy.cdn.more": "Further information:",
        "privacy.cdn.link": "jsDelivr Privacy Policy",
        "privacy.cookies.title": "7. Cookies and analytics",
        "privacy.cookies.first": "This website does not use its own analytics tools, advertising trackers or marketing pixels.",
        "privacy.cookies.second": "DARIO.exe does not intentionally place its own cookies on your device. External service providers may process technical connection data as described in this Privacy Policy.",
        "privacy.links.title": "8. External links",
        "privacy.links.first": "This website contains links to external websites, including GitHub.",
        "privacy.links.second": "When you follow an external link, you leave DARIO.exe. The privacy policies and terms of the respective external provider then apply.",
        "privacy.retention.title": "9. Data retention",
        "privacy.retention.first": "Messages received through the contact form are retained only for as long as necessary to respond to the request and manage any resulting correspondence.",
        "privacy.retention.second": "Data may be retained for a longer period where this is required by law or necessary to establish, exercise or defend legal claims.",
        "privacy.rights.title": "10. Your rights",
        "privacy.rights.first": "Subject to the requirements of applicable Swiss data protection law, you may request:",
        "privacy.rights.information": "Information about your personal data",
        "privacy.rights.correction": "Correction of inaccurate personal data",
        "privacy.rights.deletion": "Deletion of your personal data",
        "privacy.rights.restriction": "Restriction of or objection to certain processing activities",
        "privacy.rights.contact": "Requests concerning your personal data can be sent to the email address listed in Section 1.",
        "privacy.security.title": "11. Data security",
        "privacy.security.first": "Appropriate technical and organisational measures are used to protect personal data against unauthorised access, loss, misuse or alteration.",
        "privacy.security.second": "However, no transmission or storage method on the internet can guarantee absolute security.",
        "privacy.changes.title": "12. Changes to this Privacy Policy",
        "privacy.changes.first": "This Privacy Policy may be updated when the website, its services or the applicable legal requirements change.",
        "privacy.changes.second": "The current version is always available on this page.",
        "devlog.metaDescription": "A retrospective development log of DARIO.exe from the first commit through version 1.2.1, based on the documented project history.",
        "devlog.title": "DEVLOG | DARIO.exe",
        "devlog.kicker": "> VERSION HISTORY",
        "devlog.heading": "DEVLOG",
        "devlog.intro": "From the first commit through v1.2.1: the documented milestones, challenges and lessons behind DARIO.exe.",
        "devlog.sourceNote": "Sources: README, CHANGELOG and documented Git milestones.",
        "devlog.summaryAria": "Devlog summary",
        "devlog.statusLabel": "LOG STATUS",
        "devlog.status": "ACTIVE",
        "devlog.versionLabel": "CURRENT VERSION",
        "devlog.entriesLabel": "ENTRIES",
        "devlog.entryCount": "05",
        "devlog.timelineLabel": "CHRONOLOGICAL RECORD",
        "devlog.changesLabel": "KEY CHANGES",
        "devlog.progressLabel": "DOCUMENTED PROGRESS",
        "devlog.challengeLabel": "CHALLENGE",
        "devlog.solutionLabel": "SOLUTION",
        "devlog.learningLabel": "LEARNING",
        "devlog.outlookLabel": "OUTLOOK",
        "devlog.entry1.date": "July 2, 2026",
        "devlog.entry1.version": "PROJECT START",
        "devlog.entry1.title": "The origin of DARIO.exe",
        "devlog.entry1.summary": "DARIO.exe began as a personal developer portfolio and practical learning project: one place for my background, projects and growing developer identity.",
        "devlog.entry1.change1": "Created the first static website foundation with HTML, CSS and JavaScript.",
        "devlog.entry1.change2": "Defined the cyberpunk, terminal and Matrix-inspired visual direction.",
        "devlog.entry1.change3": "Made the portfolio a place to document progress and present projects.",
        "devlog.entry1.challenge": "I wanted one interface to connect my industrial automation background with my path into software development and cybersecurity.",
        "devlog.entry1.solution": "I chose a system-inspired static portfolio that could grow section by section without a framework or build process.",
        "devlog.entry1.learning": "The project gave me a concrete way to strengthen my frontend skills instead of learning only through isolated exercises.",
        "devlog.entry1.outlook": "The next documented milestone was the first complete release: version 1.0.",
        "devlog.entry2.date": "July 18, 2026",
        "devlog.entry2.title": "The first release",
        "devlog.entry2.summary": "Version 1.0 established the complete core experience of DARIO.exe.",
        "devlog.entry2.change1": "Added the hero typing animation, sticky navigation, active section highlighting, smooth scrolling and scroll progress.",
        "devlog.entry2.change2": "Added the About, Skills, Projects and EmailJS contact sections with spam protection.",
        "devlog.entry2.change3": "Added Matrix and particle backgrounds, the loader and the return-to-system button.",
        "devlog.entry2.challenge": "The release combined navigation, forms, canvas effects and several animated interface states in one static portfolio.",
        "devlog.entry2.solution": "The experience was organized into focused page sections and separate CSS and JavaScript components.",
        "devlog.entry2.learning": "HTML, CSS and JavaScript were enough to build an interactive, recognizable portfolio without adding a framework.",
        "devlog.entry2.outlook": "The next documented release focused on making the complete experience responsive.",
        "devlog.entry3.date": "July 22, 2026",
        "devlog.entry3.title": "First improvements for mobile",
        "devlog.entry3.summary": "Version 1.1 made DARIO.exe responsive for mobile phones and tablets.",
        "devlog.entry3.change1": "Added responsive layouts for mobile and tablet devices.",
        "devlog.entry3.change2": "Added a dedicated mobile navigation menu.",
        "devlog.entry3.change3": "Adapted spacing, element sizes, sections, project cards and the contact area for smaller screens.",
        "devlog.entry3.challenge": "Desktop navigation, sections, project cards and the contact area also had to remain usable on smaller screens.",
        "devlog.entry3.solution": "Responsive breakpoints, a mobile menu and component-specific spacing and size adjustments were added.",
        "devlog.entry3.learning": "I learned that responsive design is not one global scale change; every component needs its own layout and interaction check.",
        "devlog.entry3.outlook": "Several smaller mobile adjustments followed on July 23 before work moved toward version 1.2.",
        "devlog.entry4.date": "July 31 – August 1, 2026",
        "devlog.entry4.title": "Quality, performance and optimization",
        "devlog.entry4.summary": "Version 1.2 improved documentation and maintainability; version 1.2.1 followed with UI fixes and optimizations.",
        "devlog.entry4.change1": "Added the Privacy Policy, copyright and version information, screenshots and expanded project documentation.",
        "devlog.entry4.change2": "Replaced repeated JavaScript values and direct colors with descriptive constants and CSS variables.",
        "devlog.entry4.change3": "Improved code structure, fixed the hidden privacy return link and checked the browser console.",
        "devlog.entry4.change4": "Released v1.2.1 with UI fixes and optimizations.",
        "devlog.entry4.challenge": "Repeated values, direct colors and growing documentation reduced clarity. Mobile pull-to-refresh behavior was also documented as a browser-specific issue.",
        "devlog.entry4.solution": "Central variables, descriptive constants, clearer documentation, targeted fixes and console checks made the project easier to maintain.",
        "devlog.entry4.learning": "I learned that quality also means maintainability, documentation, privacy, cross-browser behavior and consistent version information.",
        "devlog.entry4.outlook": "The CHANGELOG records additional cleanup, fallbacks and motion-related work as Unreleased; it does not assign that work a release version or date yet.",
        "devlog.entry5.date": "Through August 1, 2026",
        "devlog.entry5.version": "THROUGH v1.2.1",
        "devlog.entry5.title": "What I learned through version 1.2",
        "devlog.entry5.summary": "The documented history shows the progression from a visual learning project to a responsive, documented and more maintainable portfolio.",
        "devlog.entry5.change1": "Built a complete static project with HTML, CSS and JavaScript.",
        "devlog.entry5.change2": "Expanded the first release into a responsive desktop, tablet and mobile experience.",
        "devlog.entry5.change3": "Improved structure, documentation and consistency instead of focusing only on visuals.",
        "devlog.entry5.challenge": "As the feature set grew, design consistency, browser behavior and code readability had to be handled together.",
        "devlog.entry5.solution": "Versioned releases, focused mobile follow-up commits and later refactoring turned the work into smaller, traceable improvements.",
        "devlog.entry5.learning": "I learned to treat design, interaction, responsive behavior, code structure and documentation as parts of one system.",
        "devlog.entry5.outlook": "Starting with version 1.3, new entries will use the prepared template and record meaningful milestones rather than every small change.",
        "devlog.nextLabel": "NEXT MISSION",
        "devlog.next": "Use the prepared entry template for version 1.3 and every meaningful release after it."
    },
    de: {
        "meta.description": "DARIO.exe ist das persönliche Entwickler-Portfolio von Dario Hasler mit Projekten aus Webentwicklung, Industrieautomation und Cybersecurity.",
        "meta.title": "DARIO.exe | Entwickler-Portfolio von Dario Hasler",
        "meta.imageAlt": "Vorschau des DARIO.exe Entwickler-Portfolios",
        "language.selector": "Sprachauswahl",
        "language.switchToGerman": "Auf Deutsch wechseln",
        "language.switchToEnglish": "Auf Englisch wechseln",
        "nav.primary": "Hauptnavigation",
        "nav.home": "Zur Hero-Section von DARIO.exe",
        "nav.open": "Navigationsmenü öffnen",
        "nav.close": "Navigationsmenü schließen",
        "nav.about": "Über mich",
        "nav.skills": "Fähigkeiten",
        "nav.projects": "Projekte",
        "nav.devlog": "Devlog",
        "nav.contact": "Kontakt",
        "nav.systemOnline": "SYSTEM ONLINE",
        "loader.initializing": "DARIO.exe WIRD INITIALISIERT",
        "hero.kicker": "> SYSTEM WIRD INITIALISIERT...",
        "hero.enter": "> SYSTEM BETRETEN",
        "hero.mottoBuilding": "Systeme bauen",
        "hero.mottoBreaking": "Grenzen überwinden",
        "hero.mottoLearning": "Code lernen",
        "hero.systemOnline": "SYSTEM ONLINE",
        "hero.scroll": "WEITERSCROLLEN",
        "terminal.booting": "> starte DARIO.exe...",
        "terminal.loading": "> lade Module...",
        "terminal.ai": "> initialisiere KI-Systeme...",
        "terminal.network": "> verbinde Netzwerk...",
        "terminal.identity": "> prüfe Identität...",
        "terminal.granted": "ZUGRIFF GEWÄHRT",
        "terminal.welcome": "Willkommen, BENUTZER.",
        "about.imageAlt": "Porträt von Dario Hasler",
        "about.status": "Status: Online",
        "about.heading": "Wer bin ich?",
        "about.introRole": "Fachspezialist für industrielle Automation",
        "about.introWork": "und entwickle Steuerungssysteme in realen Industrieumgebungen.",
        "about.transitioning": "Derzeit auf dem Weg in die Bereiche",
        "about.software": "Software Engineering,",
        "about.cybersecurity": "Cybersecurity",
        "about.products": "und Entwicklung eigener digitaler Produkte.",
        "about.code": "Jede Codezeile",
        "about.freedom": "ist ein weiterer Schritt in Richtung Freiheit.",
        "about.currentProject": "AKTUELLES PROJEKT",
        "about.brand": "Aufbau meiner persönlichen Marke.",
        "about.currentFocus": "AKTUELLER FOKUS",
        "about.statusLabel": "STATUS",
        "about.learning": "∞ Lernen",
        "about.daily": "Jeden Tag einen Schritt.",
        "skills.label": "SYSTEMANALYSE",
        "skills.heading": "SYSTEMKOMPETENZEN",
        "skills.online": "ONLINE",
        "skills.learning": "LERNEND",
        "skills.active": "AKTIV",
        "skills.evolving": "IN ENTWICKLUNG",
        "skills.proficiency": "KENNTNISSTAND",
        "skills.focus": "AKTUELLER FOKUS",
        "skills.responsiveTitle": "Responsives Webdesign",
        "skills.animationsTitle": "UI-Animationen",
        "skills.problemSolvingTitle": "Problemlösung",
        "skills.htmlDescription": "Erstellung sauberer, responsiver und barrierearmer Weboberflächen mit semantischem HTML und modernem CSS.",
        "skills.htmlFocus": "Layouts, Struktur und visuelle Konsistenz",
        "skills.jsDescription": "Entwicklung interaktiver Erlebnisse, dynamischer Funktionen und browserbasierter Systeme.",
        "skills.jsFocus": "DOM-Manipulation, Funktionen und Anwendungslogik",
        "skills.responsiveDescription": "Optimierung von Layouts und Oberflächen für Desktop, Tablet und Mobilgeräte.",
        "skills.responsiveFocus": "Flexible Raster, Media Queries und mobile Navigation",
        "skills.uxDescription": "Gestaltung intuitiver Oberflächen mit klarer Struktur, Konsistenz und Fokus auf die Benutzer.",
        "skills.uxFocus": "Visuelle Hierarchie, Navigation und Benutzerfeedback",
        "skills.animationsDescription": "Entwicklung flüssiger Bewegungen, Übergänge und aussagekräftiger visueller Rückmeldungen.",
        "skills.animationsFocus": "Canvas-Effekte, Scroll-Reveals und Mikrointeraktionen",
        "skills.problemDescription": "Zerlegung komplexer Probleme in verständliche Schritte und Entwicklung praktischer Lösungen.",
        "skills.problemFocus": "Debugging, Codestruktur und selbstständiges Denken",
        "projects.heading": "Projekte",
        "projects.active": "AKTIVE ENTWICKLUNG",
        "projects.descriptionOne": "Ein modernes Entwickler-Portfolio, erstellt mit HTML, CSS und JavaScript.",
        "projects.descriptionTwo": "Gestaltet als interaktives Erlebnis, inspiriert von Terminals, Cybersecurity und klarem UI-Design.",
        "projects.technologies": "Verwendete Technologien",
        "projects.currentVersion": "AKTUELLE VERSION",
        "projects.status": "STATUS",
        "projects.building": "Im Aufbau...",
        "projects.viewSource": "QUELLCODE ANSEHEN",
        "projects.mission": "> Aktuelle Mission: Aufbau von DARIO.exe",
        "contact.label": "SICHERE VERBINDUNG",
        "contact.heading": "KOMMUNIKATIONSTERMINAL",
        "contact.online": "ONLINE",
        "contact.ready": "Bereit zum Verbindungsaufbau...",
        "contact.honeypot": "Dieses Feld leer lassen",
        "contact.identification": "IDENTIFIKATION",
        "contact.email": "E-MAIL-ADRESSE",
        "contact.message": "NACHRICHT",
        "contact.namePlaceholder": "> Namen eingeben",
        "contact.emailPlaceholder": "> E-Mail-Adresse eingeben",
        "contact.messagePlaceholder": "> Nachricht eingeben",
        "contact.submit": "> ÜBERTRAGUNG STARTEN",
        "contact.awaiting": "> Warte auf sichere Verbindung...",
        "contact.unauthorized": "Unzulässige Systeminteraktion erkannt.",
        "contact.offline": "> Netzwerk offline. Prüfe deine Internetverbindung und versuche es erneut.",
        "contact.retry": "> ÜBERTRAGUNG ERNEUT VERSUCHEN",
        "contact.cooldown": "Bitte warte 30 Sekunden, bevor du eine weitere Nachricht sendest.",
        "contact.unavailable": "> Übertragungsdienst nicht verfügbar. Bitte versuche es später erneut.",
        "contact.transmitting": "> WIRD ÜBERTRAGEN...",
        "contact.encrypting": "> Nachricht wird verschlüsselt...",
        "contact.success": "> Übertragung erfolgreich.\nVerbindung hergestellt.",
        "contact.complete": "> ÜBERTRAGUNG ABGESCHLOSSEN",
        "contact.failed": "> Übertragung fehlgeschlagen. Bitte versuche es später erneut.",
        "contact.connectionLost": "> Netzwerkverbindung verloren. Prüfe deine Internetverbindung.",
        "contact.offlineStatus": "> Netzwerkverbindung verloren. Übertragung nicht verfügbar.",
        "contact.restored": "> Verbindung wiederhergestellt. Bereit für sichere Übertragung.",
        "return.button": "ZURÜCK ZUM SYSTEM",
        "return.returning": "> Rückkehr zum System...",
        "return.ready": "> System bereit.",
        "footer.rights": "© 2026 Dario Hasler. Alle Rechte vorbehalten.",
        "footer.privacy": "Datenschutzerklärung",
        "footer.devlog": "Devlog",
        "error404.title": "404 | DARIO.exe",
        "error404.systemError": "SYSTEMFEHLER",
        "error404.pageNotFound": "SEITE_NICHT_GEFUNDEN",
        "error404.message": "Die angeforderte Ressource konnte nicht gefunden werden. Der Systempfad ist möglicherweise ungültig oder nicht mehr verfügbar.",
        "error404.detailsAria": "Fehlerdetails",
        "error404.errorCode": "FEHLERCODE:",
        "error404.status": "STATUS:",
        "error404.resourceNotFound": "RESSOURCE_NICHT_GEFUNDEN",
        "error404.action": "AKTION:",
        "error404.returnValue": "ZURÜCK_ZUM_SYSTEM",
        "error404.returnHref": "/de/",
        "error404.returnButton": "> ZURÜCK ZUM SYSTEM",
        "privacy.metaDescription": "Datenschutzerklärung für DARIO.exe mit Informationen zu Website-Hosting, Kontaktformular, EmailJS und Datenbearbeitung.",
        "privacy.title": "Datenschutzerklärung | DARIO.exe",
        "privacy.back": "ZURÜCK ZU DARIO.exe",
        "privacy.label": "RECHTLICHES DOKUMENT",
        "privacy.heading": "Datenschutzerklärung",
        "privacy.updated": "Letzte Aktualisierung: 26. Juli 2026",
        "privacy.controller.title": "1. Verantwortliche Person",
        "privacy.controller.intro": "Verantwortlich für die Bearbeitung personenbezogener Daten auf dieser Website ist:",
        "privacy.controller.country": "Schweiz",
        "privacy.controller.email": "E-Mail:",
        "privacy.general.title": "2. Allgemeine Informationen",
        "privacy.general.first": "Diese Datenschutzerklärung erläutert, wie personenbezogene Daten bearbeitet werden, wenn du DARIO.exe besuchst, das Kontaktformular verwendest oder über diese Website verlinkte externe Dienste aufrufst.",
        "privacy.general.second": "Personenbezogene Daten sind Informationen, die sich auf eine bestimmte oder bestimmbare Person beziehen.",
        "privacy.hosting.title": "3. Website-Hosting",
        "privacy.hosting.first": "Diese Website wird über GitHub Pages gehostet, einen Dienst von GitHub.",
        "privacy.hosting.second": "Beim Aufruf dieser Website bearbeitet GitHub technische Nutzungs- und Verbindungsdaten. Dazu können gehören:",
        "privacy.hosting.ip": "IP-Adresse",
        "privacy.hosting.device": "Geräte- und Browserinformationen",
        "privacy.hosting.os": "Betriebssystem",
        "privacy.hosting.date": "Datum und Uhrzeit der Anfrage",
        "privacy.hosting.resources": "Aufgerufene Seiten und Ressourcen",
        "privacy.hosting.referrer": "Verweisende Website",
        "privacy.hosting.purpose": "Diese Daten werden bearbeitet, um die Website bereitzustellen, die Sicherheit aufrechtzuerhalten, Missbrauch zu erkennen, technische Probleme zu beheben und einen zuverlässigen Betrieb sicherzustellen.",
        "privacy.hosting.countries": "GitHub kann personenbezogene Daten in den Vereinigten Staaten und anderen Ländern bearbeiten.",
        "privacy.furtherInformation": "Weitere Informationen findest du in der",
        "privacy.hosting.link": "Datenschutzerklärung von GitHub",
        "privacy.contact.title": "4. Kontaktformular",
        "privacy.contact.first": "Wenn du das Kontaktformular verwendest, werden folgende Informationen bearbeitet:",
        "privacy.contact.name": "Dein Name",
        "privacy.contact.email": "Deine E-Mail-Adresse",
        "privacy.contact.message": "Deine Nachricht",
        "privacy.contact.date": "Datum und Uhrzeit deiner Anfrage",
        "privacy.contact.metadata": "Technische Metadaten, die für die Übermittlung der Nachricht erforderlich sind",
        "privacy.contact.purpose": "Diese Informationen werden ausschliesslich verwendet, um deine Anfrage zu empfangen, zu bearbeiten und zu beantworten.",
        "privacy.contact.voluntary": "Die Angabe dieser Informationen ist freiwillig. Name, E-Mail-Adresse und Nachricht sind jedoch erforderlich, um das Kontaktformular abzusenden.",
        "privacy.emailjs.title": "5. EmailJS",
        "privacy.emailjs.first": "Das Kontaktformular verwendet EmailJS, einen Dienst der EmailJS Pte. Ltd.",
        "privacy.emailjs.second": "Beim Absenden des Formulars werden die eingegebenen Informationen und technischen Anfragemetadaten an EmailJS sowie an den für den Empfang der Nachricht verwendeten E-Mail-Anbieter übermittelt.",
        "privacy.emailjs.third": "EmailJS kann IP-Adressen vorübergehend zu Sicherheitszwecken, zur Betrugsprävention und zum Schutz vor Missbrauch bearbeiten. EmailJS nutzt Infrastruktur in den Vereinigten Staaten. Personenbezogene Daten können daher ausserhalb der Schweiz übermittelt werden.",
        "privacy.emailjs.link": "Datenschutzerklärung von EmailJS",
        "privacy.cdn.title": "6. Content Delivery Networks",
        "privacy.cdn.first": "Diese Website lädt externe JavaScript-Bibliotheken über Content Delivery Networks.",
        "privacy.cdn.second": "Die EmailJS-Browserbibliothek wird über jsDelivr geladen. Alle Website-Animationen sind lokal und ohne externe Animationsbibliotheken umgesetzt.",
        "privacy.cdn.third": "Beim Laden dieser Ressourcen stellt dein Browser eine direkte Verbindung zum jeweiligen Anbieter her. Technische Verbindungsinformationen wie deine IP-Adresse, Browserinformationen, Anfragezeitpunkt und angeforderte Datei werden dabei übermittelt.",
        "privacy.cdn.more": "Weitere Informationen:",
        "privacy.cdn.link": "Datenschutzerklärung von jsDelivr",
        "privacy.cookies.title": "7. Cookies und Analyse",
        "privacy.cookies.first": "Diese Website verwendet keine eigenen Analysewerkzeuge, Werbetracker oder Marketing-Pixel.",
        "privacy.cookies.second": "DARIO.exe setzt nicht absichtlich eigene Cookies auf deinem Gerät. Externe Dienstanbieter können technische Verbindungsdaten wie in dieser Datenschutzerklärung beschrieben bearbeiten.",
        "privacy.links.title": "8. Externe Links",
        "privacy.links.first": "Diese Website enthält Links zu externen Websites, darunter GitHub.",
        "privacy.links.second": "Wenn du einem externen Link folgst, verlässt du DARIO.exe. Danach gelten die Datenschutzerklärungen und Nutzungsbedingungen des jeweiligen externen Anbieters.",
        "privacy.retention.title": "9. Aufbewahrung von Daten",
        "privacy.retention.first": "Über das Kontaktformular empfangene Nachrichten werden nur so lange aufbewahrt, wie es zur Beantwortung der Anfrage und zur Bearbeitung der daraus entstehenden Korrespondenz erforderlich ist.",
        "privacy.retention.second": "Daten können länger aufbewahrt werden, wenn dies gesetzlich vorgeschrieben oder zur Begründung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.",
        "privacy.rights.title": "10. Deine Rechte",
        "privacy.rights.first": "Unter den Voraussetzungen des anwendbaren schweizerischen Datenschutzrechts kannst du Folgendes verlangen:",
        "privacy.rights.information": "Auskunft über deine personenbezogenen Daten",
        "privacy.rights.correction": "Berichtigung unrichtiger personenbezogener Daten",
        "privacy.rights.deletion": "Löschung deiner personenbezogenen Daten",
        "privacy.rights.restriction": "Einschränkung bestimmter Bearbeitungen oder Widerspruch dagegen",
        "privacy.rights.contact": "Anfragen zu deinen personenbezogenen Daten kannst du an die in Abschnitt 1 angegebene E-Mail-Adresse senden.",
        "privacy.security.title": "11. Datensicherheit",
        "privacy.security.first": "Zum Schutz personenbezogener Daten vor unbefugtem Zugriff, Verlust, Missbrauch oder Veränderung werden angemessene technische und organisatorische Massnahmen eingesetzt.",
        "privacy.security.second": "Keine Übertragungs- oder Speichermethode im Internet kann jedoch absolute Sicherheit garantieren.",
        "privacy.changes.title": "12. Änderungen dieser Datenschutzerklärung",
        "privacy.changes.first": "Diese Datenschutzerklärung kann aktualisiert werden, wenn sich die Website, ihre Dienste oder die geltenden rechtlichen Anforderungen ändern.",
        "privacy.changes.second": "Die aktuelle Version ist jederzeit auf dieser Seite verfügbar.",
        "devlog.metaDescription": "Ein rückblickender Entwicklungsbericht zu DARIO.exe vom ersten Commit bis Version 1.2.1, basierend auf der dokumentierten Projektgeschichte.",
        "devlog.title": "DEVLOG | DARIO.exe",
        "devlog.kicker": "> VERSIONSGESCHICHTE",
        "devlog.heading": "DEVLOG",
        "devlog.intro": "Vom ersten Commit bis v1.2.1: die dokumentierten Meilensteine, Herausforderungen und Learnings hinter DARIO.exe.",
        "devlog.sourceNote": "Quellen: README, CHANGELOG und dokumentierte Git-Meilensteine.",
        "devlog.summaryAria": "Devlog-Zusammenfassung",
        "devlog.statusLabel": "LOG-STATUS",
        "devlog.status": "AKTIV",
        "devlog.versionLabel": "AKTUELLE VERSION",
        "devlog.entriesLabel": "EINTRÄGE",
        "devlog.entryCount": "05",
        "devlog.timelineLabel": "CHRONOLOGISCHES PROTOKOLL",
        "devlog.changesLabel": "WICHTIGSTE ÄNDERUNGEN",
        "devlog.progressLabel": "DOKUMENTIERTER FORTSCHRITT",
        "devlog.challengeLabel": "HERAUSFORDERUNG",
        "devlog.solutionLabel": "LÖSUNG",
        "devlog.learningLabel": "LEARNING",
        "devlog.outlookLabel": "AUSBLICK",
        "devlog.entry1.date": "2. Juli 2026",
        "devlog.entry1.version": "PROJEKTSTART",
        "devlog.entry1.title": "Die Entstehung von DARIO.exe",
        "devlog.entry1.summary": "DARIO.exe begann als persönliches Entwickler-Portfolio und praktisches Lernprojekt: ein zentraler Ort für meinen Hintergrund, meine Projekte und meine wachsende Entwickleridentität.",
        "devlog.entry1.change1": "Die erste Grundlage der statischen Website mit HTML, CSS und JavaScript erstellt.",
        "devlog.entry1.change2": "Die visuelle Richtung mit Cyberpunk-, Terminal- und Matrix-Inspiration festgelegt.",
        "devlog.entry1.change3": "Das Portfolio als Ort für dokumentierten Fortschritt und eigene Projekte aufgebaut.",
        "devlog.entry1.challenge": "Ich wollte meinen Hintergrund in der Industrieautomation und meinen Weg in Softwareentwicklung und Cybersecurity in einer Oberfläche verbinden.",
        "devlog.entry1.solution": "Ich entschied mich für ein systeminspiriertes statisches Portfolio, das ohne Framework oder Build-Prozess Abschnitt für Abschnitt wachsen konnte.",
        "devlog.entry1.learning": "Das Projekt gab mir eine konkrete Möglichkeit, meine Frontend-Kenntnisse zu stärken, statt nur mit isolierten Übungen zu lernen.",
        "devlog.entry1.outlook": "Der nächste dokumentierte Meilenstein war der erste vollständige Release: Version 1.0.",
        "devlog.entry2.date": "18. Juli 2026",
        "devlog.entry2.title": "Der erste Release",
        "devlog.entry2.summary": "Version 1.0 legte das vollständige Kernerlebnis von DARIO.exe fest.",
        "devlog.entry2.change1": "Hero-Tippanimation, Sticky-Navigation, aktive Bereichsmarkierung, Smooth Scrolling und Scroll-Fortschritt hinzugefügt.",
        "devlog.entry2.change2": "About-, Skills-, Projects- und EmailJS-Kontaktbereiche mit Spam-Schutz hinzugefügt.",
        "devlog.entry2.change3": "Matrix- und Partikelhintergründe, Loader und Return-to-System-Button hinzugefügt.",
        "devlog.entry2.challenge": "Der Release verband Navigation, Formulare, Canvas-Effekte und mehrere animierte Oberflächenzustände in einem statischen Portfolio.",
        "devlog.entry2.solution": "Das Erlebnis wurde in klar abgegrenzte Seitenbereiche sowie separate CSS- und JavaScript-Komponenten gegliedert.",
        "devlog.entry2.learning": "HTML, CSS und JavaScript reichten aus, um ohne zusätzliches Framework ein interaktives und eigenständiges Portfolio zu entwickeln.",
        "devlog.entry2.outlook": "Der nächste dokumentierte Release konzentrierte sich darauf, das gesamte Erlebnis responsiv zu machen.",
        "devlog.entry3.date": "22. Juli 2026",
        "devlog.entry3.title": "Erste Verbesserungen für Mobilgeräte",
        "devlog.entry3.summary": "Version 1.1 machte DARIO.exe für Smartphones und Tablets responsiv.",
        "devlog.entry3.change1": "Responsive Layouts für Mobil- und Tabletgeräte hinzugefügt.",
        "devlog.entry3.change2": "Ein eigenes mobiles Navigationsmenü ergänzt.",
        "devlog.entry3.change3": "Abstände, Elementgrössen, Bereiche, Projektkarten und Kontaktbereich für kleinere Bildschirme angepasst.",
        "devlog.entry3.challenge": "Desktop-Navigation, Bereiche, Projektkarten und Kontaktbereich mussten auch auf kleineren Bildschirmen nutzbar bleiben.",
        "devlog.entry3.solution": "Responsive Breakpoints, ein mobiles Menü sowie komponentenspezifische Abstands- und Grössenanpassungen wurden ergänzt.",
        "devlog.entry3.learning": "Ich lernte, dass responsives Design nicht nur eine globale Skalierung ist: Jede Komponente benötigt eine eigene Layout- und Interaktionskontrolle.",
        "devlog.entry3.outlook": "Am 23. Juli folgten mehrere kleinere mobile Anpassungen, bevor die Arbeit in Richtung Version 1.2 weiterging.",
        "devlog.entry4.date": "31. Juli – 1. August 2026",
        "devlog.entry4.title": "Qualität, Performance und Optimierung",
        "devlog.entry4.summary": "Version 1.2 verbesserte Dokumentation und Wartbarkeit; Version 1.2.1 folgte mit UI-Korrekturen und Optimierungen.",
        "devlog.entry4.change1": "Datenschutzerklärung, Copyright- und Versionsangaben, Screenshots und eine erweiterte Projektdokumentation hinzugefügt.",
        "devlog.entry4.change2": "Wiederholte JavaScript-Werte und direkte Farben durch beschreibende Konstanten und CSS-Variablen ersetzt.",
        "devlog.entry4.change3": "Codestruktur verbessert, den versteckten Rückkehr-Link der Datenschutzerklärung korrigiert und die Browser-Konsole geprüft.",
        "devlog.entry4.change4": "v1.2.1 mit UI-Korrekturen und Optimierungen veröffentlicht.",
        "devlog.entry4.challenge": "Wiederholte Werte, direkte Farben und die wachsende Dokumentation verringerten die Übersicht. Pull-to-refresh auf Mobilgeräten war zudem als browserspezifisches Problem dokumentiert.",
        "devlog.entry4.solution": "Zentrale Variablen, beschreibende Konstanten, klarere Dokumentation, gezielte Korrekturen und Konsolenprüfungen machten das Projekt wartbarer.",
        "devlog.entry4.learning": "Ich lernte, dass Qualität auch Wartbarkeit, Dokumentation, Datenschutz, browserübergreifendes Verhalten und konsistente Versionsangaben bedeutet.",
        "devlog.entry4.outlook": "Das CHANGELOG führt weitere Bereinigungen, Fallbacks und Arbeiten am Animationsverhalten als Unreleased auf; eine Release-Version oder ein Datum sind dafür noch nicht dokumentiert.",
        "devlog.entry5.date": "Bis 1. August 2026",
        "devlog.entry5.version": "BIS v1.2.1",
        "devlog.entry5.title": "Was ich bis Version 1.2 gelernt habe",
        "devlog.entry5.summary": "Die dokumentierte Geschichte zeigt den Weg vom visuellen Lernprojekt zu einem responsiven, dokumentierten und wartbareren Portfolio.",
        "devlog.entry5.change1": "Ein vollständiges statisches Projekt mit HTML, CSS und JavaScript aufgebaut.",
        "devlog.entry5.change2": "Den ersten Release zu einem responsiven Erlebnis für Desktop, Tablet und Mobilgeräte erweitert.",
        "devlog.entry5.change3": "Struktur, Dokumentation und Konsistenz verbessert, statt mich nur auf die Optik zu konzentrieren.",
        "devlog.entry5.challenge": "Mit dem wachsenden Funktionsumfang mussten Designkonsistenz, Browserverhalten und Lesbarkeit des Codes gemeinsam berücksichtigt werden.",
        "devlog.entry5.solution": "Versionierte Releases, gezielte mobile Folge-Commits und spätere Refactorings machten aus der Arbeit kleinere, nachvollziehbare Verbesserungen.",
        "devlog.entry5.learning": "Ich lernte, Design, Interaktion, responsives Verhalten, Codestruktur und Dokumentation als Teile eines gemeinsamen Systems zu betrachten.",
        "devlog.entry5.outlook": "Ab Version 1.3 verwenden neue Einträge die vorbereitete Vorlage und dokumentieren wichtige Meilensteine statt jeder kleinen Änderung.",
        "devlog.nextLabel": "NÄCHSTE MISSION",
        "devlog.next": "Die vorbereitete Eintragsvorlage für Version 1.3 und jeden wichtigen Release danach verwenden."
    }
});

let currentLanguage = "en";

function translate(key) {
    return i18nMessages[currentLanguage]?.[key] ??
        i18nMessages.en[key] ??
        key;
}

function getSavedLanguage() {
    try {
        return localStorage.getItem(languageStorageKey);
    } catch (error) {
        return null;
    }
}

function saveLanguage(language) {
    try {
        localStorage.setItem(languageStorageKey, language);
    } catch (error) {
        // The selected language still applies for the current page session.
    }
}

function getInitialLanguage() {
    const pageLanguage = document.documentElement.dataset.pageLanguage;

    if (supportedLanguages.includes(pageLanguage)) {
        return pageLanguage;
    }

    const savedLanguage = getSavedLanguage();

    if (supportedLanguages.includes(savedLanguage)) {
        return savedLanguage;
    }

    const browserLanguage = navigator.languages?.[0] ??
        navigator.language ??
        "en";

    return browserLanguage.toLowerCase().startsWith("de")
        ? "de"
        : "en";
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = translate(element.dataset.i18n);
    });

    const attributeBindings = [
        ["data-i18n-placeholder", "placeholder"],
        ["data-i18n-aria-label", "aria-label"],
        ["data-i18n-alt", "alt"],
        ["data-i18n-href", "href"],
        ["data-i18n-content", "content"]
    ];

    attributeBindings.forEach(([dataAttribute, targetAttribute]) => {
        document.querySelectorAll(`[${dataAttribute}]`).forEach((element) => {
            element.setAttribute(
                targetAttribute,
                translate(element.getAttribute(dataAttribute))
            );
        });
    });

    const openGraphLocale = document.querySelector(
        'meta[property="og:locale"]'
    );

    if (openGraphLocale) {
        openGraphLocale.content = currentLanguage === "de"
            ? "de_CH"
            : "en_US";
    }

    const alternateOpenGraphLocale = document.querySelector(
        'meta[property="og:locale:alternate"]'
    );

    if (alternateOpenGraphLocale) {
        alternateOpenGraphLocale.content = currentLanguage === "de"
            ? "en_US"
            : "de_CH";
    }
}

function updateLanguageControls() {
    document.querySelectorAll("[data-language]").forEach((control) => {
        const isActive = control.dataset.language === currentLanguage;
        control.classList.toggle("is-active", isActive);

        if (control.matches("a[href]")) {
            control.removeAttribute("aria-pressed");

            if (isActive) {
                control.setAttribute("aria-current", "page");
            } else {
                control.removeAttribute("aria-current");
            }

            return;
        }

        control.setAttribute("aria-pressed", String(isActive));
    });
}

function setLanguage(language, { persist = true } = {}) {
    const nextLanguage = supportedLanguages.includes(language)
        ? language
        : "en";

    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage === "de"
        ? "de-CH"
        : "en";

    if (persist) {
        saveLanguage(nextLanguage);
    }

    applyTranslations();
    updateLanguageControls();

    document.dispatchEvent(new CustomEvent("languagechange", {
        detail: {
            language: nextLanguage
        }
    }));
}

document.querySelectorAll("[data-language]").forEach((control) => {
    control.addEventListener("click", () => {
        if (control.matches("a[href]")) {
            saveLanguage(control.dataset.language);
            return;
        }

        setLanguage(control.dataset.language);
    });
});

setLanguage(getInitialLanguage(), { persist: false });
