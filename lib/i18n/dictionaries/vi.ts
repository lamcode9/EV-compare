import type { LocaleDictionary } from '../types'

// Tiếng Việt (Vietnamese) — PARTIAL. Core chrome translated; everything else
// falls back to English. Needs native-speaker review before marketing as a full
// locale.
const vi: LocaleDictionary = {
  common: {
    search: 'Tìm kiếm',
    compare: 'So sánh',
    country: 'Quốc gia',
    loading: 'Đang tải…',
    tryAgain: 'Thử lại',
    goHome: 'Về trang chủ',
    learnMore: 'Tìm hiểu thêm',
    selectCountry: 'Chọn quốc gia',
  },
  nav: {
    home: 'Trang chủ',
    evs: 'Xe điện',
    insights: 'Phân tích',
    about: 'Giới thiệu',
    compareEvs: 'So sánh xe điện',
  },
  ev: {
    searchAndCompare: 'Tìm kiếm và So sánh Xe điện',
  },
  footer: {
    rightsReserved: 'Bảo lưu mọi quyền.',
  },
}

export default vi
