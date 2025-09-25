export const mainPage = {
  name: 'mainPage',
  title: 'Main Page Configuration',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Homepage Configuration'
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Drag to reorder sections on the homepage',
      of: [
        // Main Card Section (NO TITLE - standalone)
        {
          type: 'object',
          name: 'mainCardSection',
          title: 'Main Card Section',
          fields: [
            {
              name: 'mainCard',
              type: 'reference',
              title: 'Main Card Post',
              to: [{ type: 'blogPost' }],
              options: {
                filter: 'cardType == "mainCard"',
                filterParams: {}
              },
              validation: (Rule: any) => Rule.required().custom(async (value: any, context: any) => {
                if (!value || !value._ref) return true;

                const { getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });

                try {
                  const post = await client.fetch('*[_id == $id][0]{ cardType }', { id: value._ref });
                  if (post && post.cardType !== 'mainCard') {
                    return 'Selected post must be a Main Card type';
                  }
                } catch (error) {
                  console.error('Validation error:', error);
                }
                return true;
              })
            }
          ],
          preview: {
            select: {
              title: 'mainCard.title',
              media: 'mainCard.heroImage'
            },
            prepare(value: any) {
              const { title, media } = value
              return {
                title: 'Main Card',
                subtitle: title || 'No post selected',
                media
              }
            }
          }
        },

        // Simple Cards Section (WITH TITLE - 6 cards)
        {
          type: 'object',
          name: 'simpleCardsSection',
          title: 'Simple Cards Section',
          fields: [
            {
              name: 'sectionTitle',
              type: 'string',
              title: 'Section Title',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'cards',
              type: 'array',
              title: 'Simple Cards',
              of: [{
                type: 'reference',
                to: [{ type: 'blogPost' }],
                options: {
                  filter: 'cardType == "simple"',
                  filterParams: {}
                }
              }],
              validation: (Rule: any) => Rule.max(6).min(1).custom(async (value: any[], context: any) => {
                if (!value || !Array.isArray(value)) return true;

                const { getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });

                try {
                  for (const ref of value) {
                    if (ref && ref._ref) {
                      const post = await client.fetch('*[_id == $id][0]{ cardType }', { id: ref._ref });
                      if (post && post.cardType !== 'simple') {
                        return 'All selected posts must be Simple Card type';
                      }
                    }
                  }
                } catch (error) {
                  console.error('Validation error:', error);
                }
                return true;
              })
            }
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              cards: 'cards'
            },
            prepare(value: any) {
              const { title, cards } = value
              return {
                title: title || 'Simple Cards Section',
                subtitle: `${cards?.length || 0} cards`
              }
            }
          }
        },

        // Carousel Cards Section (WITH TITLE - 13 cards max)
        {
          type: 'object',
          name: 'carouselCardsSection',
          title: 'Carousel Cards Section',
          fields: [
            {
              name: 'sectionTitle',
              type: 'string',
              title: 'Section Title',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'cards',
              type: 'array',
              title: 'Carousel Cards',
              of: [{
                type: 'reference',
                to: [{ type: 'blogPost' }],
                options: {
                  filter: 'cardType == "carousel"',
                  filterParams: {}
                }
              }],
              validation: (Rule: any) => Rule.max(13).min(1).custom(async (value: any[], context: any) => {
                if (!value || !Array.isArray(value)) return true;

                const { getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });

                try {
                  for (const ref of value) {
                    if (ref && ref._ref) {
                      const post = await client.fetch('*[_id == $id][0]{ cardType }', { id: ref._ref });
                      if (post && post.cardType !== 'carousel') {
                        return 'All selected posts must be Carousel Card type';
                      }
                    }
                  }
                } catch (error) {
                  console.error('Validation error:', error);
                }
                return true;
              })
            }
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              cards: 'cards'
            },
            prepare(value: any) {
              const { title, cards } = value
              return {
                title: title || 'Carousel Cards Section',
                subtitle: `${cards?.length || 0} cards (max 13)`
              }
            }
          }
        },

        // Guide Cards Section (WITH TITLE - 6 cards)
        {
          type: 'object',
          name: 'guideCardsSection',
          title: 'Guide Cards Section',
          fields: [
            {
              name: 'sectionTitle',
              type: 'string',
              title: 'Section Title',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'cards',
              type: 'array',
              title: 'Guide Cards',
              of: [{
                type: 'reference',
                to: [{ type: 'blogPost' }],
                options: {
                  filter: 'cardType == "guide"',
                  filterParams: {}
                }
              }],
              validation: (Rule: any) => Rule.max(6).min(1).custom(async (value: any[], context: any) => {
                if (!value || !Array.isArray(value)) return true;

                const { getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });

                try {
                  for (const ref of value) {
                    if (ref && ref._ref) {
                      const post = await client.fetch('*[_id == $id][0]{ cardType }', { id: ref._ref });
                      if (post && post.cardType !== 'guide') {
                        return 'All selected posts must be Guide Card type';
                      }
                    }
                  }
                } catch (error) {
                  console.error('Validation error:', error);
                }
                return true;
              })
            }
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              cards: 'cards'
            },
            prepare(value: any) {
              const { title, cards } = value
              return {
                title: title || 'Guide Cards Section',
                subtitle: `${cards?.length || 0} cards`
              }
            }
          }
        },

        // Best Of Cards Section (WITH TITLE - 6 cards)
        {
          type: 'object',
          name: 'bestOfCardsSection',
          title: 'Best Of Cards Section',
          fields: [
            {
              name: 'sectionTitle',
              type: 'string',
              title: 'Section Title',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'cards',
              type: 'array',
              title: 'Best Of Cards',
              of: [{
                type: 'reference',
                to: [{ type: 'blogPost' }],
                options: {
                  filter: 'cardType == "bestOf"',
                  filterParams: {}
                }
              }],
              validation: (Rule: any) => Rule.max(6).min(1).custom(async (value: any[], context: any) => {
                if (!value || !Array.isArray(value)) return true;

                const { getClient } = context;
                const client = getClient({ apiVersion: '2023-01-01' });

                try {
                  for (const ref of value) {
                    if (ref && ref._ref) {
                      const post = await client.fetch('*[_id == $id][0]{ cardType }', { id: ref._ref });
                      if (post && post.cardType !== 'bestOf') {
                        return 'All selected posts must be Best Of Card type';
                      }
                    }
                  }
                } catch (error) {
                  console.error('Validation error:', error);
                }
                return true;
              })
            }
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              cards: 'cards'
            },
            prepare(value: any) {
              const { title, cards } = value
              return {
                title: title || 'Best Of Cards Section',
                subtitle: `${cards?.length || 0} cards`
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
      sections: 'sections'
    },
    prepare(value: any) {
      const { title, sections } = value
      return {
        title: title || 'Homepage Configuration',
        subtitle: `${sections?.length || 0} sections configured`
      }
    }
  }
}