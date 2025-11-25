# API Ninjas Acceleration Data Integration

## Overview

Added support for pulling **0-100 km/h acceleration time** (≈ 0-60 mph) and **horsepower** from API Ninjas Electric Vehicle API.

## Changes Made

### 1. Database Schema (`prisma/schema.prisma`)
- Added `acceleration0To100Kmh` field (optional Float) to Vehicle model
- This stores the 0-100 km/h acceleration time in seconds from API Ninjas

### 2. API Integration (`lib/data-fetchers/ev-api.ts`)
- Updated `TransformedVehicle` interface to include `acceleration0To100Kmh`
- Enhanced `transformVehicle()` function to extract `acceleration_0_100_kmh` from API Ninjas response
- Parses acceleration data in formats like "5.3 s", "5.3", or "5.3 sec"

### 3. Vehicle Transformer (`lib/data-fetchers/vehicle-transformer.ts`)
- Updated `VehicleInput` interface to accept `acceleration0To100Kmh`
- Passes acceleration data through to database save operation

### 4. Cron Job (`app/api/cron/update-vehicles/route.ts`)
- Updated both SG and MY vehicle processing to pass `acceleration0To100Kmh` from API data

### 5. Frontend (`components/StatsGrid.tsx`)
- Updated to use actual acceleration data from database when available
- Falls back to estimation if API data not available
- Horsepower is calculated from kW (1 kW ≈ 1.341 hp) - no API change needed

### 6. Type Definitions (`types/vehicle.ts`)
- Added `acceleration0To100Kmh?: number | null` to Vehicle interface

## How It Works

1. **API Ninjas provides**: `acceleration_0_100_kmh` field (e.g., "5.3 s")
2. **We extract**: The numeric value (5.3 seconds)
3. **We store**: In database as `acceleration0To100Kmh`
4. **We display**: As 0-60 Performance (0-100 km/h ≈ 0-60 mph, difference is negligible)

## Horsepower

Horsepower is **calculated** from the existing `powerRatingKw` field:
- Formula: `hp = kW × 1.341`
- No API change needed - we already get `total_power` in kW from API Ninjas

## Next Steps

1. **Run database migration**:
   ```bash
   npx prisma db push
   ```

2. **Test the cron job**:
   - The next time the cron runs, it will fetch acceleration data from API Ninjas
   - Vehicles will be updated with actual 0-100 km/h times when available

3. **Verify data**:
   - Check that vehicles now have `acceleration0To100Kmh` populated
   - Frontend will automatically use real data instead of estimates

## Notes

- **0-100 km/h vs 0-60 mph**: The difference is minimal (0-100 km/h = 0-62.14 mph), so we use the API data directly
- **Fallback**: If API doesn't provide acceleration data, we still estimate based on power-to-weight ratio
- **Horsepower**: Always calculated from kW, no API field needed

## API Ninjas Field Reference

- `acceleration_0_100_kmh`: 0-100 km/h acceleration time (e.g., "5.3 s")
- `total_power`: Total power in kW (already used for `powerRatingKw`)

