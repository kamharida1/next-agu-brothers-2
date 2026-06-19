import dbConnect from '@/lib/dbConnect'
import SiteSettingsModel, {
  type SiteSettings,
} from '@/lib/models/SiteSettingsModel'

const SITE_SETTINGS_ID = 'site'

export async function getSiteSettings(): Promise<SiteSettings> {
  await dbConnect()
  const doc = await SiteSettingsModel.findById(SITE_SETTINGS_ID)
    .lean<SiteSettings>()
    .exec()
  if (doc) {
    return {
      _id: String(doc._id),
      autoCategoryBlogEnabled: doc.autoCategoryBlogEnabled ?? true,
    }
  }
  return {
    _id: SITE_SETTINGS_ID,
    autoCategoryBlogEnabled: true,
  }
}

export async function isAutoCategoryBlogEnabled(): Promise<boolean> {
  const settings = await getSiteSettings()
  return settings.autoCategoryBlogEnabled
}

export async function setAutoCategoryBlogEnabled(
  enabled: boolean
): Promise<SiteSettings> {
  await dbConnect()
  const doc = await SiteSettingsModel.findByIdAndUpdate(
    SITE_SETTINGS_ID,
    { autoCategoryBlogEnabled: enabled },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .lean<SiteSettings>()
    .exec()

  if (!doc) {
    throw new Error('Failed to save site settings')
  }

  return {
    _id: String(doc._id),
    autoCategoryBlogEnabled: doc.autoCategoryBlogEnabled,
  }
}
