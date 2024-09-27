import { auth } from "@/lib/auth";
import cryptoJS from 'crypto-js';

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  try { 
    const { rrr } = await req.json();
    const merchantId = process.env.REMITA_MERCHANT_ID || '2547916';
    const apiKey = process.env.REMITA_API_KEY || '1946';
    const baseUrl = process.env.REMITA_BASE_URL || 'https://demo.remita.net';

    // create API hash
    const apiHash = cryptoJS.SHA512(merchantId + rrr + apiKey).toString();

    // Call Remita API to check payment status
    const remitaResponse = await fetch(
      `${baseUrl}/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${rrr}/${apiHash}/status.reg`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`,
      },
    });
    if (!remitaResponse.ok) {
      throw new Error('Failed to check payment status')
    } 
    const remitaData = await remitaResponse.json();
    return Response.json(JSON.stringify({remitaData}),{status: 200});
  } catch (error: any) { 
    return Response.json({ message: error.message }, { status: 400 });
  }
 }) as any;