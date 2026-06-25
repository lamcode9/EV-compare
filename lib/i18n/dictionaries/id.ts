import type { LocaleDictionary } from '../types'

// Bahasa Indonesia — PARTIAL. Core chrome translated; everything else falls back
// to English. Needs native-speaker review before marketing as a full locale.
const id: LocaleDictionary = {
  common: {
    search: 'Cari',
    compare: 'Bandingkan',
    country: 'Negara',
    loading: 'Memuat…',
    tryAgain: 'Coba lagi',
    goHome: 'Ke beranda',
    learnMore: 'Pelajari lebih lanjut',
    selectCountry: 'Pilih negara',
  },
  nav: {
    home: 'Beranda',
    evs: 'Kendaraan Listrik',
    insights: 'Wawasan',
    about: 'Tentang',
    compareEvs: 'Bandingkan EV',
  },
  ev: {
    searchAndCompare: 'Cari dan Bandingkan Kendaraan Listrik',
  },
  footer: {
    rightsReserved: 'Hak cipta dilindungi.',
  },
}

export default id
