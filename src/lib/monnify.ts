const base = process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com'

   export const monnify = {
     initialiseTransaction: async function initialiseTransaction(
       totalAmount: number,
       customerName: string,
       customerEmail: string,
       paymentDescription: string 
     ) {
       const {
         MONNIFY_CONTRACT_CODE,
         MONNIFY_CARD_PAYMENT_METHOD, MONNIFY_ACCOUNT_TRANSFER_PAYMENT_METHOD,
         REDIRECT_URL
       } = process.env
       const accessToken = await generateAccessToken()
       const url = `${base}/api/v1/merchant/transactions/init-transaction`
       const response = await fetch(url, {
         method: 'post',
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${accessToken}`,
         },
         body: JSON.stringify({
           amount: totalAmount,
           customerName,
           customerEmail,
           paymentDescription,
           paymentReference: Date.now().toString(),
           currencyCode: 'NGN',  
           contractCode: MONNIFY_CONTRACT_CODE,
           redirectUrl: REDIRECT_URL,
           paymentMethods: [
             MONNIFY_CARD_PAYMENT_METHOD, MONNIFY_ACCOUNT_TRANSFER_PAYMENT_METHOD
           ]
         }),
       })
       return handleResponse(response)
     },
   }

   async function generateAccessToken() {
     const { MONNIFY_API_KEY, MONNIFY_SECRET_KEY } = process.env
     const auth = Buffer.from(
       MONNIFY_API_KEY + ':' + MONNIFY_SECRET_KEY
     ).toString('base64')
     const response = await fetch(`${base}/api/v1/auth/login`, {
       method: 'post',
       body: '',
       headers: {
         Authorization: `Basic ${auth}`,
       },
     })

     const jsonData = await handleResponse(response)
     return jsonData.access_token
   }

   async function handleResponse(response: any) {
     if (response.status === 200 || response.status === 201) {
       return response.json()
     }

     const errorMessage = await response.text()
     throw new Error(errorMessage)
   }