(() => {
    const eraStorageKey = "dario-era";
    let initialEra = "2026";

    try {
        if (localStorage.getItem(eraStorageKey) === "1998") {
            initialEra = "1998";
        }
    } catch {
        initialEra = "2026";
    }

    document.documentElement.dataset.era = initialEra;
})();
