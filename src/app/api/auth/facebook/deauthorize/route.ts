// app/api/deauthorize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import crypto from 'crypto';

export const POST = async (req: NextRequest) => {
  const appSecret = process.env.FACEBOOK_CLIENT_SECRET; // Ensure this is set in your environment variables
  const signedRequest = req.nextUrl.searchParams.get('signed_request');

  if (!signedRequest || !appSecret) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // Split signedRequest into signature and payload
  const [encodedSignature, encodedPayload] = signedRequest.split('.');

  // Decode payload to extract user_id
  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'));

  // Verify the signature
  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(encodedPayload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  if (encodedSignature !== expectedSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  // Extract the user_id from the payload
  const userId = payload.user_id;

  await dbConnect(); // Ensure database connection

  try {
    const user = await UserModel.findOne({ facebookId: userId });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Mark the user as deauthorized
    user.isAuthorized = false;
    await user.save();

    return NextResponse.json({ message: 'User has been deauthorized' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
