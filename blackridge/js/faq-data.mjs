import { facts } from "./faq-facts.mjs";

export const routes = {
  de: { services: "leistungen/", pricing: "preise/", contact: "kontakt/", about: "ueber-mich/" },
  en: { services: "en/services/", pricing: "en/pricing/", contact: "en/contact/", about: "en/about/" },
};

export const suggestions = ["cleaning", "build", "parts", "services", "contact"];

export function getFaqEntries(formAvailable) {
  const de = facts.de.prices, en = facts.en.prices;
  return [
    {
      id: "cleaning", category: "pricing", links: ["pricing#reinigung-preis", "services#reinigung"],
      weak: ["reinigung", "reinigen", "reinigt", "säubern", "putzen", "wartung", "entstauben", "cleaning", "clean", "cleaned", "maintenance"],
      context: ["pc", "pcs", "pc s", "computer", "computers", "rechner", "gehaeuse", "gehäuse", "case", "lüfter", "fans", "preis", "kostet"],
      shortQueries: ["Reinigung", "Was kostet die Reinigung?", "Wie läuft eine PC-Reinigung ab?", "Cleaning", "How much does cleaning cost?"],
      de: {
        question: "Was kostet eine PC-Reinigung?",
        answer: `PC-Innenreinigung: ${de.cleaning}\n\nSie umfasst das Gehäuseinnere und zugängliche Lüfter und Kühlkomponenten. Die Intensivreinigung ist separat aufgeführt (${de.deepCleaning}).`,
        terms: ["innenreinigung", "pc reinigung", "pc putzen", "rechner reinigen", "lüfter reinigen"],
      },
      en: {
        question: "How much does PC cleaning cost?",
        answer: `PC interior cleaning: ${en.cleaning}\n\nIt covers the inside of the case and accessible fans and cooling components. Deep cleaning is listed separately (${en.deepCleaning}).`,
        terms: ["pc cleaning", "computer cleaning", "dust removal", "dusty pc", "interior cleaning"],
      },
    },
    {
      id: "deep-cleaning", category: "pricing", links: ["pricing#intensiv-preis"], specificity: 2,
      de: {
        question: "Was kostet die Intensivreinigung?",
        answer: `Intensivreinigung: ${de.deepCleaning}\n\nSie umfasst eine erweiterte Innenreinigung und den Wechsel der Wärmeleitpaste an den vereinbarten Komponenten. Ob die Paste im Richtpreis enthalten ist, steht in der Offerte.`,
        terms: ["intensivreinigung", "intensiv reinigung", "wärmeleitpaste", "waermeleitpaste"],
      },
      en: {
        question: "How much does deep cleaning cost?",
        answer: `Deep cleaning: ${en.deepCleaning}\n\nIt includes extended interior cleaning and replacing thermal paste on agreed components. The quote states whether the paste is included in the indicative price.`,
        terms: ["deep cleaning", "deep clean", "thermal paste", "repaste"],
      },
    },
    {
      id: "build", category: "services", links: ["services#aufbau", "pricing#aufbau-preis"],
      weak: ["bauen", "baut", "aufbau", "build", "builds", "assemble", "assembly"],
      context: ["pc", "pcs", "pc s", "computer", "computers", "rechner", "workstation", "workstations", "gaming"],
      shortQueries: ["PC-Aufbau", "Assembly", "PC build"],
      de: {
        question: "Kann ich einen PC zusammenstellen lassen?",
        answer: `Blackridge stellt Gaming-PCs, Office-PCs und Workstations passend zu Ihrem Einsatzzweck und Budget zusammen. Der Aufbau umfasst eine grundlegende Funktionsprüfung.\n\nRichtpreis für Zusammenstellung und Aufbau: ${de.build}`,
        terms: ["zusammenstellen", "zusammenstellung", "zusammenbau", "zusammenbauen", "neuen computer", "neuen pc", "individuelle pc builds"],
      },
      en: {
        question: "Can you build a custom PC?",
        answer: `Blackridge builds gaming PCs, office PCs and workstations to suit your needs and budget. Assembly includes a basic function check.\n\nIndicative price for a custom build: ${en.build}`,
        terms: ["custom pc", "new computer", "new pc", "building a pc"],
      },
    },
    {
      id: "parts", category: "services", links: ["services#faq"],
      requires: [["komponenten", "teile", "hardware", "grafikkarte", "parts", "components", "graphics card"]],
      de: {
        question: "Kann ich eigene Komponenten mitbringen?",
        answer: "Eigene oder bereits vorhandene Teile können für einen PC-Aufbau oder ein Upgrade verwendet werden. Vor dem Einbau prüft Blackridge, ob die Teile zum System passen.",
        terms: ["eigene", "eigenen", "meine", "vorhandene", "vorhandenen", "mitbringen", "wiederverwenden"],
      },
      en: {
        question: "Can I provide my own components?",
        answer: "You can provide your own parts for a PC build or upgrade. Blackridge checks whether the parts are compatible with the system before installing them.",
        terms: ["own", "existing", "bring", "reuse", "my parts", "my hardware", "already have"],
      },
    },
    {
      id: "advice", category: "services", links: ["services#beratung", "pricing#beratung-preis"],
      de: {
        question: "Bietet Blackridge Kaufberatung an?",
        answer: `Blackridge berät Sie bei der PC- und Hardwareauswahl und bei Upgrades. Die Empfehlungen richten sich nach Ihren Anforderungen und Ihrem Budget. Richtpreis: ${de.advice}.`,
        terms: ["beratung", "kaufberatung", "hardwareberatung", "kaufempfehlung", "teile auswählen", "welche hardware", "was kaufen"],
      },
      en: {
        question: "Does Blackridge offer purchase advice?",
        answer: `Blackridge offers advice on choosing a PC, selecting parts and deciding which upgrades are worthwhile for your needs and budget. Indicative price: ${en.advice}.`,
        terms: ["advice", "consultation", "buying advice", "recommendations", "which parts", "what hardware", "help choosing"],
      },
    },
    {
      id: "windows", category: "pricing", links: ["pricing#windows-preis"],
      weak: ["windows"], context: ["installation", "install", "installieren", "einrichten", "setup", "pc", "preis", "kostet", "cost"],
      shortQueries: ["Windows"],
      de: {
        question: "Was kostet eine Windows-Installation?",
        answer: `Windows-Installation: ${de.windows}\n\nSie umfasst die grundlegende Einrichtung, Basistreiber und eine Funktionsprüfung. Windows-Lizenzen sind separat zu berücksichtigen.`,
        terms: ["betriebssystem installieren", "windows installation", "windows einrichten"],
      },
      en: {
        question: "How much does Windows installation cost?",
        answer: `Windows installation: ${en.windows}\n\nIt includes basic setup, essential drivers and a function check. Windows licences are separate.`,
        terms: ["install windows", "windows setup", "operating system installation"],
      },
    },
    {
      id: "upgrade", category: "pricing", links: ["pricing#upgrade-preis", "services#beratung"],
      weak: ["replace", "swap", "ersetzen", "austauschen", "einbauen"],
      context: ["graphics card", "gpu", "grafikkarte", "ram", "arbeitsspeicher", "prozessor"],
      de: {
        question: "Was kostet ein Hardware-Upgrade?",
        answer: `Hardware-Upgrade: ${de.upgrade}\n\nEs umfasst die Kompatibilitätsprüfung, den Einbau oder Austausch und eine grundlegende Funktionsprüfung. Hardware und Ersatzteile werden separat verrechnet.`,
        terms: ["upgrade", "aufrüsten", "aufruesten", "aufrüstung", "aufruestung", "grafikkarte austauschen", "ram einbauen"],
      },
      en: {
        question: "How much does a hardware upgrade cost?",
        answer: `Hardware upgrade: ${en.upgrade}\n\nIt includes a compatibility check, fitting or replacing parts and a basic function check. Hardware and spare parts are charged separately.`,
        terms: ["upgrade", "upgrading", "replace graphics card", "install ram", "hardware replacement"],
      },
    },
    {
      id: "services", category: "services", general: true, links: ["services", "services#faq"],
      de: {
        question: "Welche Dienstleistungen bietet Blackridge an?",
        answer: `Das Angebot von Blackridge Technical:\n\n${facts.de.services.map(service => "• " + service).join("\n")}`,
        terms: ["dienstleistungen", "leistungen", "angebot", "was bietet blackridge", "was bietet ihr an"],
      },
      en: {
        question: "What services does Blackridge offer?",
        answer: `Blackridge Technical offers:\n\n${facts.en.services.map(service => "• " + service).join("\n")}`,
        terms: ["services", "what do you offer", "help with pcs", "what does blackridge offer"],
      },
    },
    {
      id: "pricing", category: "pricing", general: true, links: ["pricing"],
      shortQueries: ["Kosten", "Preise", "Preis", "Was kostet das?", "Was kostet es?", "Wie teuer ist das?", "Pricing", "Prices",
        "Cost", "How much does it cost?", "How much?", "How much do you charge?"],
      de: {
        question: "Wo finde ich die Preisübersicht?",
        answer: "Die Preisübersicht enthält unverbindliche Richtpreise in CHF. Hardware, Ersatzteile und zusätzliches Material werden separat berücksichtigt. Den konkreten Preis erfahren Sie in der Offerte.",
        terms: ["preisübersicht", "preisuebersicht", "preisliste", "richtpreise"],
      },
      en: {
        question: "Where can I find your prices?",
        answer: "The price list gives indicative prices in CHF. Hardware, spare parts and extra materials are separate. Your quote shows the price for your specific request.",
        terms: ["price list", "your pricing", "your prices", "indicative prices"],
      },
    },
    {
      id: "contact", category: "contact", general: true, links: ["contact#contact-channel"],
      de: {
        question: "Wie kann ich eine Anfrage stellen?",
        answer: formAvailable
          ? "Für Fragen zu den Dienstleistungen oder eine unverbindliche Offerte können Sie das Kontaktformular verwenden oder per E-Mail oder WhatsApp schreiben. Die Kontaktseite zeigt alle Wege."
          : "Für Fragen zu den Dienstleistungen oder eine unverbindliche Offerte erreichen Sie Blackridge per E-Mail oder WhatsApp. Der Versand über das Kontaktformular ist derzeit pausiert.",
        terms: ["kontakt", "kontaktformular", "anfrage", "anschreiben", "whatsapp", "e mail", "kontaktieren", "erreichen", "nachricht senden"],
      },
      en: {
        question: "How can I make an enquiry?",
        answer: formAvailable
          ? "For questions about services or a no-obligation quote, you can use the contact form or get in touch by email or WhatsApp. All options are on the contact page."
          : "For questions about services or a no-obligation quote, you can reach Blackridge by email or WhatsApp. Contact form submissions are currently paused.",
        terms: ["contact", "contact form", "enquiry", "inquiry", "get in touch", "whatsapp", "email", "message you"],
      },
    },
    {
      id: "process", category: "contact", links: ["services#ablauf", "contact#contact-channel"],
      de: {
        question: "Wie läuft eine Anfrage ab?",
        answer: "Zuerst schildern Sie Ihr Anliegen. Danach besprechen wir die passende Lösung, die Kosten und das Vorgehen. Sie erhalten eine unverbindliche Offerte. Nach Ihrer Bestätigung folgen die vereinbarten Arbeiten und die Übergabe.",
        terms: ["ablauf", "ablaufen", "wie funktioniert die anfrage", "offerte", "angebot anfragen", "unverbindliches angebot", "buchen", "auftrag erteilen"],
      },
      en: {
        question: "What is the enquiry process?",
        answer: "Start by telling us what you need. We discuss the solution, costs and next steps and give you a no-obligation quote. Once you approve it, we carry out the agreed work and arrange the handover.",
        terms: ["enquiry process", "process", "quote", "estimate", "request a quote", "book an appointment", "place an order"],
      },
    },
  ];
}
