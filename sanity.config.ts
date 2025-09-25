import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './lib/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Fly Fim Blog',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4z4f081m',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Main Page Configuration
            S.listItem()
              .title('Main Page')
              .child(
                S.document()
                  .schemaType('mainPage')
                  .documentId('mainPage')
                  .title('Main Page Configuration')
              ),

            S.divider(),

            // Blog Posts
            S.listItem()
              .title('Blog Posts')
              .child(
                S.documentTypeList('blogPost')
                  .title('Blog Posts')
                  .filter('_type == "blogPost"')
                  .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
              ),

            // Categories
            S.listItem()
              .title('Categories')
              .child(
                S.documentTypeList('category')
                  .title('Categories')
              ),

            // Tags
            S.listItem()
              .title('Tags')
              .child(
                S.documentTypeList('tag')
                  .title('Tags')
              ),

            // Cities
            S.listItem()
              .title('Cities')
              .child(
                S.documentTypeList('city')
                  .title('Cities')
              ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (prev, context) => {
      const { document } = context
      if (document._type === 'blogPost') {
        return `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/blog/${(document as any).slug?.current}`
      }
      return prev
    }
  }
})