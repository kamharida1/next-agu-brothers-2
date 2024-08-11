'use client'
import Link from 'next/link'
import React from 'react'
import CldImage from '../CldImage'
import type { Blog } from '@/lib/models/BlogModel'
import { useSession } from 'next-auth/react'
import PostDelete from './PostDelete'
import { truncateText } from '@/lib/utils'
import HtmlRenderer from './Htmlparser'

export default function BlogItem({ blog }: { blog: Blog }) {
  const { data: session } = useSession()

  return (
    <div className="card w-full card-compact bg-base-100 shadow-xl mb-6 transition-transform transform hover:scale-105">
      <figure className="relative overflow-hidden">
        <Link href={`/blog/${blog.slug}`} passHref>
          <CldImage
            src={blog.image}
            alt={blog.title}
            width={400}
            height={350}
            className="object-cover w-full h-64 overflow-hidden rounded-xl transition-transform transform hover:scale-110"
          />
        </Link>
      </figure>
      <div className="card-body p-4">
        <Link href={`/blog/${blog.slug}`} passHref>
          <h2 className="card-title text-2xl font-semibold ">
            {blog.title}
          </h2>
        </Link>
        <p className="text-sm mb-2">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <article className="prose prose-sm ">
          <HtmlRenderer htmlString={blog.content} />
        </article>
        {session?.user?.isAdmin && (
          <div className="card-actions flex items-center justify-between mt-4">
            <Link href={`/admin/blog/${blog.slug}/edit`} passHref>
              <p className="btn btn-outline btn-primary btn-sm">Edit</p>
            </Link>
            <PostDelete slug={blog.slug} />
          </div>
        )}
      </div>
    </div>
  )
}
