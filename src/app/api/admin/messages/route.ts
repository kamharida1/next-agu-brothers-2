import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ContactModel from "@/lib/models/ContactModel"

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const messages = await ContactModel.find()
  return Response.json(messages)
}) as any