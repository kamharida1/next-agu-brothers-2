'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BUSINESS } from '@/lib/seo'

type SocialLinksProps = {
  variant?: 'footer' | 'inline' | 'sidebar'
  className?: string
}

function facebookHref(mobile: boolean) {
  return mobile ? BUSINESS.facebookMobile : BUSINESS.facebook
}

const PROFILES = [
  { key: 'facebook', label: 'Facebook', href: (mobile: boolean) => facebookHref(mobile) },
  { key: 'instagram', label: 'Instagram', href: () => BUSINESS.instagram },
  { key: 'whatsapp', label: 'WhatsApp', href: () => BUSINESS.whatsapp },
] as const

export default function SocialLinks({ variant = 'inline', className = '' }: SocialLinksProps) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 text-xs ${className}`}>
        {PROFILES.map((profile) => (
          <a
            key={profile.key}
            href={profile.href(mobile)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-sm hover:underline hover:text-white touch-manipulation"
          >
            {profile.label}
          </a>
        ))}
        <Link href="/terms-and-conditions" className="min-h-[44px] inline-flex items-center px-3 py-2 hover:underline hover:text-white touch-manipulation">
          Conditions of Use
        </Link>
        <Link href="/privacy-policy" className="min-h-[44px] inline-flex items-center px-3 py-2 hover:underline hover:text-white touch-manipulation">
          Privacy Notice
        </Link>
        <Link href="/contact-us" className="min-h-[44px] inline-flex items-center px-3 py-2 hover:underline hover:text-white touch-manipulation">
          Help
        </Link>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`px-4 py-3 space-y-1 border-t border-[#D5D9D9] ${className}`}>
        <p className="text-sm font-bold text-[#0F1111] mb-2">Follow Us</p>
        {PROFILES.map((profile) => (
          <a
            key={profile.key}
            href={profile.href(mobile)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center min-h-[44px] text-sm text-[#007185] hover:underline hover:text-[#CC0C39] touch-manipulation"
          >
            {profile.label}
          </a>
        ))}
      </div>
    )
  }

  return (
    <p className={className}>
      {PROFILES.map((profile, i) => (
        <span key={profile.key}>
          {i > 0 && ' · '}
          <a
            href={profile.href(mobile)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007185] hover:underline hover:text-[#CC0C39] touch-manipulation"
          >
            {profile.label}
          </a>
        </span>
      ))}
    </p>
  )
}
