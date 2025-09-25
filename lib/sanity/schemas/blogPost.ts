export const blogPost = {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  initialValue: () => ({
    tableOfContents: []
  }),
  fields: [
    {
      name: 'cardType',
      title: 'Card Type',
      type: 'string',
      options: {
        list: [
          { title: 'Main Card', value: 'mainCard' },
          { title: 'Simple Card', value: 'simple' },
          { title: 'Carousel Card', value: 'carousel' },
          { title: 'Guide Card', value: 'guide' },
          { title: 'Best Of Card', value: 'bestOf' }
        ]
      },
      validation: (Rule: any) => Rule.required(),
      description: 'Select the card type for this post'
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }
      ]
    },
    {
      name: 'cardImage',
      title: 'Card Image',
      type: 'image',
      description: 'Image used in card displays (not needed for Main Card)',
      options: {
        hotspot: true,
      },
      hidden: ({ document }: any) => document?.cardType === 'mainCard',
      validation: (Rule: any) => Rule.custom((cardImage: any, context: any) => {
        const cardType = context?.document?.cardType;
        if (cardType === 'mainCard') {
          return true; // Not required for main card
        }
        return cardImage ? true : 'Card image is required for this card type';
      }),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }
      ]
    },
    {
      name: 'cardTitle',
      title: 'Card Title',
      type: 'string',
      description: 'Title used in card displays (not needed for Main Card)',
      hidden: ({ document }: any) => document?.cardType === 'mainCard',
      validation: (Rule: any) => Rule.custom((cardTitle: string, context: any) => {
        const cardType = context?.document?.cardType;
        if (cardType === 'mainCard') {
          return true; // Not required for main card
        }
        return cardTitle ? true : 'Card title is required for this card type';
      })
    },
    {
      name: 'cardDescription',
      title: 'Card Description',
      type: 'text',
      rows: 3,
      description: 'Description used in carousel cards only',
      hidden: ({ document }: any) => document?.cardType !== 'carousel',
      validation: (Rule: any) => Rule.custom((cardDescription: string, context: any) => {
        const cardType = context?.document?.cardType;
        if (cardType === 'carousel') {
          return cardDescription ? true : 'Card description is required for carousel cards';
        }
        return true;
      })
    },
    {
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'publishDate',
      title: 'Date Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{ type: 'city' }],
      description: 'City or location related to this blog post'
    },
    {
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'Link' },
            { name: 'isCurrentPage', type: 'boolean', title: 'Current Page' }
          ]
        }
      ]
    },
    {
      name: 'contentSections',
      title: 'Content Sections',
      type: 'array',
      description: 'Add content sections. Table of Contents will be auto-generated from section titles.',
      of: [
        {
          type: 'object',
          name: 'textSection',
          title: 'Text Section',
          fields: [
            { name: 'title', type: 'string', title: 'Section Title', validation: (Rule: any) => Rule.required() },
            { name: 'description', type: 'text', title: 'Description', rows: 6, validation: (Rule: any) => Rule.required() }
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description'
            },
            prepare({ title, description }: {title: string, description: string}) {
              return {
                title: title || 'Text Section',
                subtitle: description ? `${description.slice(0, 100)}...` : 'No description'
              }
            }
          }
        },
        {
          type: 'object',
          name: 'bulletedSection',
          title: 'Bulleted Section',
          fields: [
            { name: 'title', type: 'string', title: 'Section Title', validation: (Rule: any) => Rule.required() },
            { name: 'description', type: 'text', title: 'Description', rows: 3 },
            {
              name: 'bulletPoints',
              type: 'array',
              title: 'Bullet Points',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'boldText', type: 'string', title: 'Bold Text (e.g., Location:)', validation: (Rule: any) => Rule.required() },
                    { name: 'subtext', type: 'string', title: 'Subtext (e.g., Alfred Street 102)', validation: (Rule: any) => Rule.required() }
                  ],
                  preview: {
                    select: {
                      boldText: 'boldText',
                      subtext: 'subtext'
                    },
                    prepare({ boldText, subtext }: {boldText: string, subtext: string}) {
                      return {
                        title: `${boldText} ${subtext}`,
                        subtitle: 'Bullet Point'
                      }
                    }
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title',
              bulletPoints: 'bulletPoints'
            },
            prepare({ title, bulletPoints }: {title: string, bulletPoints: any[]}) {
              return {
                title: title || 'Bulleted Section',
                subtitle: bulletPoints ? `${bulletPoints.length} bullet points` : 'No bullet points'
              }
            }
          }
        },
        {
          type: 'object',
          name: 'stepSection',
          title: 'Step Section',
          fields: [
            { name: 'title', type: 'string', title: 'Section Title', validation: (Rule: any) => Rule.required() },
            { name: 'stepNumber', type: 'number', title: 'Step Number', validation: (Rule: any) => Rule.required() },
            { name: 'stepTitle', type: 'string', title: 'Step Title', validation: (Rule: any) => Rule.required() },
            {
              name: 'stepImage',
              type: 'image',
              title: 'Step Image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                }
              ]
            },
            { name: 'description', type: 'text', title: 'Description', rows: 4, validation: (Rule: any) => Rule.required() },
            { name: 'location', type: 'string', title: 'Location' },
            { name: 'price', type: 'string', title: 'Price' },
            {
              name: 'booking',
              type: 'object',
              title: 'Booking Info',
              fields: [
                { name: 'text', type: 'text', title: 'Booking Text', rows: 3 },
                { name: 'linkText', type: 'string', title: 'Link Text (e.g., "Book Now")' },
                { name: 'link', type: 'url', title: 'Booking Link' }
              ]
            }
          ],
          preview: {
            select: {
              title: 'stepTitle',
              stepNumber: 'stepNumber',
              media: 'stepImage'
            },
            prepare({ title, stepNumber, media }: {title: string, stepNumber: number, media: any}) {
              return {
                title: `Step ${stepNumber}: ${title || 'Untitled'}`,
                media
              }
            }
          }
        }
      ]
    },
    {
      name: 'moreReads',
      title: 'More Reads',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Section Title', initialValue: 'More Reads' },
        {
          name: 'posts',
          type: 'array',
          title: 'Related Blog Posts',
          of: [
            {
              type: 'reference',
              to: [{ type: 'blogPost' }]
            }
          ]
        }
      ]
    },
    {
      name: 'review',
      title: 'Author Review',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Author Name' },
        { name: 'image', type: 'image', title: 'Author Image' },
        { name: 'reviewText', type: 'text', title: 'Review Text', rows: 8 },
        { name: 'socialLink', type: 'url', title: 'Social Link' }
      ]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }]
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Mark as featured for priority display',
      initialValue: false
    }
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }]
    },
    {
      title: 'Published Date, Old',
      name: 'publishDateAsc',
      by: [{ field: 'publishDate', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'review.name',
      media: 'heroImage',
      publishDate: 'publishDate'
    },
    prepare(value: any) {
      const { title, author, media, publishDate } = value
      return {
        title: title || 'Untitled',
        subtitle: author ? `by ${author}` : 'No author',
        media
      }
    }
  }
}