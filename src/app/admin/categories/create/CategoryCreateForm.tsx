'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/models/CategoryModel'

interface Property {
  name: string
  values: string
}

interface CategoryFormValues {
  name: string
  parent?: string
  properties: Property[]
}

export default function CategoryCreateForm() {
  const router = useRouter()

  const { data: categories } = useSWR(`/api/admin/categories`)
  
  const { trigger: createCategory, isMutating: isCreating } = useSWRMutation(
    `/api/admin/categories/`,
    async (url, { arg }: {arg: CategoryFormValues}) => {
      const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Category created successfully')
      router.push('/admin/categories')
    }
  )

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>(
    {
      defaultValues: {
        name: '',
        parent: '',
        properties: [{ name: '', values: ''}],
      }
    }
  )

  
  const formSubmit: SubmitHandler<CategoryFormValues> =
    async (formData: any) => {
      const cat: CategoryFormValues = {
        name: formData.name,
        parent: formData.parent,
        properties: formData.properties.map((p: Property) => ({
          name: p.name,
          values: p.values.split(','),
        })),
      }
      await createCategory(cat)
    }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
  })

  function addProperty() {
    append({ name: '', values: '' })
  }

  const handlePropertyChange = (
    index: number,
    field: 'name' | 'values',
    value: string
  ) => {
    setValue(`properties.${index}.${field}`, value as any)
  }

  const removeProperty = (index: number) => {
    remove(index)
  }

  return (
    <div className="flex-col">
      <h1 className="text-2xl py-4">
        Create new category
      </h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="name">
              Name
            </label>
            <div className="md:w-4/5">
              <input
                type="text"
                className="input input-bordered w-full max-w-md"
                {...register('name', { required: 'Name is required' })}
              />
            </div>
          </div>
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="parent">
              Parent Category
            </label>
            <div className="md:w-4/5">
              <select
                className="select select-bordered w-full max-w-xs"
                {...register('parent')}
              >
                <option disabled selected>
                  No parent category
                </option>
                {categories?.length > 0 &&
                  categories.map((category: Category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex-col">
            <div className="md:flex mb-6">
              <label className="label md:w-1/5" htmlFor="properties">
                Properties
              </label>
              <div className="md:w-4/5">
                <button
                  onClick={addProperty}
                  type="button"
                  className="btn btn-wide btn-outline btn-primary"
                >
                  Add new Property
                </button>
              </div>
            </div>
            {fields.length > 0 &&
              fields.map((field, index) => (
                <div key={field.id} className="md:flex mb-6 gap-2">
                  <div className="md:w-2/5">
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-md"
                      placeholder="property name (example: color)"
                      {...register(`properties.${index}.name`)}
                      onChange={(e) =>
                        handlePropertyChange(index, 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:w-2/5">
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-md"
                      placeholder="values, comma separated"
                      {...register(`properties.${index}.values`)}
                      onChange={(e) =>
                        handlePropertyChange(index, 'values', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:w-1/5">
                    <button
                      className="btn btn-error btn-outline"
                      onClick={() => removeProperty(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="btn btn-primary"
          >
            {(isCreating) && (
              <span className="loading loading-spinner"></span>
            )}
            Create
          </button>

          <Link className="btn ml-4 " href="/admin/categories">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}
