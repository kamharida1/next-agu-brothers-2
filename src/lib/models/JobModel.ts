import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  responsibilities: {
    type: [String],
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  email: {
    type: String,
    required: true
  }
},
{
  timestamps: true
} 
)

const JobModel =
  mongoose.models.Job || mongoose.model('Job', jobSchema)
export default JobModel

export type Job = {
  _id: string
  title: string
  location: string
  responsibilities: string[]
  requirements: string[]
  email: string
}
