# Vehicle Options Scraping Setup

## Overview

The system can now scrape vehicle options/packages from official manufacturer websites. This includes packages like "Full Self-Driving", "Premium Interior", "Sunroof", etc.

## Supported Manufacturers

Currently supports scraping from:
- **Tesla** (tesla.com)
- **BYD** (byd.com)
- **Hyundai** (hyundai.com.sg / hyundai.com.my)
- **Kia** (kia.com.sg / kia.com.my)

## How It Works

1. **Scraper Selection**: Automatically selects the appropriate scraper based on vehicle name
2. **Website Navigation**: Uses Puppeteer to navigate to manufacturer websites
3. **Data Extraction**: Parses HTML to find options and prices
4. **Data Storage**: Saves options to database in `optionPrices` JSON field

## Setup

### 1. Enable Options Scraping

Add to your `.env` file:
```env
SCRAPE_OPTIONS=true
```

**Note**: Options scraping is **disabled by default** because:
- It's slower (adds 3-5 seconds per vehicle)
- Requires Puppeteer (larger bundle size)
- May hit rate limits on manufacturer websites
- Websites may change structure, breaking scrapers

### 2. Install Dependencies

Already installed:
- `puppeteer` - Browser automation
- `cheerio` - HTML parsing

### 3. Serverless Considerations

**Important**: Puppeteer may not work in serverless environments like Vercel without additional configuration.

**Options**:
1. **Use Vercel's Puppeteer support** (requires specific setup)
2. **Use a separate scraping service** (e.g., ScrapingBee, Apify)
3. **Run scraping on a dedicated server** (not serverless)
4. **Use a lighter alternative** (e.g., Playwright with chromium bundled)

## Usage

### Automatic (via Cron Job)

When `SCRAPE_OPTIONS=true`, the cron job will automatically scrape options for each vehicle:

```bash
# The cron job will:
# 1. Fetch vehicles from API Ninjas
# 2. For each vehicle, scrape options from manufacturer website
# 3. Save options to database
```

### Manual Scraping

You can also scrape options manually:

```typescript
import { scrapeVehicleOptions } from '@/lib/data-fetchers/options-scraper'

const options = await scrapeVehicleOptions('Tesla Model 3', 'Long Range AWD', 'SG')
// Returns: [{ name: 'Full Self-Driving', price: 12000 }, ...]
```

## Scraper Architecture

Each manufacturer has its own scraper class:
- `TeslaOptionsScraper` - Scrapes tesla.com
- `BYDOptionsScraper` - Scrapes byd.com
- `HyundaiKiaOptionsScraper` - Scrapes hyundai/kia websites

All scrapers implement the `OptionsScraper` interface.

## Rate Limiting

The scraper includes built-in rate limiting:
- 2 seconds delay between requests
- 3 seconds delay between vehicles
- Respects website rate limits

## Error Handling

- If scraping fails for a vehicle, it continues without options
- Errors are logged but don't stop the cron job
- Falls back gracefully if scraper not available for manufacturer

## Adding New Manufacturers

To add support for a new manufacturer:

1. Create a new scraper class implementing `OptionsScraper`
2. Add it to the `scrapeVehicleOptions` function
3. Implement manufacturer-specific URL patterns and selectors

Example:
```typescript
class BMWOptionsScraper implements OptionsScraper {
  async scrapeOptions(vehicleName: string, modelTrim: string, country: 'SG' | 'MY'): Promise<ScrapedOptions[]> {
    // Implementation
  }
}
```

## Troubleshooting

**Issue**: Scraping returns empty array
- **Solution**: Check if manufacturer website structure has changed
- Update selectors in the scraper

**Issue**: Puppeteer fails in serverless
- **Solution**: Use Playwright with bundled Chromium, or use a scraping service

**Issue**: Rate limiting errors
- **Solution**: Increase delays between requests in `options-scraper.ts`

## Future Improvements

- [ ] Add more manufacturers (BMW, Mercedes, etc.)
- [ ] Cache scraped options to reduce requests
- [ ] Use headless browser service for serverless compatibility
- [ ] Add option descriptions and images
- [ ] Support for option packages/bundles

## Notes

- Scraping is **optional** - set `SCRAPE_OPTIONS=true` to enable
- Scraping adds time to cron job (3-5 seconds per vehicle)
- Websites may change, requiring scraper updates
- Always respect robots.txt and rate limits

