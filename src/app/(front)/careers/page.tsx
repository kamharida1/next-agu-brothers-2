// Code Generated with love by Agu
import { Job } from '@/lib/models/JobModel'
import jobServices from '@/lib/services/jobService'
import { Metadata } from 'next'
import Link from 'next/link'
import { GrUserWorker } from 'react-icons/gr'

export const metadata: Metadata = {
  title: 'Careers | Agu Brothers',
  description: 'Careers at Agu Brothers. Join our team and help us grow.',
  openGraph: {
    title: 'Careers | Agu Brothers',
    description: 'Careers at Agu Brothers. Join our team and help us grow.',
    type: 'website',
  },
}

export default async function Careers() {
  const jobs = await jobServices.getJobs()
  return (
    <>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <GrUserWorker className="w-4 h-4 mr-2 stroke-current" />
            Careers
          </li>
        </ul>
      </div>
      <div className="container mx-auto p-6 prose">
        <h1 className="text-3xl font-bold mb-4">Careers at Agu Brothers</h1>
        <p>
          At Agu Brothers, we are always looking for talented individuals to
          join our team. If you are passionate about technology and customer
          service, we would love to hear from you. Check out our current job
          openings below and apply today.
        </p>
        <h2 className="text-2xl font-semibold mt-8">Current Job Openings</h2>
        <ul className="list-disc ml-6 space-y-4">
          {jobs.map((job) => (
            <JobItem key={job._id} job={job} />
          ))}
        </ul>
        <p className="mt-4">
          Thank you for your interest in joining Agu Brothers. We look forward
          to reviewing your application!
        </p>
      </div>
    </>
  )
}

const JobItem = ({ job }: { job: Job }) => {
  return (
    <li>
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="font-bold">
        Location: <span className='font-normal'>{job.location}</span>
      </p>
      <p className="font-bold">Responsibilities:</p>
      <ul className="list-disc ml-6">
        {job.responsibilities.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <p className="font-bold">Requirements:</p>
      <ul className="list-disc ml-6">
        {job.requirements.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <p>
        If you are interested in this position, please send your resume and
        cover letter to{' '}
        <a href={`mailto:careers@agubrothers.com`}>careers@agubrothers.com</a>.
      </p>
    </li>
  )
}

