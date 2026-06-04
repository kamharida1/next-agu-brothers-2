'use client'

import { Job } from '@/lib/models/JobModel'
import { useState, useEffect } from 'react'

const JobForm = ({ job }: { job: Job | null }) => {
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
    } else {
      setFormData({
        title: '',
        location: '',
        responsibilities: '',
        requirements: '',
        email: '',
      })
    }
  }, [job])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const method = job ? 'PUT' : 'POST'
    const url = job ? `/api/admin/jobs/${job._id}` : '/api/admin/jobs'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        responsibilities: formData.responsibilities.split(',').map((item) => item.trim()),
        requirements: formData.requirements.split(',').map((item) => item.trim()),
      }),
    })

    window.location.reload()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {[
        { id: 'title', label: 'Job title' },
        { id: 'location', label: 'Location' },
        { id: 'responsibilities', label: 'Responsibilities (comma separated)' },
        { id: 'requirements', label: 'Requirements (comma separated)' },
        { id: 'email', label: 'Contact email', type: 'email' },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-[#0F1111] mb-1.5">
            {field.label}
          </label>
          <input
            type={field.type || 'text'}
            id={field.id}
            name={field.id}
            value={formData[field.id as keyof typeof formData]}
            onChange={handleChange}
            className="amazon-input"
            required
          />
        </div>
      ))}
      <button type="submit" className="btn-amazon px-6 py-2 rounded-md text-sm">
        {job ? 'Update job' : 'Add job'}
      </button>
    </form>
  )
}

export default JobForm
