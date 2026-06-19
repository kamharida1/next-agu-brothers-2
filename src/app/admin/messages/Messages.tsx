'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { AdminLoading } from '@/components/admin/AdminUI'
import { FiMail, FiX } from 'react-icons/fi'

interface Message {
  _id: string
  name: string
  email: string
  message: string
  phone: string
  read?: boolean
}

export default function Messages() {
  const { data: messages, error, isLoading, mutate } = useSWR<Message[]>(`/api/admin/messages`)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const openModal = async (message: Message) => {
    if (!message.read) {
      try {
        await fetch('/api/admin/messages/markAsRead', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: message._id }),
        })
        message.read = true
        if (messages) mutate([...messages])
      } catch (err) {
        console.error('Failed to mark message as read:', err)
      }
    }
    setSelectedMessage(message)
  }

  if (error) {
    return (
      <div className="admin-panel p-4 text-sm text-[#B12704] bg-[#FFF4F4]">
        Failed to load messages
      </div>
    )
  }
  if (isLoading) return <AdminLoading />

  return (
    <div className="space-y-5">
      <div className="admin-panel p-4 flex items-center gap-3">
        <FiMail className="w-5 h-5 text-[#007185]" />
        <p className="text-sm text-[#565959]">
          <span className="font-bold text-[#0F1111]">{messages?.length ?? 0}</span> contact
          message{(messages?.length ?? 0) === 1 ? '' : 's'}
        </p>
      </div>

      {messages?.length === 0 ? (
        <div className="admin-panel p-12 text-center text-[#565959] text-sm">
          No messages yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages?.map((message) => (
            <button
              key={message._id}
              type="button"
              onClick={() => openModal(message)}
              className="admin-panel p-4 text-left hover:border-[#AAAAAA] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-bold text-[#0F1111]">{message.name}</h2>
                {!message.read && (
                  <span className="bg-[#FF9900] text-[#0F1111] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-[#007185] truncate">{message.email}</p>
              <p className="text-sm text-[#565959] mt-2 line-clamp-2">{message.message}</p>
              {message.phone && (
                <p className="text-xs text-[#565959] mt-2">{message.phone}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="admin-panel max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0F1111]">{selectedMessage.name}</h2>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 hover:bg-[#EAEDED] rounded"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[#565959] font-medium">Email</dt>
                <dd className="text-[#007185]">{selectedMessage.email}</dd>
              </div>
              {selectedMessage.phone && (
                <div>
                  <dt className="text-[#565959] font-medium">Phone</dt>
                  <dd>{selectedMessage.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-[#565959] font-medium">Message</dt>
                <dd className="text-[#0F1111] leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setSelectedMessage(null)}
              className="btn-amazon w-full mt-6 py-2 rounded-md text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
