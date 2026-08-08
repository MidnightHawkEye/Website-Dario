# Changelog

All notable changes to DARIO.exe are documented in this file.

---

## [Unreleased]

---

## [1.3.0] - 2026-08-08

### Added

- Added English and German page structures with a persistent language selector
- Added centralized translations for visible content, metadata, form messages, ARIA labels, alternative text and language-dependent links
- Added English as the fallback language for unsupported languages and missing translation keys
- Added a bilingual DEVLOG with milestone entries, newest-first ordering and a reusable template for future releases
- Added localized canonical, `hreflang` and sitemap references for the English and German pages
- Added Lighthouse documentation with Desktop, Mobile and animation-migration reports
- Added an Opera Mobile compatibility report with a deferred Android test procedure

### Changed

- Replaced GSAP and ScrollTrigger animations with native CSS, JavaScript and `IntersectionObserver`
- Updated Matrix and particle effects to stop during reduced motion and while the browser tab is inactive
- Updated scrolling, typing, loader and reveal behaviour to respect `prefers-reduced-motion`
- Improved desktop and mobile navigation, including separate DEVLOG access and translated accessible labels
- Made the DARIO.exe navigation logo a keyboard-accessible link to the Hero section
- Expanded the README with multilingual architecture, DEVLOG maintenance, animation details, Lighthouse results and known browser limitations
- Standardized JavaScript variables and functions to lowerCamelCase and clarified internal component names
- Updated visible website version labels to v1.3

### Removed

- Removed the GSAP and ScrollTrigger CDN dependencies and the former `gsap-animations.js` implementation
- Removed duplicate URL hash handling, unused CSS variables and unused HTML class hooks
- Removed invalid or empty favicon references and unintended text above the main page
- Removed the unused `getCurrentLanguage()` helper and the empty root-level favicon file

### Fixed

- Restored the custom styling of the 404 page and added language-aware return links
- Added a guarded fallback when EmailJS is unavailable
- Added Matrix canvas resizing for viewport changes
- Aligned programmatic scrolling with reduced-motion preferences

### Tested

- Verified English and German navigation, language persistence, fallback translations, contact forms and keyboard operation
- Verified responsive layouts without clipped text or horizontal overflow on Desktop and Mobile profiles
- Recorded Lighthouse scores of 100 for Performance, Accessibility, Best Practices and SEO on both Desktop and Mobile
- Retested the live website with Opera 133 using portrait and landscape mobile profiles without browser console errors or warnings

### Known Issues

- Opera for Android: Native pull-to-refresh remains unverified because no physical Android test device is currently available; it was previously reported to interfere with the page's scroll position

---

## [1.2.1] - 2026-08-01

### Changed

- UI fixes and optimizations

---

## [1.2.0] - 2026-07-31

### Added

- Privacy Policy page
- Copyright notice in the footer
- Current version number in the footer
- CSS variables for the main website colors
- Project description in the README
- Feature overview in the README
- Installation and local usage instructions
- Project structure documentation
- Technologies and libraries section
- Known Issues section
- Website screenshots and preview section

### Changed

- Replaced repeated JavaScript values with descriptive constants
- Replaced repeated color values with CSS variables
- Improved the structure and documentation of the project
- Renamed the main website header class to prevent conflicts with the Privacy Policy page

### Fixed

- Fixed the hidden return link on the Privacy Policy page
- Removed remaining direct accent color values from the CSS
- Checked the browser console for JavaScript errors and warnings

### Known Issues

- Opera Mobile: Pull-to-refresh may interfere with the page's scrolling behaviour
- Microsoft Edge Mobile: Pull-to-refresh may restore the last viewed section instead of returning to the top of the page

---

## [1.1.0]

### Added

- Responsive layout for mobile and tablet devices
- Mobile navigation menu
- Adjustments for different screen sizes

### Changed

- Improved spacing and element sizes on smaller displays
- Adapted navigation, sections and project cards for mobile devices
- Improved the contact section on smaller screens

---

## [1.0.0]

### Added

- Initial release of DARIO.exe
- Futuristic cyberpunk and terminal-inspired design
- Hero section with typing animation
- Sticky navigation bar
- Active navigation section highlighting
- Smooth scrolling
- Scroll progress indicator
- About Me section
- Skills section with animated skill bars
- Projects section with GitHub links
- Contact terminal powered by EmailJS
- Contact form spam protection
- Matrix-style background animation
- Particle background effects
- Loader animation
- Return-to-system button
