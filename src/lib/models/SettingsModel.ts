import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
 name: {type:String, required: true, unique: true},
 value: {type:Number},
},
  { timestamps: true }
)

const SettingsModel =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema)
export default SettingsModel

export type Settings = {
  _id: string
  name: string
  value: number
}
