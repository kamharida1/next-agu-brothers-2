import dbConnect from '@/lib/dbConnect'
import { cache } from 'react'
import { notFound } from 'next/navigation' // Importing the notFound function from Next.js for handling 404 errors.
import JobModel, { Job } from '../models/JobModel'


export const revalidate = 3600 // revalidate the data at most every hour

const getJobs = cache(async (): Promise<Job[]> => {
  await dbConnect()
  const jobs = await JobModel.find({}).sort({ updatedAt: -1 }).limit(4).exec()
  return jobs as Job[]
})


const getJobById = cache(async (slug: string): Promise<Job | null> => {
  await dbConnect()
  const job = await JobModel.findOne({ slug }).exec()
  if (!job) {
    throw notFound()
  }
  return job as Job
})

const deleteJobById = cache(async (id: string): Promise<Job | null> => {
  await dbConnect()
  const post = await JobModel.findOneAndDelete({ id }).exec()
  if (!post) {
    throw notFound()
  }
  return post as Job
})

const jobServices = {
  deleteJobById,
  getJobById,
  getJobs,
}

export default jobServices
