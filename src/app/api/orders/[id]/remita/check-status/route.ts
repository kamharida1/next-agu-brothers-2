import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import cryptoJS from 'crypto-js';
import https from 'https';


export const POST = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  
  try { 
    const { rrr } = await req.json();
    const merchantId = process.env.REMITA_MERCHANT_ID || '2547916'
    const apiKey = process.env.REMITA_API_KEY || '1946'

    // Encryption using SHA512
    const apiHash = cryptoJS.SHA512(rrr + apiKey + merchantId).toString();

    // Prepare the request options
    const options = {
      host: 'demo.remita.net',
      path: `/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${rrr}/${apiHash}/status.reg`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`,
      },
    };

    // Make the request to the Remita API
    const response = await new Promise((resolve, reject) => { 
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    });
    // Return the response back to the frontend
    return new Response(JSON.stringify({
      success: true,
      data: JSON.parse(response as string),
    }), {
      status: 200
    })
  } catch (e: any) { 
    console.error(e)
    return new Response(JSON.stringify({
      success: false,
      error: e.message,
    }), {
      status: 500
    });
  }
 }) as any

