'use client'

import JobForm from '@/components/JobForm'
import { Job } from '@/lib/models/JobModel'
import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

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

  const handleEditClick = (job: Job) => {
    setSelectedJob(job)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Delete this job listing?')) return
    const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="admin-panel p-5">
        <h2 className="text-sm font-bold text-[#565959] uppercase tracking-wider mb-4">
          {selectedJob ? 'Edit job' : 'Add job'}
        </h2>
        <JobForm job={selectedJob} />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#0F1111]">Current openings</h2>
        {jobs.length === 0 ? (
          <div className="admin-panel p-8 text-center text-sm text-[#565959]">
            No job openings yet
          </div>
        ) : (
          jobs.map((job: Job) => (
            <article key={job._id} className="admin-panel p-5">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <h3 className="text-lg font-bold text-[#0F1111]">{job.title}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-amazon-outline px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1"
                    onClick={() => handleEditClick(job)}
                  >
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs text-[#CC0C39] hover:underline inline-flex items-center gap-1 px-2"
                    onClick={() => handleDeleteClick(job._id)}
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#565959] mb-2">Location: {job.location}</p>
              <p className="text-sm font-medium text-[#0F1111]">Responsibilities</p>
              <ul className="list-disc ml-5 text-sm text-[#565959] mb-2">
                {(job.responsibilities || []).map((item, index) => (
                  <li key={`${job._id}-r-${index}`}>{item}</li>
                ))}
              </ul>
              <p className="text-sm font-medium text-[#0F1111]">Requirements</p>
              <ul className="list-disc ml-5 text-sm text-[#565959] mb-2">
                {(job.requirements || []).map((item, index) => (
                  <li key={`${job._id}-q-${index}`}>{item}</li>
                ))}
              </ul>
              <p className="text-sm">
                Apply:{' '}
                <a href={`mailto:${job.email}`} className="text-[#007185]">
                  {job.email}
                </a>
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
