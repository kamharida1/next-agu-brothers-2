
const base = process.env.REMITA_BASE_URL || 'https://demo.remita.net/remita/exapp/api/v1/send/api'

export const remita = {
  captureWebhook: async function captureWebhook(transactionId: string) { 
    const access_token = await generateAccessToken();
    const url = `https://demo.remita.net/payment/v1/payment/query/${transactionId}`;

    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },  
    });
    return handleResponse(response);
  }
}  

async function generateAccessToken() {
    const { REMITA_MERCHANT_ID, REMITA_SECRET } = process.env;
    const auth = Buffer.from(REMITA_MERCHANT_ID + ':' + REMITA_SECRET).toString('base64');
    const response = await fetch(`${base}/uaasvc/uaa/token`, {
        method: 'post',
        body: JSON.stringify({
          username: "NO55JXXMVGFKAADF",
          password: "5QX62KY4KHLG3FD4V6GKE6MPKH8C8EAS"
        }),
        headers: {
          Authorization: `Basic ${auth}`
        },
        redirect: 'follow'
    });
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

async function handleResponse(response: any) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }
    return Promise.reject(response.statusText);
}