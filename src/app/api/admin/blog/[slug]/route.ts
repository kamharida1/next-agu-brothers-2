import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/lib/models/BlogModel"

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const blog = await BlogModel.findOne({slug: params.slug})
  if (!blog) {
    return Response.json(
      { message: 'blog not found' },
      {
        status: 404,
      }
    )
  }
  return Response.json(blog)
}) as any

export const PUT = auth(async (...p: any) => {
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

  try {
    await dbConnect()
    const blog = await BlogModel.findOne({slug: params.slug})
    if (blog) {
      blog.title = title
      blog.slug = slug
      blog.content = content
      blog.image = image
      await blog.save()
      return Response.json({ message: 'Blog updated successfully' })
    } else {
      return Response.json(
        { message: ' Blog not found' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  try {
    await dbConnect()
    const blog = await BlogModel.findOne({slug: params.slug})
    if (blog) {
      await blog.deleteOne()
      return Response.json({ message: 'Blog deleted successfully' })
    } else {
      return Response.json(
        { message: 'Blog not found' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any