import React, { useEffect } from 'react'

const MonnifyButton = () => {
  useEffect(() => {
    // Dynamically add Monnify SDK script to the document
    const script = document.createElement('script')
    script.src = 'https://sdk.monnify.com/plugin/monnify.js'
    script.async = true
    document.body.appendChild(script)

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const payWithMonnify = () => {
    if (typeof (window as any).MonnifySDK === 'undefined') {
      console.error('Monnify SDK not loaded')
      return
    }

    (window as any).MonnifySDK.initialize({
      amount: 100,
      currency: 'NGN',
      reference: new String(new Date().getTime()),
      customerFullName: 'Damilare Ogunnaike',
      customerEmail: 'ogunnaike.damilare@gmail.com',
      apiKey: 'MK_PROD_FLX4P92EDF', // Replace with your actual API key
      contractCode: '626609763141', // Replace with your actual contract code
      paymentDescription: 'Lahray World',
      metadata: {
        name: 'Damilare',
        age: 45,
      },
      incomeSplitConfig: [
        {
          subAccountCode: 'MFY_SUB_342113621921',
          feePercentage: 50,
          splitAmount: 1900,
          feeBearer: true,
        },
        {
          subAccountCode: 'MFY_SUB_342113621922',
          feePercentage: 50,
          splitAmount: 2100,
          feeBearer: true,
        },
      ],
      onLoadStart: () => {
        console.log('loading has started')
      },
      onLoadComplete: () => {
        console.log('SDK is UP')
      },
      onComplete: (response: any) => {
        // Implement what happens when the transaction is completed.
        console.log(response)
      },
      onClose: (data: any) => {
        // Implement what should happen when the modal is closed here.
        console.log(data)
      },
    })
  }

  return (
    <div>
      <button type="button" onClick={payWithMonnify}>
        Pay With Monnify
      </button>
    </div>
  )
}

export default MonnifyButton
