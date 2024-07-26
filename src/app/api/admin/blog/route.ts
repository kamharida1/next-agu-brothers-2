import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/lib/models/BlogModel"

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
  const blog = await BlogModel.find()
  return Response.json(blog)
}) as any

{/* ===============  POST /api/admin/blog =============== */}

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
    title,
    slug,
    image,
    content,
  } = await req.json()

    await dbConnect()
    const blog = new BlogModel({
      title,
      slug: slug.toLowerCase(),
      image: image || '',
      content,
    })
    try {
      await blog.save()
      return Response.json(
        { message: 'Blog created successfully', blog },
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
