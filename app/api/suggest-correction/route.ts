import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Country } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      country,
      vehicleName,
      field,
      currentValue,
      suggestedValue,
      source,
      email,
      notes,
    } = body

    // Validate required fields
    if (!type || !country || !vehicleName || !field || !currentValue || !suggestedValue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate country
    const validCountries: Country[] = ['SG', 'MY', 'ID', 'PH', 'TH', 'VN']
    if (!validCountries.includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country' },
        { status: 400 }
      )
    }

    // Create the correction record
    const correction = await prisma.correction.create({
      data: {
        type,
        country,
        itemName: vehicleName,
        field,
        currentValue,
        suggestedValue,
        source: source || null,
        email: email || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        correction: {
          id: correction.id,
          status: correction.status,
          createdAt: correction.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating correction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}