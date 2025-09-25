import { client } from './client'
import { BlogPost, MainPageConfig } from './types'

// GROQ queries
export const BLOG_POST_QUERY = `
  *[_type == "blogPost"] | order(publishDate desc) {
    _id,
    _type,
    cardType,
    title,
    slug,
    subtitle,
    heroImage {
      asset->{
        _id,
        url
      },
      alt
    },
    cardImage {
      asset->{
        _id,
        url
      },
      alt
    },
    cardTitle,
    cardDescription,
    introduction,
    publishDate,
    category->{
      _id,
      title,
      slug
    },
    city-> {
      _id,
      name
    },
    breadcrumbs,
    contentSections[] {
      _type,
      title,
      description,
      bulletPoints[] {
        boldText,
        subtext
      },
      stepNumber,
      stepTitle,
      stepImage {
        asset->{
          _id,
          url
        },
        alt
      },
      location,
      price,
      booking
    },
    moreReads {
      title,
      posts[]->{
        _id,
        title,
        heroImage {
          asset->{
            _id,
            url
          },
          alt
        },
        slug
      }
    },
    review {
      name,
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      reviewText,
      socialLink
    },
    tags[]->{
      _id,
      title,
      slug
    },
    featured
  }
`

export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _type,
    cardType,
    title,
    slug,
    subtitle,
    heroImage {
      asset->{
        _id,
        url
      },
      alt
    },
    cardImage {
      asset->{
        _id,
        url
      },
      alt
    },
    cardTitle,
    cardDescription,
    introduction,
    publishDate,
    category->{
      _id,
      title,
      slug
    },
    city-> {
      _id,
      name
    },
    breadcrumbs,
    contentSections[] {
      _type,
      title,
      description,
      bulletPoints[] {
        boldText,
        subtext
      },
      stepNumber,
      stepTitle,
      stepImage {
        asset->{
          _id,
          url
        },
        alt
      },
      location,
      price,
      booking
    },
    moreReads {
      title,
      posts[]->{
        _id,
        title,
        heroImage {
          asset->{
            _id,
            url
          },
          alt
        },
        slug
      }
    },
    review {
      name,
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      reviewText,
      socialLink
    },
    tags[]->{
      _id,
      title,
      slug
    },
    featured
  }
`

export const BLOG_POSTS_BY_CARD_TYPE_QUERY = `
  *[_type == "blogPost" && cardType == $cardType] | order(publishDate desc) {
    _id,
    title,
    slug,
    subtitle,
    heroImage {
      asset->{
        _id,
        url
      },
      alt
    },
    cardImage {
      asset->{
        _id,
        url
      },
      alt
    },
    cardTitle,
    cardDescription,
    publishDate,
    category->{
      title
    },
    city
  }
`

export const MAIN_PAGE_QUERY = `
  *[_type == "mainPage" && _id == "mainPage"][0] {
    _id,
    title,
    sections[] {
      _type,
      _key,
      _type == "mainCardSection" => {
        mainCard-> {
          _id,
          title,
          slug,
          subtitle,
          heroImage {
            asset-> {
              _id,
              url
            },
            alt
          },
          introduction,
          publishDate,
          category-> {
            _id,
            title,
            slug
          },
          city
        }
      },
      _type == "simpleCardsSection" => {
        sectionTitle,
        cards[]-> {
          _id,
          title,
          slug,
          cardImage {
            asset-> {
              _id,
              url
            },
            alt
          },
          cardTitle,
          publishDate,
          category-> {
            title
          },
          city
        }
      },
      _type == "carouselCardsSection" => {
        sectionTitle,
        cards[]-> {
          _id,
          title,
          slug,
          cardImage {
            asset-> {
              _id,
              url
            },
            alt
          },
          cardTitle,
          cardDescription,
          publishDate,
          category-> {
            title
          },
          city
        }
      },
      _type == "guideCardsSection" => {
        sectionTitle,
        cards[]-> {
          _id,
          title,
          slug,
          cardImage {
            asset-> {
              _id,
              url
            },
            alt
          },
          cardTitle,
          publishDate,
          category-> {
            title
          },
          city
        }
      },
      _type == "bestOfCardsSection" => {
        sectionTitle,
        cards[]-> {
          _id,
          title,
          slug,
          cardImage {
            asset-> {
              _id,
              url
            },
            alt
          },
          cardTitle,
          publishDate,
          city
        }
      }
    }
  }
