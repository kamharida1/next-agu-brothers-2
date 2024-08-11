import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import JobModel from "@/lib/models/JobModel"

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
  const job = await JobModel.find({})
  return Response.json(job)
}) as any

{/* ===============  POST /api/admin/jobs =============== */}

export const POST = auth(async (...p: any) => {
  const [req] = p
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

    await dbConnect()
    const job = new JobModel({
      title,
      location,
      responsibilities,
      requirements,
      email,
    })
    try {
      await job.save()
      return Response.json(
        { message: 'Job created successfully', job },
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
