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
    <div className="alert alert-error">
      <FiAlertCircle className="w-5 h-5" />
      <span>Failed to load users: {error.message}</span>
    </div>
  )

  if (!users) return (
    <div className="flex items-center justify-center py-16">
      <span className="loading loading-spinner loading-lg text-primary"></span>
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
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-base-content/60">
              <FiUsers className="w-4 h-4" />
              <span className="text-xs font-medium">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-primary">
              <FiShield className="w-4 h-4" />
              <span className="text-xs font-medium">Admins</span>
            </div>
            <p className="text-2xl font-bold">{admins}</p>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-success">
              <FiCheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Regular Users</span>
            </div>
            <p className="text-2xl font-bold">{users.length - admins}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full pl-9 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="text-xs uppercase tracking-wider">User</th>
                <th className="text-xs uppercase tracking-wider">Email</th>
                <th className="text-xs uppercase tracking-wider">Role</th>
                <th className="text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-base-content/50">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user: User) => (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">{user.email}</td>
                    <td>
                      {user.isAdmin ? (
                        <div className="badge badge-primary badge-sm gap-1">
                          <FiShield className="w-3 h-3" /> Admin
                        </div>
                      ) : (
                        <div className="badge badge-ghost badge-sm gap-1">
                          <FiCheckCircle className="w-3 h-3" /> User
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="btn btn-ghost btn-xs gap-1"
                        >
                          <FiEdit2 className="w-3 h-3" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="btn btn-ghost btn-xs text-error gap-1"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          Delete
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
          <div className="px-4 py-3 border-t border-base-200 text-sm text-base-content/50">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  )
}
