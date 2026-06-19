'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import PostDelete from './PostDelete'

export default function BlogAdminActions({ slug }: { slug: string }) {
  const { data: session } = useSession()
  if (!session?.user?.isAdmin) return null

  return (
    <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#D5D9D9]">
      <Link
        href={`/admin/blog/${slug}/edit`}
        className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline"
      >
        Edit post
      </Link>
      <PostDelete slug={slug} />
    </div>
  )
}
