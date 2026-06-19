'use client'

import { User } from '@/lib/models/UserModel'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  FiEdit2, FiTrash2, FiAlertCircle, FiSearch,
  FiCheckCircle, FiXCircle, FiShield, FiUsers,
} from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function Users() {
  const { data: users, error, mutate } = useSWR('/api/admin/users')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  useEffect(() => {
    const h = setTimeout(() => setDebouncedTerm(searchTerm), 300)
    return () => clearTimeout(h)
  }, [searchTerm])

  const { trigger: deleteUser } = useSWRMutation(
    '/api/admin/users',
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading('Deleting user...')
      const res = await fetch(`${url}/${arg.userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('User deleted', { id: toastId })
        mutate()
      } else {
        toast.error(data.message, { id: toastId })
      }
    }
  )

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Delete user "${userName}"? This cannot be undone.`)) {
      deleteUser({ userId })
    }
  }

  if (error) return (
    <div className="admin-panel p-4 text-sm text-[#B12704] bg-[#FFF4F4] flex gap-2">
      <FiAlertCircle className="w-5 h-5 shrink-0" />
      <span>Failed to load users: {error.message}</span>
    </div>
  )

  if (!users) return (
    <div className="flex items-center justify-center py-16">
      <span className="loading loading-spinner loading-lg text-[#FF9900]" />
    </div>
  )

  const filtered = debouncedTerm
    ? users.filter((u: User) =>
        u.name?.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(debouncedTerm.toLowerCase())
      )
    : users

  const admins = users.filter((u: User) => u.isAdmin).length

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total users', value: users.length, icon: <FiUsers className="w-4 h-4" />, color: 'text-[#565959]' },
          { label: 'Admins', value: admins, icon: <FiShield className="w-4 h-4" />, color: 'text-[#007185]' },
          { label: 'Customers', value: users.length - admins, icon: <FiCheckCircle className="w-4 h-4" />, color: 'text-[#007600]' },
        ].map((s) => (
          <div key={s.label} className="admin-stat">
            <div className={`flex items-center gap-2 text-xs font-medium ${s.color}`}>
              {s.icon}
              {s.label}
            </div>
            <p className="text-2xl font-bold text-[#0F1111] mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 flex items-center gap-2">
        <FiSearch className="w-4 h-4 text-[#565959] shrink-0" />
        <input
          type="search"
          placeholder="Search by name or email…"
          className="amazon-input flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[#565959]">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user: User) => (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-[#232F3E] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#FF9900] font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-[#565959]">{user.email}</td>
                    <td>
                      {user.isAdmin ? (
                        <span className="admin-badge-neutral inline-flex items-center gap-1 font-bold">
                          <FiShield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="admin-badge-success inline-flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3" /> User
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/users/${user._id}`} className="admin-btn-link inline-flex items-center gap-1">
                          <FiEdit2 className="w-3 h-3" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id, user.name)}
                          className="admin-btn-link inline-flex items-center gap-1 !text-[#CC0C39]"
                        >
                          <FiTrash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#D5D9D9] text-xs text-[#565959] bg-[#F7F8F8]">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  )
}
