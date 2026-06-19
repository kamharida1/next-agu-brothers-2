'use client'

import useSWR, { mutate } from 'swr'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Category } from '@/lib/models/CategoryModel'
import { FiPlus } from 'react-icons/fi'

type CategoryPickerProps = {
  value: string
  onChange: (categoryId: string, categoryName: string) => void
  /** Called after inline create so parent lists (e.g. category properties) update immediately */
  onCategoryCreated?: (category: Category) => void
  selectClassName?: string
  error?: string
  id?: string
}

export default function CategoryPicker({
  value,
  onChange,
  onCategoryCreated,
  selectClassName = 'amazon-input',
  error,
  id = 'category',
}: CategoryPickerProps) {
  const { data: categories = [], isLoading } = useSWR<Category[]>('/api/admin/categories')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newParent, setNewParent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    if (selected === '__create_new__') {
      setShowCreate(true)
      e.target.value = value
      return
    }
    const cat = categories.find((c) => String(c._id) === selected)
    onChange(selected, cat?.name ?? '')
  }

  const handleCreateCategory = async () => {
    const name = newName.trim()
    if (!name) {
      toast.error('Enter a category name')
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          parent: newParent || undefined,
          properties: [],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create category')

      const created = data.category as Category
      await mutate('/api/admin/categories')
      onCategoryCreated?.(created)
      onChange(String(created._id), created.name)
      setNewName('')
      setNewParent('')
      setShowCreate(false)
      toast.success(`Category "${created.name}" created`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      <select
        id={id}
        value={value}
        onChange={handleSelectChange}
        className={selectClassName}
        disabled={isLoading}
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={String(cat._id)} value={String(cat._id)}>
            {cat.name}
          </option>
        ))}
        <option value="__create_new__">+ Create new category…</option>
      </select>

      {error && <p className="text-[#CC0C39] text-xs">{error}</p>}

      {!showCreate ? (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1"
        >
          <FiPlus className="w-3 h-3" />
          Or create a new category
        </button>
      ) : (
        <div className="border border-[#D5D9D9] rounded-sm p-3 bg-[#F7F8F8] space-y-3">
          <p className="text-xs font-bold text-[#565959] uppercase tracking-wider">
            New category
          </p>
          <div>
            <label className="block text-xs font-medium text-[#0F1111] mb-1" htmlFor={`${id}-new-name`}>
              Name
            </label>
            <input
              id={`${id}-new-name`}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="amazon-input"
              placeholder="e.g. Televisions"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0F1111] mb-1" htmlFor={`${id}-new-parent`}>
              Parent (optional)
            </label>
            <select
              id={`${id}-new-parent`}
              value={newParent}
              onChange={(e) => setNewParent(e.target.value)}
              className="amazon-input"
            >
              <option value="">No parent</option>
              {categories.map((cat) => (
                <option key={String(cat._id)} value={String(cat._id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={isCreating}
              className="btn-amazon px-3 py-1.5 rounded-md text-xs"
            >
              {isCreating && <span className="loading loading-spinner loading-xs mr-1" />}
              Create &amp; select
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false)
                setNewName('')
                setNewParent('')
              }}
              className="btn-amazon-outline px-3 py-1.5 rounded-md text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
