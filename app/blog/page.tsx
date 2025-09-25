import BlogPage from '@/components/blog/blog'
import React from 'react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Blog() {
  return (
    <div >
      <BlogPage/>
    </div>
  )
}
