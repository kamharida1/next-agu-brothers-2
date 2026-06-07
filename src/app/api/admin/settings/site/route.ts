import { auth } from '@/lib/auth'
import {
  getSiteSettings,
  setAutoCategoryBlogEnabled,
} from '@/lib/services/siteSettingsService'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await getSiteSettings()
    return Response.json(settings)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to load settings'
    return Response.json({ message }, { status: 500 })
  }
}) as any

export const PUT = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { autoCategoryBlogEnabled } = await req.json()
    if (typeof autoCategoryBlogEnabled !== 'boolean') {
      return Response.json(
        { message: 'autoCategoryBlogEnabled must be a boolean' },
        { status: 400 }
      )
    }

    const settings = await setAutoCategoryBlogEnabled(autoCategoryBlogEnabled)
    return Response.json(settings)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save settings'
    return Response.json({ message }, { status: 500 })
  }
}) as any
