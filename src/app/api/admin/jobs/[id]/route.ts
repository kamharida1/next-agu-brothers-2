import { auth } from "@/lib/auth"
import data from "@/lib/data"
import dbConnect from "@/lib/dbConnect"
import JobModel from "@/lib/models/JobModel"

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
  const job = await JobModel.findOne(params.id)
  if (!job) {
    return Response.json(
      { message: 'job not found' },
      {
        status: 404,
      }
    )
  }
  return Response.json(job)
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
    location,
    responsibilities,
    requirements,
    email,
  } = await req.json()

  try {
    await dbConnect()
    const job = await JobModel.findById(params.id)
    if (job) {
      job.title = title
      job.location = location
      job.responsibilities = responsibilities
      job.requirements = requirements
      job.email = email
      await job.save()
      return Response.json({
        message: 'Job updated successfully',
        job,
      })
    } else {
      return Response.json(
        { message: ' Job not found' },
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
    const job = await JobModel.findById(params.id)
    if (job) {
      await job.deleteOne()
      return Response.json({ message: 'Job deleted successfully' })
    } else {
      return Response.json(
        { message: 'Job not found' },
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