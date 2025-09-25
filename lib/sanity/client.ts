import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '4z4f081m',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

// Helper function to get image URLs
export function getImageUrl(source: any): string {
  if (!source?.asset?._ref) return ''

  const ref = source.asset._ref
  const [_file, id, dimensions, format] = ref.split('-')

  return `https://cdn.sanity.io/images/4z4f081m/production/${id}-${dimensions}.${format}`
}