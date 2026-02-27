import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, category, message } = body

    if (!name || !email || !category || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // For now, log the contact submission
    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log('[Contact Form]', {
      name,
      email,
      category,
      message: message.substring(0, 200),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
