import { test, expect } from '@playwright/test'

test.describe('Auth callbackUrl', () => {
  test('middleware sends protected routes to sign-in with callbackUrl', async ({ page }) => {
    await page.goto('/shipping')
    await page.waitForURL(/\/signin/)

    const url = new URL(page.url())
    const callback = url.searchParams.get('callbackUrl') ?? ''
    expect(callback).toMatch(/\/shipping$/)
  })

  test('bare /signin restores callbackUrl from Auth.js cookie after Google initiation', async ({
    page,
  }) => {
    await page.goto('/payment')
    await page.waitForURL(/\/signin/)
    expect(new URL(page.url()).searchParams.get('callbackUrl')).toMatch(/\/payment$/)

    const googlePost = page.waitForRequest(
      (req) => req.method() === 'POST' && req.url().includes('/api/auth/signin/google')
    )
    await page.getByRole('button', { name: /continue with google/i }).click()
    const req = await googlePost
    expect(req.postData() ?? '').toContain('callbackUrl')

    await page.goto('/signin')
    await page.waitForURL(/callbackUrl=/)
    expect(new URL(page.url()).searchParams.get('callbackUrl')).toMatch(/\/payment$/)
  })

  test('Google sign-in POST includes shipping callbackUrl from checkout redirect', async ({
    page,
  }) => {
    await page.goto('/place-order')
    await page.waitForURL(/\/signin/)

    const callback = new URL(page.url()).searchParams.get('callbackUrl') ?? ''
    expect(callback).toMatch(/\/place-order$/)

    const googlePost = page.waitForRequest(
      (req) => req.method() === 'POST' && req.url().includes('/api/auth/signin/google')
    )
    await page.getByRole('button', { name: /continue with google/i }).click()
    const body = (await googlePost).postData() ?? ''
    expect(decodeURIComponent(body)).toMatch(/place-order/)
  })

  test('register link preserves encoded callbackUrl', async ({ page }) => {
    await page.goto('/shipping')
    await page.waitForURL(/\/signin/)

    const registerHref = await page.getByRole('link', {
      name: /create your agu brothers account/i,
    }).getAttribute('href')

    expect(registerHref).toContain('callbackUrl=')
    expect(registerHref).toMatch(/shipping/)
  })
})
