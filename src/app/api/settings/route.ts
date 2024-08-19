import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import SettingsModel from "@/lib/models/SettingsModel"

export const GET = auth(async (req: any) => {
  await dbConnect()
  const settings = await SettingsModel.find({})
  return Response.json(settings)
}) as any

export const PUT = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const { name, value } = await req.json()
  const settings = await SettingsModel.findOneAndUpdate({ name }, { value }, { new: true, upsert: true }).lean()
  return Response.json(settings)
}) as any