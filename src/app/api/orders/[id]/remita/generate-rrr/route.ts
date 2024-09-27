import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import cryptoJS from 'crypto-js';
import axios from 'axios';


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

  const demoUrl = "demo.remita.net";
  const genRRRUrlPath = "/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit";

  const merchantId = process.env.REMITA_MERCHANT_ID || '2547916'
  const serviceTypeId = process.env.REMITA_SERVICE_TYPE_ID || '4430731'
  const apiKey = process.env.REMITA_API_KEY || '1946'

  const order = await OrderModel.findById(params.id)
  if (order) {
    const {
      shippingAddress: { fullName, email, phone },
      totalPrice,
    } = order

    // Encryption using SHA512
    const apiHash = cryptoJS.SHA512(merchantId + serviceTypeId + order._id.toString() + totalPrice + apiKey).toString();
    // Body data for the POST request
    const requestData ={
      serviceTypeId,
      amount: totalPrice,
      orderId: order._id.toString(),
      payerName: fullName,
      payerEmail: email,
      payerPhone: phone,
      description: "Order Payment",
    };
    // HTTPS request options
    const requestOptions = {
      host: demoUrl,
      path: genRRRUrlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`,
      },
    };
     try {
       const result = await axios.post<{ data: string }>(`https://${demoUrl}${genRRRUrlPath}`,
        requestData,
        requestOptions
       )
       console.log(result)

        const jsonResponse = (typeof result.data === 'string' ? result.data : JSON.stringify(result.data)).replace('jsonp (', '').slice(0, -1);
       const invoiceData = JSON.parse(jsonResponse);
       
       if (invoiceData.status ===  "Payment Reference generated") {
         return Response.json({ rrr: invoiceData.RRR, status: 200 });
       } else {
         return Response.json({
           message: 'Error generating RRR',
           details: invoiceData, status: 400
         });
       }
     } catch (error: any) { 
         return Response.json({ message: error.message }, { status: 500 });
     }
  }
 }) as any

// export const POST = auth(async (...request: any) => {
//   const [req, { params }] = request
//   if (!req.auth) {
//     return Response.json(
//       { message: 'unauthorized' },
//       {
//         status: 401,
//       }
//     )
//   } 
//   await dbConnect()

//   const demoUrl = "demo.remita.net";
//   const genRRRUrlPath = "/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit";

//   const merchantId = process.env.REMITA_MERCHANT_ID || '2547916'
//   const serviceTypeId = process.env.REMITA_SERVICE_TYPE_ID || '4430731'
//   const apiKey = process.env.REMITA_API_KEY || '1946'

//   const order = await OrderModel.findById(params.id)
//   if (order) {
//     const {
//         shippingAddress: { fullName, email, phone },
//         totalPrice,
//       } = order

//     // Encryption using SHA512
//       const apiHash = cryptoJS.SHA512(merchantId + serviceTypeId + order._id.toString() + totalPrice + apiKey).toString();
//        // Body data for the POST request
//       const requestData = JSON.stringify({
//           'serviceTypeId': serviceTypeId,
//           'amount': totalPrice,
//           'orderId': order._id.toString(),
//           'payerName': fullName,
//           'payerEmail': email,
//           'payerPhone': phone,
//           'description': "Order Payment",
//       });
//     // HTTPS request options
//     const requestOptions = {
//       hostname: demoUrl,
//       path: genRRRUrlPath,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`,
//       },
//     };
//     // Make the request using Node's https module
//     const resultData = await new Promise((resolve, reject) => { 
//       const req = https.request(requestOptions, (response) => { 
//         let responseData = '';

//         //Handle response data chunks
//         response.on('data', (chunk) => {
//           responseData += chunk;
//         });

//         //Handle response end of the response
//         response.on('end', () => {
//           // Extract relevant part of the response
//           const processResponse = responseData.slice(7, 87);
//           resolve(processResponse);
//         })
//       })

//       // Handle request errors
//       req.on('error', (error) => {
//         reject(error);
//       });

//       //Write the data to the request
//       req.write(requestData);
//       req.end();
//     });

//     try {
//       const result = await resultData;
//       // Send the response back as JSON
//       console.log(result)
//       return Response.json({ message: 'RRR generated successfully', result, status: 200 });
//     } catch (err: any) {
//       return Response.json({ message: 'Error generating RRR', error: err.message, status: 500 });
//     }
//   } else {
//     return Response.json(
//       { message: 'Order not found' },
//       {
//         status: 404,
//       }
//     )
//   }
// }) as any