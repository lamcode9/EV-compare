import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — battery.mom',
  description: 'Get in touch with battery.mom — corrections, feedback, data requests, or partnership inquiries.',
  alternates: { canonical: '/contact' },
}

import ContactFormClient from './page-client'

export default function ContactPage() {
  return <ContactFormClient />
}
