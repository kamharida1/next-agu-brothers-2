'use client'
import { useState } from 'react'
import useSWR from 'swr'

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  phone: string;
}

export default function Messages() {
  const { data: messages, error, isLoading, mutate } = useSWR<Message[]>(`/api/admin/messages`)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  if (error)
    return <div className="alert alert-error">Failed to load messages</div>
  if (isLoading)
    return <div>Loading messages...</div>
  

    const openModal = async (message: any) => {
      if (!message.read) {
        try {
          await fetch('/api/admin/messages/markAsRead', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: message._id }),
          })

          message.read = true
          if (messages) {
            mutate([...messages]) 
          }
        } catch (error) {
          console.error('Failed to mark message as read:', error)
        }
      }

      setSelectedMessage(message)
    }

  const closeModal = () => {
    setSelectedMessage(null)
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center mb-8">Messages</h1>

      {messages?.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <span>No messages yet</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages?.map((message: any) => (
            <div
              key={message._id}
              className="card bg-base-100 shadow-xl cursor-pointer"
              onClick={() => openModal(message)}
            >
              <div className="card-body">
                <h2 className="card-title">{message.name}</h2>
                {!message.read && (
                  <span className="badge badge-info ml-2">Unread</span>
                )}
                <p>{message.email}</p>
                <p>{message.message.substring(0, 50)}...</p>{' '}
                <p className="text-slate-700">{message.phone}</p>
               
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedMessage && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-2xl font-bold mb-4">{selectedMessage.name}</h2>
            <p>
              <strong>Email:</strong> {selectedMessage.email}
            </p>
            <p>
              <strong>Message:</strong> {selectedMessage.message}
            </p>
            <p>
              <strong>Phone:</strong> {selectedMessage.phone}
            </p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
