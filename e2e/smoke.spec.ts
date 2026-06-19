import { test, expect } from '@playwright/test'

test.describe('Storefront smoke', () => {
  test('homepage loads with branding and products', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Agu Brothers/i)
    await expect(page.getByRole('link', { name: /brothers/i }).first()).toBeVisible()
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible()
  })

  test('search page loads with filters', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByRole('heading', { name: /customer review/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /any price/i })).toBeVisible()
    await expect(page.getByText(/sort by/i)).toBeVisible()
  })

  test('all-products catalog loads with pagination UI', async ({ page }) => {
    await page.goto('/all-products')
    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible()
    const results = page.getByText(/\d+-\d+ of \d+|0 results/)
    await expect(results).toBeVisible()
  })

  test('product detail page loads', async ({ page }) => {
    await page.goto('/all-products')
    const links = page.locator('a[href^="/product/"]')
    await expect(links.first()).toBeVisible()

    const count = await links.count()
    let found = false
    for (let i = 0; i < Math.min(count, 12); i++) {
      const href = await links.nth(i).getAttribute('href')
      if (!href) continue
      await page.goto(href)
      const addBtn = page.getByRole('button', { name: /^add to cart$/i })
      if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        found = true
        break
      }
    }

    expect(found).toBe(true)
    await expect(page).toHaveURL(/\/product\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('related products section on product page', async ({ page }) => {
    await page.goto('/all-products')
    const href = await page.locator('a[href^="/product/"]').first().getAttribute('href')
    await page.goto(href!)
    await expect(page.getByRole('heading', { name: /related products/i })).toBeVisible()
  })

  test('empty cart page', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByText(/shopping cart is empty/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /continue shopping/i })).toBeVisible()
  })

  test('price filter on search narrows results', async ({ page }) => {
    await page.goto('/search')
    await page.getByRole('link', { name: /under ₦150,000/i }).click()
    await expect(page).toHaveURL(/price=0-150000/)
    await expect(
      page.getByRole('link', { name: /under ₦150,000/i }).first()
    ).toBeVisible()
  })
})
