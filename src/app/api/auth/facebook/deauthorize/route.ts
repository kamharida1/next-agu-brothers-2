// app/api/deletion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export async function POST(req: NextRequest) {
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const signedRequest = req.nextUrl.searchParams.get('signed_request');

  if (!signedRequest || !appSecret) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const [encodedSig, encodedPayload] = signedRequest.split('.');

  // Decode the payload to extract user information
  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'));
  const userId = payload.user_id;

  // Verify the signature of the request
  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(encodedPayload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (encodedSig !== expectedSig) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  await dbConnect(); // Ensure database connection

  // Find and mark the user for deletion, or perform any cleanup as required
  const user = await UserModel.findOne({ facebookId: userId });
  if (user) {
    // Optionally mark the user as deactivated instead of fully deleting
    user.isAuthorized = false; // Indicate user deauthorization
    await user.save();
  }

  // Generate a unique confirmation code and status URL for tracking
  const confirmationCode = crypto.randomBytes(16).toString('hex');
  const statusUrl = `https://www.<your_website>.com/deletion?id=${confirmationCode}`;

  // Respond with the confirmation and status tracking information
  return NextResponse.json({
    url: statusUrl,
    confirmation_code: confirmationCode,
  });
}
