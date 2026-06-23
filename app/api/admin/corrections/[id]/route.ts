import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const correction = await prisma.correction.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: 'admin',
      },
    })

    return NextResponse.json({ success: true, correction })
  } catch (error) {
    console.error('Failed to update correction:', error)
    return NextResponse.json({ error: 'Failed to update correction' }, { status: 500 })
  }
}
