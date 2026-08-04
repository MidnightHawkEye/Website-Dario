# Changelog

All notable changes to DARIO.exe are documented in this file.

---

## [Unreleased]

### Fixed

- Restored the custom styling of the 404 page
- Removed invalid and empty favicon references
- Removed unintended text rendered above the main page
- Added guarded fallbacks when GSAP or EmailJS is unavailable
- Added Matrix canvas resizing for viewport changes
- Aligned programmatic scrolling with reduced-motion preferences

### Changed

- Removed a duplicate URL hash-change handler
- Removed unused CSS variables and HTML class hooks
- Synchronized version labels and cache-busting parameters
- Corrected outdated comments and JavaScript constant names
- Standardized JavaScript variables and functions to lowerCamelCase
- Renamed internal classes and IDs for clearer component ownership

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
