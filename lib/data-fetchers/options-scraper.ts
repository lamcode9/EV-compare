/**
 * Vehicle Options Scraper
 * Scrapes official manufacturer websites for available options/packages for each vehicle model
 */

import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import type { OptionPrice } from '@/types/vehicle'

interface ScrapedOptions {
  name: string
  price: number
  currency: 'SGD' | 'MYR' | 'USD'
}

/**
 * Base scraper interface
 */
interface OptionsScraper {
  scrapeOptions(vehicleName: string, modelTrim: string, country: 'SG' | 'MY'): Promise<ScrapedOptions[]>
}

/**
 * Tesla Options Scraper
 * Scrapes from tesla.com
 */
class TeslaOptionsScraper implements OptionsScraper {
  async scrapeOptions(vehicleName: string, modelTrim: string, country: 'SG' | 'MY'): Promise<ScrapedOptions[]> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      // Tesla Singapore: https://www.tesla.com/en_sg/model3/design
      // Tesla Malaysia: https://www.tesla.com/en_my/model3/design
      const model = vehicleName.toLowerCase().includes('model 3')
        ? 'model3'
        : vehicleName.toLowerCase().includes('model y')
        ? 'modely'
        : vehicleName.toLowerCase().includes('model s')
        ? 'models'
        : vehicleName.toLowerCase().includes('model x')
        ? 'modelx'
        : null

      if (!model) return []

      const tld = country === 'SG' ? 'en_sg' : 'en_my'
      const url = `https://www.tesla.com/${tld}/${model}/design`

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
      await page.waitForTimeout(3000) // Wait for dynamic content

      const content = await page.content()
      const $ = cheerio.load(content)

      const options: ScrapedOptions[] = []

      // Tesla typically has Full Self-Driving and Premium Interior options
      // Look for option buttons/selectors
      $('[data-testid*="option"], [class*="option"], button[class*="package"]').each((_, el) => {
        const text = $(el).text().trim()
        const priceText = $(el).find('[class*="price"], [data-testid*="price"]').text().trim()

        if (text && priceText) {
          const price = this.parsePrice(priceText, country)
          if (price > 0 && (text.toLowerCase().includes('fsd') || text.toLowerCase().includes('self-driving') || text.toLowerCase().includes('premium'))) {
            options.push({
              name: text,
              price,
              currency: country === 'SG' ? 'SGD' : 'MYR',
            })
          }
        }
      })

      await browser.close()
      return options
    } catch (error) {
      console.error(`Error scraping Tesla options for ${vehicleName}:`, error)
      return []
    }
  }

  private parsePrice(priceText: string, country: 'SG' | 'MY'): number {
    // Remove currency symbols and extract number
    const cleaned = priceText.replace(/[^\d.,]/g, '').replace(/,/g, '')
    const price = parseFloat(cleaned)
    return isNaN(price) ? 0 : price
  }
}

/**
 * BYD Options Scraper
 * Scrapes from BYD official websites
 */
class BYDOptionsScraper implements OptionsScraper {
  async scrapeOptions(vehicleName: string, modelTrim: string, country: 'SG' | 'MY'): Promise<ScrapedOptions[]> {
    try {
      // BYD websites vary by region
      // Singapore: https://www.byd.com/sg
      // Malaysia: https://www.byd.com/my
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      const baseUrl = country === 'SG' ? 'https://www.byd.com/sg' : 'https://www.byd.com/my'
      const model = vehicleName.toLowerCase().includes('atto 3') ? 'atto-3' : 
                   vehicleName.toLowerCase().includes('seal') ? 'seal' : 
                   vehicleName.toLowerCase().includes('dolphin') ? 'dolphin' : null

      if (!model) return []

      const url = `${baseUrl}/${model}`

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
      await page.waitForTimeout(3000)

      const content = await page.content()
      const $ = cheerio.load(content)

      const options: ScrapedOptions[] = []

      // Look for option/package sections
      $('[class*="option"], [class*="package"], [class*="accessory"]').each((_, el) => {
        const text = $(el).find('h3, h4, [class*="title"]').text().trim()
        const priceText = $(el).find('[class*="price"]').text().trim()

        if (text && priceText) {
          const price = this.parsePrice(priceText, country)
          if (price > 0) {
            options.push({
              name: text,
              price,
              currency: country === 'SG' ? 'SGD' : 'MYR',
            })
          }
        }
      })

      await browser.close()
      return options
    } catch (error) {
      console.error(`Error scraping BYD options for ${vehicleName}:`, error)
      return []
    }
  }

  private parsePrice(priceText: string, country: 'SG' | 'MY'): number {
    const cleaned = priceText.replace(/[^\d.,]/g, '').replace(/,/g, '')
    const price = parseFloat(cleaned)
    return isNaN(price) ? 0 : price
  }
}

