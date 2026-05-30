import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import { NextRequest } from "next/server";

// One-time endpoint: sets isAdmin=true for the given email.
// Protected by a secret token — call it like:
//   GET /api/admin/restore-admin?email=you@example.com&secret=YOUR_SECRET
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email  = searchParams.get("email");
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.ADMIN_RESTORE_SECRET || "agu-admin-restore-2024";

  if (secret !== expectedSecret) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!email) {
    return Response.json({ message: "email param required" }, { status: 400 });
  }

  await dbConnect();

  const user = await UserModel.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );

  if (!user) {
    return Response.json({ message: `No user found with email: ${email}` }, { status: 404 });
  }

  return Response.json({
    message: "Admin restored successfully",
    user: { _id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
  });
}
