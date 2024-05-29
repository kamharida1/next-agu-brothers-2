import React from 'react'
import toast from 'react-hot-toast'

interface MonnifyButtonProps { 
  orderId: string
}

const MonnifyButton: React.FC<MonnifyButtonProps> = ({ orderId }) => {
  const createMonnifyOrder = async () => {
    return fetch(`/api/orders/${orderId}/create-monnify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const { checkoutUrl } = data.responseBody
          toast.success(`Redirecting to payment`)
          const newWindow = window.open(checkoutUrl, '_blank')
          if (newWindow) {
            newWindow.focus();
          } else {
            toast.error('Failed to open payment window')
          }
          return
        })
      } else {
        return response.json().then((data) => {
          toast.error(data.message)
         })
      }
    })
  }

  return (
    <button type='button' onClick={createMonnifyOrder} className='btn btn-primary'>
      Pay with Monnify
    </button>
  )
}

export default MonnifyButton