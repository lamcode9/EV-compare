import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, country } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      if (existing.unsubscribed) {
        // Re-subscribe
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { unsubscribed: false, subscribedAt: new Date() },
        })
        return NextResponse.json({ message: 'Welcome back! You have been re-subscribed.' })
      }
      return NextResponse.json({ message: 'You are already subscribed.' })
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        country: country || null,
      },
    })

    return NextResponse.json({ message: 'Subscribed successfully! You will receive our monthly data digest.' })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
