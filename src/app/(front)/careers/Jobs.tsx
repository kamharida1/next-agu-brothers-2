'use client'

import Head from 'next/head'

const Careers = () => {
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
        <h1 className="text-3xl font-bold mb-4">Careers at Agu Brothers</h1>
        <p>
          At Agu Brothers, we are always looking for talented individuals to
          join our team. If you are passionate about technology and customer
          service, we would love to hear from you. Check out our current job
          openings below and apply today.
        </p>
        <h2 className="text-2xl font-semibold mt-8">Current Job Openings</h2>
        <ul className="list-disc ml-6 space-y-4">
          <li>
            <h3 className="text-xl font-semibold">Sales Representative</h3>
            <p>Location: Enugu, Enugu State</p>
            <p>Responsibilities:</p>
            <ul className="list-disc ml-6">
              <li>Assist customers with product inquiries and purchases</li>
              <li>Maintain knowledge of current sales and promotions</li>
              <li>Process sales transactions accurately and efficiently</li>
            </ul>
            <p>Requirements:</p>
            <ul className="list-disc ml-6">
              <li>Excellent communication and interpersonal skills</li>
              <li>Previous sales experience preferred</li>
              <li>Ability to work in a fast-paced environment</li>
            </ul>
            <p>
              If you are interested in this position, please send your resume
              and cover letter to{' '}
              <a href="mailto:careers@agubrothers.com">
                careers@agubrothers.com
              </a>
              .
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold">
              Customer Support Specialist
            </h3>
            <p>Location: Enugu, Enugu State</p>
            <p>Responsibilities:</p>
            <ul className="list-disc ml-6">
              <li>Respond to customer inquiries via phone, email, and chat</li>
              <li>Troubleshoot and resolve customer issues</li>
              <li>Provide product information and recommendations</li>
            </ul>
            <p>Requirements:</p>
            <ul className="list-disc ml-6">
              <li>Strong problem-solving skills</li>
              <li>Excellent verbal and written communication skills</li>
              <li>Experience in customer support is a plus</li>
            </ul>
            <p>
              If you are interested in this position, please send your resume
              and cover letter to{' '}
              <a href="mailto:careers@agubrothers.com">
                careers@agubrothers.com
              </a>
              .
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold">Technician</h3>
            <p>Location: Enugu, Enugu State</p>
            <p>Responsibilities:</p>
            <ul className="list-disc ml-6">
              <li>Perform repairs and maintenance on electronic devices</li>
              <li>Diagnose technical issues and provide solutions</li>
              <li>Keep detailed records of all work performed</li>
            </ul>
            <p>Requirements:</p>
            <ul className="list-disc ml-6">
              <li>Technical certification or equivalent experience</li>
              <li>Strong attention to detail</li>
              <li>Ability to work independently and as part of a team</li>
            </ul>
            <p>
              If you are interested in this position, please send your resume
              and cover letter to{' '}
              <a href="mailto:careers@agubrothers.com">
                careers@agubrothers.com
              </a>
              .
            </p>
          </li>
        </ul>
        <p className="mt-4 text-lg">
          Thank you for your interest in joining Agu Brothers. We look forward
          to reviewing your application!
        </p>
      </div>
    </>
  )
}

export default Careers
