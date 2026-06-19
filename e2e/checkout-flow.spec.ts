import { test, expect, type Page } from '@playwright/test'

const TEST_PASSWORD = '123456'

function testUser() {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return {
    name: 'Checkout Test User',
    email: `checkout.test.${stamp}@example.com`,
    password: TEST_PASSWORD,
  }
}

function shippingFor(email: string) {
  return {
    fullName: 'Checkout Test User',
    phone: '+234 800 123 4567',
    address: '12 Test Street, Independence Layout',
    email,
    city: 'Independence Layout',
    postalCode: '400001',
  }
}

async function registerAndSignIn(page: Page) {
  const user = testUser()
  const registerRes = await page.request.post('/api/auth/register', {
    data: { name: user.name, email: user.email, password: user.password },
  })
  expect(registerRes.status(), await registerRes.text()).toBe(201)

  await page.goto('/signin')
  await page.getByLabel('Email').fill(user.email)
  await page.getByLabel('Password').fill(user.password)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForURL((url) => !url.pathname.includes('/signin'), { timeout: 15000 })
  return user
}

async function addFirstProductToCart(page: Page) {
  await page.goto('/all-products')
  const links = page.locator('a[href^="/product/"]')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)

  for (let i = 0; i < Math.min(count, 12); i++) {
    const href = await links.nth(i).getAttribute('href')
    if (!href) continue
    await page.goto(href)
    const addBtn = page.getByRole('button', { name: /^add to cart$/i })
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click()
      return
    }
  }

  throw new Error('No in-stock product found to add to cart')
}

async function fillShipping(page: Page, email: string) {
  const shipping = shippingFor(email)
  await page.goto('/shipping')
  await page.getByLabel(/full name/i).fill(shipping.fullName)
  await page.getByLabel(/mobile number/i).fill(shipping.phone)
  await page.getByLabel(/^address$/i).fill(shipping.address)
  await page.getByLabel(/email address/i).fill(shipping.email)
  await page.locator('#city').selectOption(shipping.city)
  await page.getByLabel(/postal code/i).fill(shipping.postalCode)
  await page.getByRole('button', { name: /use this address/i }).click()
  await expect(page).toHaveURL(/\/payment/, { timeout: 15000 })
}

async function selectPayment(page: Page, method: 'Paystack' | 'Cash On Delivery') {
  const label = method === 'Paystack' ? 'Pay Online' : 'Cash on Delivery'
  await page.getByText(label, { exact: false }).click()
  await page.getByRole('button', { name: /continue to review order/i }).click()
  await expect(page).toHaveURL(/\/place-order/, { timeout: 15000 })
}

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('COD: full checkout places order and shows confirmation', async ({ page }) => {
    test.setTimeout(60_000)
    const user = await registerAndSignIn(page)
    await addFirstProductToCart(page)

    await page.goto('/cart')
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    await expect(page).toHaveURL(/\/shipping/)

    await fillShipping(page, user.email)
    await selectPayment(page, 'Cash On Delivery')

    await expect(page.getByRole('heading', { name: /review your order/i })).toBeVisible()
    await expect(page.getByText(/cash on delivery/i)).toBeVisible()

    const orderResponse = page.waitForResponse(
      (res) => res.url().includes('/api/orders') && res.request().method() === 'POST'
    )
    await page.getByRole('button', { name: /place your order/i }).first().click()

    const res = await orderResponse
    const body = await res.json()
    expect(res.status(), body.message || '').toBe(201)

    await expect(page).toHaveURL(/\/order\//, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /order details/i })).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByText('Order placed', { exact: true })).toBeVisible()
  })

  test('Paystack: review page renders pay button', async ({ page }) => {
    test.setTimeout(60_000)
    const user = await registerAndSignIn(page)
    await addFirstProductToCart(page)

    await page.goto('/cart')
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    await fillShipping(page, user.email)
    await selectPayment(page, 'Paystack')

    await expect(page.getByRole('heading', { name: /review your order/i })).toBeVisible()
    await expect(page.getByText(/pay online/i)).toBeVisible()

    const payBtn = page.getByRole('button', { name: /pay .* with paystack/i }).first()
    const unavailable = page.getByText(/temporarily unavailable/i)
    await expect(payBtn.or(unavailable)).toBeVisible({ timeout: 10000 })
  })
})