/**
 * Hyundai/Kia Options Scraper
 */
class HyundaiKiaOptionsScraper implements OptionsScraper {
  async scrapeOptions(vehicleName: string, modelTrim: string, country: 'SG' | 'MY'): Promise<ScrapedOptions[]> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      // Determine manufacturer and model
      const isHyundai = vehicleName.toLowerCase().includes('hyundai') || vehicleName.toLowerCase().includes('ioniq')
      const isKia = vehicleName.toLowerCase().includes('kia') || vehicleName.toLowerCase().includes('ev6')

      let baseUrl = ''
      let model = ''

      if (isHyundai) {
        baseUrl = country === 'SG' ? 'https://www.hyundai.com.sg' : 'https://www.hyundai.com.my'
        if (vehicleName.toLowerCase().includes('ioniq 5')) model = 'ioniq-5'
        else if (vehicleName.toLowerCase().includes('ioniq 6')) model = 'ioniq-6'
      } else if (isKia) {
        baseUrl = country === 'SG' ? 'https://www.kia.com.sg' : 'https://www.kia.com.my'
        if (vehicleName.toLowerCase().includes('ev6')) model = 'ev6'
      }

      if (!baseUrl || !model) return []

      const url = `${baseUrl}/${model}`

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
      await page.waitForTimeout(3000)

      const content = await page.content()
      const $ = cheerio.load(content)

      const options: ScrapedOptions[] = []

      // Look for option/packages
      $('[class*="option"], [class*="package"], [class*="accessory"]').each((_, el) => {
        const text = $(el).find('h3, h4, [class*="name"]').text().trim()
        const priceText = $(el).find('[class*="price"]').text().trim()

        if (text && priceText) {
          const price = this.parsePrice(priceText, country)
          if (price > 0) {
            options.push({
              name: text,
              price,
              currency: country === 'SG' ? 'SGD' : 'MYR',
            })
          }
        }
      })

      await browser.close()
      return options
    } catch (error) {
      console.error(`Error scraping Hyundai/Kia options for ${vehicleName}:`, error)
      return []
    }
  }

  private parsePrice(priceText: string, country: 'SG' | 'MY'): number {
    const cleaned = priceText.replace(/[^\d.,]/g, '').replace(/,/g, '')
    const price = parseFloat(cleaned)
    return isNaN(price) ? 0 : price
  }
}

/**
 * Main function to scrape options for a vehicle
 * Automatically selects the appropriate scraper based on vehicle name
 */
export async function scrapeVehicleOptions(
  vehicleName: string,
  modelTrim: string,
  country: 'SG' | 'MY'
): Promise<OptionPrice[]> {
  // Rate limiting: wait between requests
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const nameLower = vehicleName.toLowerCase()

  let scraper: OptionsScraper | null = null

  if (nameLower.includes('tesla')) {
    scraper = new TeslaOptionsScraper()
  } else if (nameLower.includes('byd')) {
    scraper = new BYDOptionsScraper()
  } else if (nameLower.includes('hyundai') || nameLower.includes('ioniq') || nameLower.includes('kia') || nameLower.includes('ev6')) {
    scraper = new HyundaiKiaOptionsScraper()
  }

  if (!scraper) {
    console.log(`No scraper available for ${vehicleName}`)
    return []
  }

  try {
    const scrapedOptions = await scraper.scrapeOptions(vehicleName, modelTrim, country)
    
    // Convert to OptionPrice format
    return scrapedOptions.map((opt) => ({
      name: opt.name,
      price: opt.price,
    }))
  } catch (error) {
    console.error(`Error scraping options for ${vehicleName}:`, error)
    return []
  }
}

/**
 * Batch scrape options for multiple vehicles
 * Includes rate limiting and error handling
 */
export async function scrapeOptionsForVehicles(
  vehicles: Array<{ name: string; modelTrim: string; country: 'SG' | 'MY' }>
): Promise<Map<string, OptionPrice[]>> {
  const results = new Map<string, OptionPrice[]>()

  for (const vehicle of vehicles) {
    try {
      const options = await scrapeVehicleOptions(vehicle.name, vehicle.modelTrim, vehicle.country)
      const key = `${vehicle.name}-${vehicle.modelTrim}-${vehicle.country}`
      results.set(key, options)
      
      // Rate limiting: wait 3 seconds between vehicles
      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (error) {
      console.error(`Error scraping options for ${vehicle.name}:`, error)
      results.set(`${vehicle.name}-${vehicle.modelTrim}-${vehicle.country}`, [])
    }
  }

  return results
}

