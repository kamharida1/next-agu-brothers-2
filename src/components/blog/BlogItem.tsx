'use client'
import Link from 'next/link'
import React from 'react'
import CldImage from '../CldImage'
import type { Blog } from '@/lib/models/BlogModel'
import { useSession } from 'next-auth/react'
import PostDelete from './PostDelete'
import HtmlRenderer from './Htmlparser'
import { truncateText } from '@/lib/utils'

export default function BlogItem({ blog }: {blog: Blog }) {
   const { data: session } = useSession()
  return (
    <div className="card compact w-70 bg-base-300 shadow-xl mb-4">
      <figure>
        <Link href={`/blog/${blog.slug}`}>
          <CldImage
            src={blog.image}
            alt={blog.title}
            width={300}
            height={300}
            className="object-cover overflow-hidden mt-6 rounded-md h-64 w-full"
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link href={`/blog/${blog.slug}`}>
          <h2 className="card-title mt-4">{blog.title}</h2>
        </Link>
        {/* <p className="mb-2">{truncateText(blog.content, 100)}</p> */}
        <HtmlRenderer htmlString={truncateText(blog.content, 20)} />
        {session?.user?.isAdmin && (
          <div className="card-actions flex items-center justify-between">
            <Link href={`/admin/blog/${blog.slug}/`}>
              <button className="btn btn-sm">Edit</button>
            </Link>
            {/* <button
              className="btn w-full my-2"
              onClick={() => onDelete(blog.slug)}
            ></button> */}
            <PostDelete slug={blog.slug} />
          </div>
        )}
      </div>
    </div>
  )
}
