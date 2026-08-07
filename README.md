# DARIO.exe

> Building systems. Breaking limits. Learning code.

## Project Description

DARIO.exe is my personal developer portfolio, designed as a futuristic system interface inspired by cyberpunk, terminal and Matrix-style visuals.

The website presents my background in industrial automation, my growing experience in software development and cybersecurity, and the projects I have built during my learning journey.

DARIO.exe was created to strengthen my frontend development skills and to serve as a central place where I can document my progress, showcase my work and build my personal developer identity.

The website includes animated sections, interactive navigation, project cards, skill indicators, a contact terminal and several small system-inspired effects.



## Features

- Futuristic cyberpunk and terminal-inspired design
- Animated hero section with typing effects
- Sticky navigation bar with active section highlighting
- Smooth scrolling between page sections
- Scroll progress indicator
- Animated skill bars using native CSS and JavaScript
- Interactive project cards with GitHub links
- Responsive layout for desktop, tablet and mobile devices
- Contact terminal powered by EmailJS
- Spam protection for repeated contact form submissions
- Return-to-system button with animated status messages
- Matrix-style background animation
- Particle background effects
- Custom loader animation
- Privacy Policy page
- Bilingual DEVLOG with milestone-based version history
- Version number and copyright information in the footer

## Browser Compatibility

The navigation includes explicit scroll-restoration and URL-anchor handling
for refresh and pull-to-refresh behaviour on mobile browsers.

### Opera Mobile retest — August 7, 2026

The published website was retested with the locally installed Opera 133 engine,
Lighthouse mobile emulation at 390 × 844 pixels and an additional interactive
mobile check in portrait and landscape orientation.

The following checks passed:

- No horizontal overflow in portrait or landscape orientation
- Mobile navigation opens, closes and releases the page scroll lock correctly
- Navigation links close the menu and scroll to the requested section
- A normal page reload returns the website to the top
- German remains selected after a reload
- No browser console errors or warnings

Opera for Android owns the native pull-to-refresh gesture. That browser UI
behaviour cannot be reproduced completely by desktop engine emulation. The
previously documented issue is therefore classified as **unverified**, not as
a confirmed current website defect: pulling down to refresh at the top of the
page may interfere with the current scroll position. No physical Android test
device is currently available. Testing on an iPhone does not verify this
Opera-for-Android-specific browser behaviour. The check can be repeated later
if access to an Android device becomes available.

## Project Structure

```text
Website-Dario/
├── index.html          # Main portfolio page
├── devlog.html         # Project milestones and version history
├── 404.html            # Custom error page
├── privacy.html        # Privacy Policy
├── css/                # Stylesheets for layout and components
├── js/                 # JavaScript animations and interactions
├── assets/             # Images and website screenshots
├── CNAME               # Custom domain configuration
├── CHANGELOG.md        # Version history
├── LIGHTHOUSE.md       # Lighthouse results and report index
├── LICENSE.md          # Copyright and usage terms
└── README.md           # Project documentation
```

## Quality Reports

The current Desktop and Mobile scores, historical animation comparison
and links to all original Lighthouse reports are documented in
[LIGHTHOUSE.md](LIGHTHOUSE.md).

## Maintaining the DEVLOG

New milestone entries are added to `devlog.html`. A commented HTML
template for version 1.3 and later entries is included directly below
the current timeline. Matching German and English text keys are stored
centrally in `js/i18n.js`.



## Installation and Local Usage

DARIO.exe is a static website built with HTML, CSS and JavaScript. No package installation or build process is required.

### 1. Clone the repository

```bash
git clone https://github.com/MidnightHawkEye/Website-Dario.git
```
### 2. Open the project folder

```bash
cd Website-Dario
```

### 3. Start the website locally

Open the project in Visual Studio Code and start `index.html`
using the Live Server extension.

Alternatively, `index.html` can be opened directly in a modern
web browser. Using a local development server is recommended.

### Requirements

- A modern web browser
- An internet connection for EmailJS contact-form delivery
- Visual Studio Code with Live Server is recommended

### Contact Form

The contact form uses EmailJS. A valid EmailJS public key,
service ID and template ID are required for message delivery.

## Technologies and Libraries

### Core Technologies

- **HTML5** – Structure and semantic content
- **CSS3** – Layout, responsive design, animations and visual styling
- **JavaScript (ES6+)** – Interactions, navigation, animations and form logic

### Libraries and Services

- **CSS animations and transitions** – Interface motion and visual feedback
- **Intersection Observer API** – Scroll-based animation triggers
- **Canvas API** – Matrix and particle effects
- **EmailJS** – Contact form message delivery

### Development and Deployment

- **Git** – Version control
- **GitHub** – Repository hosting and project management
- **GitHub Pages** – Website deployment and hosting
- **Visual Studio Code** – Development environment
- **Live Server** – Local development server
  
## Preview

### Desktop

![DARIO.exe desktop preview](assets/screenshots/dario-exe-desktop.webp)

### Mobile

![DARIO.exe mobile preview](assets/screenshots/dario-exe-mobile.webp)

### Live Demo

[Open DARIO.exe](https://dario-exe.ch)

## License and Copyright

Copyright © 2026 Dario Hasler. All rights reserved.

This repository is publicly accessible for viewing and educational
reference purposes only. Copying, modifying, distributing or reusing
this project without prior written permission is not permitted.

For further information, see the [LICENSE.md](LICENSE.md) file.
