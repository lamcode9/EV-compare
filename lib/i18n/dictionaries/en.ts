// Base dictionary — the source of truth. Every other locale is a *partial*
// override of this shape; any key a locale hasn't translated falls back to the
// English value here (see getDictionary). The `Dictionary` type is inferred
// from this object, so adding a key here makes it required everywhere it's read
// and optional in each locale override.
//
// Scope (groundwork): shared chrome and common UI strings only. Long-form page
// content and editorial articles are intentionally NOT in here yet — translating
// those is a separate, larger effort tracked in docs/i18n-groundwork.html.

const en = {
  common: {
    search: 'Search',
    compare: 'Compare',
    country: 'Country',
    loading: 'Loading…',
    tryAgain: 'Try again',
    goHome: 'Go home',
    learnMore: 'Learn more',
    exportCsv: 'Export CSV',
    downloadPng: 'Download PNG',
    selectCountry: 'Select a country',
  },
  nav: {
    home: 'Home',
    bigPicture: 'Big Picture',
    evs: 'EVs',
    batterySolar: 'Battery & Solar',
    insights: 'Insights',
    about: 'About',
    compareEvs: 'Compare EVs',
  },
  footer: {
    independentLine:
      'Independent energy-transition data for humans making real-world decisions.',
    rightsReserved: 'All rights reserved.',
  },
  ev: {
    pageTitle: 'Compare Electric Vehicles',
    searchAndCompare: 'Search and Compare Electric Vehicles',
    quickPicks: 'Quick Picks',
    addToCompare: 'Add to comparison',
    searchPlaceholder: 'Search EVs like Tesla Model 3, BYD Atto 3…',
    selectCountryFirst: 'Select a country first',
  },
  errors: {
    sectionFailed: 'Something went wrong loading this section. Please try again.',
    chartFailed: "This chart couldn't be displayed.",
  },
}

export type Dictionary = typeof en

export default en
