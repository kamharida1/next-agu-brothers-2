import mongoose from 'mongoose'

const SiteSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'site' },
  autoCategoryBlogEnabled: { type: Boolean, default: true },
})

const SiteSettingsModel =
  mongoose.models.SiteSettings ||
  mongoose.model('SiteSettings', SiteSettingsSchema)

export default SiteSettingsModel

export type SiteSettings = {
  _id: string
  autoCategoryBlogEnabled: boolean
}
