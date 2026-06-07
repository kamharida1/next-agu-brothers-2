import { Job } from '@/lib/models/JobModel'
import jobServices from '@/lib/services/jobService'
import { Metadata } from 'next'
import Link from 'next/link'
import { staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'Careers | Agu Brothers Electronics',
  description:
    'Join the Agu Brothers team. Explore current job openings and help us deliver quality electronics across Nigeria.',
  path: '/careers',
})

const PERKS = [
  { icon: '🌱', title: 'Growth & Learning', desc: 'Ongoing training and career development in a fast-growing company.' },
  { icon: '🤝', title: 'Collaborative Culture', desc: 'A close-knit team where every voice matters and ideas are welcomed.' },
  { icon: '💰', title: 'Competitive Pay', desc: 'Fair salaries, performance bonuses, and staff discounts on products.' },
  { icon: '📍', title: 'Enugu Based', desc: 'Our flagship store is at 33 Ogui Road — central, accessible, and vibrant.' },
]

export default async function Careers() {
  const jobs = await jobServices.getJobs()
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Careers</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Work at Agu Brothers</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">
            We&apos;ve been powering Nigerian homes since 1979. Join a team that&apos;s passionate about technology, service, and community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main: perks + jobs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Why join us */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Why Join Us?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {PERKS.map(p => (
                  <div key={p.title} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{p.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-[#0F1111]">{p.title}</p>
                      <p className="text-xs text-[#565959] mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job listings */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Current Openings</h2>
              {jobs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="font-semibold text-[#0F1111]">No open positions right now</p>
                  <p className="text-sm text-[#565959] mt-2 max-w-sm mx-auto">
                    We&apos;re not actively hiring at the moment, but we&apos;re always happy to hear from talented people.
                    Send a speculative CV to{' '}
                    <a href="mailto:careers@agubrothers.com" className="text-[#007185] hover:underline">
                      careers@agubrothers.com
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobItem key={job._id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">How to Apply</h3>
              <ol className="space-y-3 text-sm text-[#565959]">
                <li className="flex items-start gap-2"><span className="font-bold text-[#FF9900]">1.</span> Find an opening that suits you below.</li>
                <li className="flex items-start gap-2"><span className="font-bold text-[#FF9900]">2.</span> Prepare your CV and a short cover letter.</li>
                <li className="flex items-start gap-2"><span className="font-bold text-[#FF9900]">3.</span> Email your application to us.</li>
                <li className="flex items-start gap-2"><span className="font-bold text-[#FF9900]">4.</span> We&apos;ll review and contact shortlisted candidates within 5 business days.</li>
              </ol>
              <a
                href="mailto:careers@agubrothers.com"
                className="btn-amazon w-full py-2 rounded-md text-sm text-center block mt-4"
              >
                Email Your CV
              </a>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Contact HR</h3>
              <div className="space-y-2 text-sm text-[#565959]">
                <p>📞 +234 909 923 4242</p>
                <p>✉️ careers@agubrothers.com</p>
                <p>📍 33 Ogui Road, Enugu</p>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-sm font-bold text-[#0F1111] mb-3">Explore</p>
              <ul className="space-y-2">
                {[
                  { href: '/about-us',   label: 'About Agu Brothers' },
                  { href: '/contact-us', label: 'Contact Us' },
                  { href: '/blog',       label: 'Our Blog' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#007185] hover:underline hover:text-[#CC0C39]">
                      › {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const JobItem = ({ job }: { job: Job }) => (
  <div className="border border-[#D5D9D9] rounded-sm p-5 hover:border-[#FF9900] transition-colors">
    <h3 className="text-lg font-bold text-[#0F1111]">{job.title}</h3>
    <p className="text-sm text-[#565959] mt-0.5">📍 {job.location}</p>

    <div className="mt-3 space-y-2">
      <div>
        <p className="text-sm font-semibold text-[#0F1111]">Responsibilities</p>
        <ul className="mt-1 space-y-1">
          {job.responsibilities.map((r, i) => (
            <li key={i} className="text-sm text-[#565959] flex items-start gap-1.5">
              <span className="text-[#FF9900] mt-0.5">•</span> {r}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0F1111]">Requirements</p>
        <ul className="mt-1 space-y-1">
          {job.requirements.map((r, i) => (
            <li key={i} className="text-sm text-[#565959] flex items-start gap-1.5">
              <span className="text-[#FF9900] mt-0.5">•</span> {r}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <a
      href="mailto:careers@agubrothers.com"
      className="inline-block mt-4 btn-amazon px-5 py-1.5 rounded-md text-sm"
    >
      Apply Now
    </a>
  </div>
)
