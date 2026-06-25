import { test, expect } from '@playwright/test'

/**
 * Critical flow: search → compare → export.
 *
 * A user lands on /ev, picks a country, searches for vehicles, adds them to the
 * comparison, then exports the comparison as CSV. This is the core value path of
 * the EV section, so it gets end-to-end coverage.
 */
test.describe('EV compare', () => {
  test('search → compare → export CSV', async ({ page }) => {
    await page.goto('/ev')

    // 1. Select a country. CountrySelector is a Radix Select (custom listbox),
    //    not a native <select>, so open the trigger then click the option.
    await page.getByLabel('Select country').click()
    await page.getByRole('option', { name: /Singapore/ }).click()

    // Vehicles load client-side from the Prisma-backed API once a country is set.
    await page.waitForResponse(
      (res) => res.url().includes('/api/vehicles') && res.ok()
    )

    const search = page.getByLabel('Search for electric vehicles')
    await expect(search).toBeEnabled()

    // 2. Search for the first vehicle and add it from the suggestions list.
    await search.fill('Tesla')
    const firstSuggestion = page.getByRole('option').first()
    await expect(firstSuggestion).toBeVisible()
    await firstSuggestion.click()

    // 3. Search for a second vehicle so the comparison has two rows.
    await search.fill('BYD')
    const secondSuggestion = page.getByRole('option').first()
    await expect(secondSuggestion).toBeVisible()
    await secondSuggestion.click()

    // The comparison table (with the export action) only renders once at least
    // one vehicle is selected.
    const exportButton = page.getByRole('button', { name: 'Export CSV' })
    await expect(exportButton).toBeVisible()

    // 4. Export — assert a CSV download is triggered with the expected filename.
    const downloadPromise = page.waitForEvent('download')
    await exportButton.click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/^ev-comparison-.*\.csv$/)
  })
})
