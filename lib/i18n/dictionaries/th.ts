import type { LocaleDictionary } from '../types'

// ไทย (Thai) — PARTIAL. Core chrome translated; everything else falls back to
// English. Needs native-speaker review before marketing as a full locale.
const th: LocaleDictionary = {
  common: {
    search: 'ค้นหา',
    compare: 'เปรียบเทียบ',
    country: 'ประเทศ',
    loading: 'กำลังโหลด…',
    tryAgain: 'ลองอีกครั้ง',
    goHome: 'ไปหน้าแรก',
    learnMore: 'เรียนรู้เพิ่มเติม',
    selectCountry: 'เลือกประเทศ',
  },
  nav: {
    home: 'หน้าแรก',
    evs: 'ยานยนต์ไฟฟ้า',
    insights: 'ข้อมูลเชิงลึก',
    about: 'เกี่ยวกับ',
    compareEvs: 'เปรียบเทียบรถ EV',
  },
  ev: {
    searchAndCompare: 'ค้นหาและเปรียบเทียบยานยนต์ไฟฟ้า',
  },
  footer: {
    rightsReserved: 'สงวนลิขสิทธิ์',
  },
}

export default th