`

// Data fetching functions
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await client.fetch(BLOG_POST_QUERY)
  return posts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug })
  return post
}

export async function getBlogPostsByCardType(cardType: string) {
  const posts = await client.fetch(BLOG_POSTS_BY_CARD_TYPE_QUERY, { cardType })
  return posts
}

export async function getBlogPostSlugs() {
  const slugs = await client.fetch(`
    *[_type == "blogPost" && defined(slug.current)][].slug.current
  `)
  return slugs
}

export async function getMainPageConfig(): Promise<MainPageConfig | null> {
  const config = await client.fetch(MAIN_PAGE_QUERY)
  return config
}

// City-related queries
export async function getAllCities() {
  const cities = await client.fetch(`
    *[_type == "city"] | order(name asc) {
      _id,
      name
    }
  `)
  return cities
}

// Test function to get all blog posts (for debugging)
export async function getAllBlogPostsForTesting() {
  const posts = await client.fetch(`
    *[_type == "blogPost"] | order(publishDate desc) [0...5] {
      _id,
      title,
      cardTitle,
      subtitle,
      city,
      "cityRef": city._ref,
      "cityData": city-> {
        _id,
        name
      }
    }
  `)
  return posts
}

// Search blog posts by title and optional city filter
export async function searchBlogPosts(searchQuery: string, cityName?: string) {
  let query = `
    *[_type == "blogPost" && (
      lower(title) match "*" + lower($searchQuery) + "*" ||
      lower(cardTitle) match "*" + lower($searchQuery) + "*" ||
      lower(subtitle) match "*" + lower($searchQuery) + "*"
    )`

  if (cityName) {
    query += ` && defined(city) && lower(city->name) match "*" + lower($cityName) + "*"`
  }

  query += `]`

  query += ` | order(publishDate desc) {
    _id,
    title,
    slug,
    subtitle,
    heroImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    cardImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    cardTitle,
    cardDescription,
    introduction,
    publishDate,
    category-> {
      _id,
      title,
      slug
    },
    city-> {
      _id,
      name
    },
    cardType
  }`

  const params: any = { searchQuery }
  if (cityName) {
    params.cityName = cityName
  }

  console.log("🔍 Search Query:", query)
  console.log("🔍 Search Params:", params)

  const posts = await client.fetch(query, params)
  console.log("🔍 Raw search results:", posts)
  return posts
}

// Get blog posts by city
export async function getBlogPostsByCity(cityId: string) {
  const posts = await client.fetch(`
    *[_type == "blogPost" && city._ref == $cityId] | order(publishDate desc) {
      _id,
      title,
      slug,
      subtitle,
      heroImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      cardImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      cardTitle,
      cardDescription,
      introduction,
      publishDate,
      category-> {
        _id,
        title,
        slug
      },
      city-> {
        _id,
        name
      },
      cardType
    }
  `, { cityId })
  return posts
}

// Helper function to get image URL
export function getImageUrl(image: any): string {
  if (!image?.asset?.url) return ''
  return image.asset.url
}

// Transform Sanity data to component props format
export function transformToCardData(posts: any[], cardType: 'simple' | 'carousel' | 'guide' | 'bestOf' | 'main' = 'simple') {
  return posts.map(post => {
    const baseData = {
      image: getImageUrl(post.cardImage || post.heroImage),
      title: post.cardTitle || post.title,
      slug: post.slug?.current
    }

    switch (cardType) {
      case 'main':
        return {
          image: getImageUrl(post.heroImage),
          title: post.title,
          subtitle: post.subtitle,
          publishDate: post.publishDate,
          slug: post.slug?.current
        }
      case 'carousel':
        return {
          ...baseData,
          description: post.cardDescription
        }
      case 'bestOf':
        return baseData
      case 'guide':
      case 'simple':
      default:
        return baseData
    }
  })
}