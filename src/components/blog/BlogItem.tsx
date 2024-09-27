'use client'
import Link from 'next/link'
import React from 'react'
import CldImage from '../CldImage'
import type { Blog } from '@/lib/models/BlogModel'
import { useSession } from 'next-auth/react'
import PostDelete from './PostDelete'
import { truncateText } from '@/lib/utils'
import HtmlRenderer from './Htmlparser'

function stripHtmlTags(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export default function BlogItem({ blog }: { blog: Blog }) {
  const { data: session } = useSession()

  return (
    <div className="card compact  shadow-lg mb-6 transition-transform transform hover:scale-105">
      <Link href={`/blog/${blog.slug}`} passHref>
        <figure className="relative overflow-hidden">
          <CldImage
            src={blog.image}
            alt={blog.title}
            width={300}
            height={150}
            className="object-cover object-center w-full h-40 rounded-t-xl transition-transform transform hover:scale-110"
          />
        </figure>
      </Link>

      <div className="card-body p-4">
        <Link href={`/blog/${blog.slug}`} passHref>
          <h2 className="card-title text-lg font-bold">
            {blog.title}
          </h2>
        </Link>
        <p className="text-xs mb-2">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>

        {/* Truncate the blog content and show ellipses */}
        <p className=" text-sm line-clamp-3">
          {truncateText(stripHtmlTags(blog.content), 100)}{' '}
          {/* 100 is the char limit */}
        </p>

        <div className="card-actions justify-end mt-4">
          <Link href={`/blog/${blog.slug}`} passHref>
            <p className="btn btn-outline btn-primary btn-sm">Read More</p>
          </Link>
        </div>

        {/* Show admin actions if the user is an admin */}
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
