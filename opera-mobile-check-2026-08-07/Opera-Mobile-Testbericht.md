# Opera Mobile compatibility check

**Website:** https://dario-exe.ch/  
**Test date:** August 7, 2026  
**Local Opera version:** 133.0.5932.85  
**Lighthouse version:** 13.4.1

## Test scope

The live website was checked with:

- the locally installed Opera desktop engine launched by Lighthouse with a 390 × 844 pixel mobile profile;
- an interactive Chromium mobile test at 390 × 844 pixels;
- an additional landscape check at 844 × 390 pixels.

Opera for Android 100 uses Chromium 149 according to Opera's release notes.
The local Opera test binary used a newer Chromium generation, which provides a
useful rendering-engine compatibility check. It does not reproduce Opera
Android's complete app interface.

## Results

| Check | Result |
|---|---|
| Portrait layout | Passed |
| Landscape layout | Passed |
| Horizontal overflow | None detected |
| Mobile menu open and close | Passed |
| Body scroll lock while menu is open | Passed |
| Section navigation | Passed |
| Menu closes after selecting a link | Passed |
| Normal page reload returns to the top | Passed |
| German language remains selected after reload | Passed |
| Browser console errors and warnings | None detected |

## Opera-engine Lighthouse result

| Category | Score |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

| Metric | Result |
|---|---:|
| First Contentful Paint | 1.5 s |
| Largest Contentful Paint | 1.5 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.018 |
| Speed Index | 1.5 s |

## Remaining known limitation

Opera implements pull-to-refresh in the Android browser interface. Desktop
engine emulation can verify normal reload and scroll restoration, but it cannot
faithfully reproduce this native gesture. No physical Android test device is
currently available, and testing on an iPhone cannot verify this
Opera-for-Android-specific behaviour. The previous report therefore remains
classified as unverified:

> Pull-to-refresh may interfere with the page's scrolling behaviour or current
> scroll position.

This does not indicate a confirmed layout or JavaScript defect in the current
website. No problem occurred during normal reload, navigation or scrolling in
the automated checks.

## Deferred Opera Android check

The following check is optional and should only be performed in the future if
access to a physical Android device becomes available:

1. Open https://dario-exe.ch/ in the current Opera for Android version.
2. Scroll through About, Skills, Projects and Contact.
3. Return to the top and perform Opera's pull-to-refresh gesture.
4. Confirm that the website reloads at the top and remains scrollable.
5. Open and close the mobile menu after the refresh.
6. Select German, refresh again and confirm that German remains active.

## References

- [Opera for Android 100 release notes](https://blogs.opera.com/mobile/2026/07/opera-for-android-just-turned-100/)
- [Opera mobile navigation and pull-to-refresh documentation](https://help.opera.com/en/mobileios/navigation/)
