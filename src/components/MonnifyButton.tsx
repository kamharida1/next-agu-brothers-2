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
    }).then((response: any) => {
      if (response.status === 200) {
        response.json().then((data: any) => { 
          data
        })
      }
      return toast.error('Failed to receive checkout url')
    })
  }

  return (
    <button type='button' onClick={createMonnifyOrder} className='btn btn-primary'>
      Pay with Monnify
    </button>
  )
}

export default MonnifyButton