import dbConnect from "@/lib/dbConnect";
import ContactModel from "@/lib/models/ContactModel";

export const POST = async (req: any) => { 
  await dbConnect();
  const { name, email, phone, message } = await req.json();
  if (!name || !email || !message) {
    return Response.json(
      { message: 'Please fill in all required fields' },
      {
        status: 400,
      }
    );
  }
  const contact = await ContactModel.create({
    name,
    email,
    phone,
    message,
    read: false
  });
  await contact.save();
  return Response.json(contact);

}