import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ContactModel from "@/lib/models/ContactModel";

export const PUT = auth(async (...p: any) => {
  const [req] = p
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const { id } = await req.json()

  await dbConnect()
  const contact = await ContactModel.updateOne(
    {_id: id},
    { $set: { read: true } }
  )

  if (!contact) {
    return Response.json(
      { message: 'Contact not found' },
      {
        status: 404,
      }
    )
  }

  return Response.json(contact)
 }) as any