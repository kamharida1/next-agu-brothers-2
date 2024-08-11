'use client'
import { Job } from '@/lib/models/JobModel'
import { useState, useEffect } from 'react'

const JobForm = ({job}: {job: Job | null}) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    responsibilities: '',
    requirements: '',
    email: '',
  })

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        location: job.location,
        responsibilities: job.responsibilities.join(', '),
        requirements: job.requirements.join(', '),
        email: job.email,
      })
    }
  }, [job])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const method = job ? 'PUT' : 'POST'
    const url = job ? `/api/admin/jobs/${job._id}` : '/api/admin/jobs'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        responsibilities: formData.responsibilities
          .split(',')
          .map((item) => item.trim()),
        requirements: formData.requirements
          .split(',')
          .map((item) => item.trim()),
      }),
    })

    const data = await response.json()
    console.log(data)
    if (data) {
      setFormData({
        title: '',
        location: '',
        responsibilities: '',
        requirements: '',
        email: '',
      })
    }
  }

  return (
    <div className="container mx-auto p-6 prose">
      <h2 className="text-2xl font-semibold mb-4">
        {job ? 'Edit Job Listing' : 'Add New Job Listing'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">Job Title</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="location">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="responsibilities">
            <span className="label-text">
              Responsibilities (comma separated)
            </span>
          </label>
          <input
            type="text"
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="requirements">
            <span className="label-text">Requirements (comma separated)</span>
          </label>
          <input
            type="text"
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Contact Email</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {job ? 'Update Job' : 'Add Job'}
        </button>
      </form>
    </div>
  )
}

export default JobForm
