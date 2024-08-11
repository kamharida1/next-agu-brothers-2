'use client'

import JobForm from "@/components/JobForm"
import { Job } from "@/lib/models/JobModel"
import Head from "next/head"
import { useEffect, useState } from "react"

export default function Jobs() { 
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => { 
    const fetchJobs = async () => { 
      const response = await fetch('/api/admin/jobs')
      const data = await response.json()
      setJobs(data)
    }
    fetchJobs()
  }, [])

  const handleJobAddedOrUpdated = (job: Job) => { 
    setJobs((prevJobs) => { 
      const index = prevJobs.findIndex((j) => j._id === job._id)
      if (index > -1) {
        const updatedJobs = prevJobs.map(j => j._id === job._id ? job : j)
        return updatedJobs
      } else {
        return [job, ...prevJobs]
      }
    })
    setSelectedJob(null)
  }

  const handleEditClick = (job: Job) => {
    setSelectedJob(job)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteClick = async (id: string) => {
    const res = await fetch(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (data.success) {
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id))
    }
  }

  return (
    <>
      <Head>
        <title>Careers | Agu Brothers</title>
        <meta
          name="description"
          content="Careers at Agu Brothers. Join our team and help us grow."
        />
      </Head>
      <div className="container mx-auto p-6 prose">
        <h1 className="text-4xl font-bold mb-4">Careers at Agu Brothers</h1>
        <p className="text-lg">
          At Agu Brothers, we are always looking for talented individuals to
          join our team. If you are passionate about technology and customer
          service, we would love to hear from you. Check out our current job
          openings below and apply today.
        </p>
        <JobForm job={selectedJob} />
        <h2 className="text-2xl font-semibold mt-8">Current Job Openings</h2>
        {jobs.length === 0 ? (
          <p>No job openings available at the moment. Please check back later.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-4">
            {jobs.map((job: Job) => (
              <li key={job._id} className="border p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <div>
                    <button
                      className="btn btn-secondary btn-sm mr-2"
                      onClick={() => handleEditClick(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p>Location: {job.location}</p>
                <p>Responsibilities:</p>
                <ul className="list-disc ml-6">
                  {(job.responsibilities || []).map((item, index) => (
                    <li key={`${job._id}-responsibility-${index}`}>{item}</li>
                  ))}
                </ul>
                <p>Requirements:</p>
                <ul className="list-disc ml-6">
                  {(job.requirements || []).map((item, index) => (
                    <li key={`${job._id}-requirement-${index}`}>{item}</li>
                  ))}
                </ul>
                <p>
                  If you are interested in this position, please send your
                  resume and cover letter to{' '}
                  <a href={`mailto:${job.email}`}>{job.email}</a>.
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
