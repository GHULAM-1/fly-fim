export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Tag {
  _id: string
  _type: 'tag'
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Breadcrumb {
  label: string
  href: string
  isCurrentPage?: boolean
}

export interface TableOfContents {
  id: string
  title: string
  level: number
}

export interface TextSection {
  _type: 'textSection'
  id: string
  title: string
  content: string
}

export interface ListSection {
  _type: 'listSection'
  id: string
  title: string
  content?: string
  list: string[]
}

export interface StepDetails {
  location: string
  price: string
  booking: string
}

export interface StepSection {
  _type: 'stepSection'
  id: string
  title: string
  stepNumber: number
  stepTitle: string
  stepImage?: SanityImage
  stepDescription: string
  stepDetails?: StepDetails
}

export type ContentSection = TextSection | ListSection | StepSection

export interface MoreReadsPost {
  title: string
  image: SanityImage
}

export interface MoreReads {
  title: string
  posts: MoreReadsPost[]
}

export interface Review {
  name: string
  image: SanityImage
  reviewText: string
  socialLink: string
}

export interface BlogPost {
  _id: string
  _type: 'blogPost'
  cardType: string
  title: string
  slug: {
    current: string
  }
  subtitle?: string
  heroImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  cardImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  cardTitle?: string
  cardDescription?: string
  introduction: string
  publishDate: string
  category: {
    _id: string
    title: string
    slug: {
      current: string
    }
  }
  city?: string
  breadcrumbs?: Array<{
    label: string
    href: string
    isCurrentPage?: boolean
  }>
  contentSections?: Array<{
    _type: string
    title: string
    description?: string
    bulletPoints?: Array<{
      boldText: string
      subtext: string
    }>
    stepNumber?: number
    stepTitle?: string
    stepImage?: {
      asset: {
        _id: string
        url: string
      }
      alt?: string
    }
    location?: string
    price?: string
    booking?: {
      text: string
      linkText: string
      link: string
    }
  }>
  moreReads?: {
    title: string
    posts?: Array<{
      _id: string
      title: string
      heroImage?: {
        asset: {
          _id: string
          url: string
        }
        alt?: string
      }
      slug: {
        current: string
      }
    }>
  }
  review?: {
    name: string
    image?: {
      asset: {
        _id: string
        url: string
      }
      alt?: string
    }
    reviewText: string
    socialLink?: string
  }
  tags?: Array<{
    _id: string
    title: string
    slug: {
      current: string
    }
  }>
  featured?: boolean
}

// Card types for main page
export interface CardData {
  title?: string
  image: string
  description: string
}

export interface MainCardData extends CardData {
  publishDate: string
}

export interface BestOfCardData {
  title: string
  image: string
}

// Main Page Configuration Types
export interface MainPageConfig {
  _id: string
  title: string
  sections: MainPageSection[]
}

export type MainPageSection =
  | MainCardSection
  | SimpleCardsSection
  | CarouselCardsSection
  | GuideCardsSection
  | BestOfCardsSection

export interface MainCardSection {
  _type: 'mainCardSection'
  _key: string
  mainCard: BlogPost
}

export interface SimpleCardsSection {
  _type: 'simpleCardsSection'
  _key: string
  sectionTitle: string
  cards: BlogPost[]
}

export interface CarouselCardsSection {
  _type: 'carouselCardsSection'
  _key: string
  sectionTitle: string
  cards: BlogPost[]
}

export interface GuideCardsSection {
  _type: 'guideCardsSection'
  _key: string
  sectionTitle: string
  cards: BlogPost[]
}

export interface BestOfCardsSection {
  _type: 'bestOfCardsSection'
  _key: string
  sectionTitle: string
  cards: BlogPost[]
}