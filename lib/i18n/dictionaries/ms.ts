import type { LocaleDictionary } from '../types'

// Bahasa Melayu (Malay) — PARTIAL. Core chrome translated; everything else falls
// back to English. Needs native-speaker review before marketing as a full locale.
const ms: LocaleDictionary = {
  common: {
    search: 'Cari',
    compare: 'Bandingkan',
    country: 'Negara',
    loading: 'Memuatkan…',
    tryAgain: 'Cuba lagi',
    goHome: 'Ke laman utama',
    learnMore: 'Ketahui lebih lanjut',
    selectCountry: 'Pilih negara',
  },
  nav: {
    home: 'Laman Utama',
    evs: 'Kenderaan Elektrik',
    insights: 'Wawasan',
    about: 'Tentang',
    compareEvs: 'Bandingkan EV',
  },
  ev: {
    searchAndCompare: 'Cari dan Bandingkan Kenderaan Elektrik',
  },
  footer: {
    rightsReserved: 'Hak cipta terpelihara.',
  },
}

export default ms
