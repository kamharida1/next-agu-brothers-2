'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">😟</div>
        <h1 className="text-3xl font-bold text-[#CC0C39] mb-2">Something went wrong</h1>
        <p className="text-[#565959] mb-8">We&apos;re sorry — something went wrong on our end. Please try again.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={reset} className="btn-amazon px-8 py-2.5 rounded-md text-sm">
            Try again
          </button>
          <Link href="/" className="btn-amazon-outline px-8 py-2.5 rounded-md text-sm">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
