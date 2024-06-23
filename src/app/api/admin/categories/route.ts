import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const categories = await CategoryModel.find().populate('parent')
  return Response.json(categories)
}) as any

{/* ===============  POST /api/admin/categories =============== */}

export const POST = auth(async (...p: any) => {
  const [req, { params }] = p
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const {
    name,
    parent,
    properties,
  } = await req.json()

    await dbConnect()
    const category = new CategoryModel({
      name,
      parent: parent || undefined,
      properties,
    })
    try {
      await category.save()
      return Response.json(
        { message: 'Category created successfully', category },
        {
          status: 201,
        }
      )
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      )
    }
}) as any

