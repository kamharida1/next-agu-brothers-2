'use client'

import { Category } from '@/lib/models/CategoryModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import {
  AdminAlert,
  AdminBtnPrimary,
  AdminLinkAction,
  AdminLoading,
  AdminTable,
  AdminToolbar,
} from '@/components/admin/AdminUI'

export default function Categories() {
  const { data: categories, error } = useSWR(`/api/admin/categories`)

  const { trigger: deleteCategory } = useSWRMutation(
    `/api/admin/categories`,
    async (url, { arg }: { arg: { categoryId: string } }) => {
      const toastId = toast.loading('Deleting category...')
      const res = await fetch(`${url}/${arg.categoryId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('Category deleted', { id: toastId })
      } else {
        toast.error(data.message, { id: toastId })
      }
    }
  )

  if (error) return <AdminAlert>Failed to load categories.</AdminAlert>
  if (!categories) return <AdminLoading />

  return (
    <div className="space-y-5">
      <AdminToolbar>
        <p className="text-sm text-[#565959] flex-1">
          {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}
        </p>
        <AdminBtnPrimary href="/admin/categories/create">
          <FiPlus className="w-4 h-4" />
          Add category
        </AdminBtnPrimary>
      </AdminToolbar>

      <AdminTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: Category) => (
            <tr key={category._id}>
              <td className="font-mono text-xs text-[#565959]">{formatId(category._id)}</td>
              <td className="font-medium text-[#0F1111]">{category.name}</td>
              <td className="text-[#565959]">{category?.parent?.name || '—'}</td>
              <td>
                <div className="flex gap-3">
                  <AdminLinkAction href={`/admin/categories/${category._id}`}>
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </AdminLinkAction>
                  <AdminLinkAction
                    danger
                    onClick={() => {
                      if (confirm(`Delete category "${category.name}"?`)) {
                        deleteCategory({ categoryId: category?._id || '' })
                      }
                    }}
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </AdminLinkAction>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  )
}
