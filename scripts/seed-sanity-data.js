#!/usr/bin/env node

const { createClient } = require('@sanity/client');
// Initialize Sanity client
const client = createClient({
  projectId: '4z4f081m',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: 'skzo3Fu5cf0T0LGHTxXsfYwVhWphAAeey2qd6ZtLm9lvsxcbCjrj6MCzyKmnmWcjtkeIUGFzOwYJRl2wmv0rlGlTRxwnbYMwv79b28HERj5wEH1ZA1A6229evt9LA2PmyC0eFNsxEsoYURtCt8ERVxhZTz0ewpnbBHUHT1rIamfQQ7X0YFBC',
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Sample data
const categories = [
  {
    _type: 'category',
    title: 'Travel Guide',
    slug: { current: 'travel-guide' },
    description: 'Comprehensive travel guides for destinations worldwide'
  },
  {
    _type: 'category',
    title: 'City Guide',
    slug: { current: 'city-guide' },
    description: 'In-depth city guides with local insights'
  },
  {
    _type: 'category',
    title: 'Food & Dining',
    slug: { current: 'food-dining' },
    description: 'Restaurant reviews and culinary experiences'
  },
  {
    _type: 'category',
    title: 'Budget Travel',
    slug: { current: 'budget-travel' },
    description: 'Affordable travel tips and budget-friendly destinations'
  },
  {
    _type: 'category',
    title: 'Luxury Travel',
    slug: { current: 'luxury-travel' },
    description: 'Premium travel experiences and luxury accommodations'
  }
];

const tags = [
  // Destinations
  { _type: 'tag', title: 'Rome', slug: { current: 'rome' } },
  { _type: 'tag', title: 'Italy', slug: { current: 'italy' } },
  { _type: 'tag', title: 'Vatican City', slug: { current: 'vatican-city' } },
  { _type: 'tag', title: 'Paris', slug: { current: 'paris' } },
  { _type: 'tag', title: 'London', slug: { current: 'london' } },
  { _type: 'tag', title: 'Barcelona', slug: { current: 'barcelona' } },
  { _type: 'tag', title: 'Amsterdam', slug: { current: 'amsterdam' } },

  // Travel Types
  { _type: 'tag', title: 'Budget Travel', slug: { current: 'budget-travel' } },
  { _type: 'tag', title: 'Luxury Travel', slug: { current: 'luxury-travel' } },
  { _type: 'tag', title: 'Family Travel', slug: { current: 'family-travel' } },
  { _type: 'tag', title: 'Solo Travel', slug: { current: 'solo-travel' } },
  { _type: 'tag', title: 'Couple Travel', slug: { current: 'couple-travel' } },

  // Accommodations
  { _type: 'tag', title: 'Hotels', slug: { current: 'hotels' } },
  { _type: 'tag', title: 'Monasteries', slug: { current: 'monasteries' } },
  { _type: 'tag', title: 'Convents', slug: { current: 'convents' } },
  { _type: 'tag', title: 'Retreats', slug: { current: 'retreats' } },
  { _type: 'tag', title: 'Accommodation', slug: { current: 'accommodation' } },

  // Activities
  { _type: 'tag', title: 'Museums', slug: { current: 'museums' } },
  { _type: 'tag', title: 'Historical Sites', slug: { current: 'historical-sites' } },
  { _type: 'tag', title: 'Food Tours', slug: { current: 'food-tours' } },
  { _type: 'tag', title: 'Walking Tours', slug: { current: 'walking-tours' } },
  { _type: 'tag', title: 'Art Galleries', slug: { current: 'art-galleries' } },

  // Special Events
  { _type: 'tag', title: 'Jubilee 2025', slug: { current: 'jubilee-2025' } },
  { _type: 'tag', title: 'Religious Tourism', slug: { current: 'religious-tourism' } },
  { _type: 'tag', title: 'Cultural Events', slug: { current: 'cultural-events' } },

  // Practical
  { _type: 'tag', title: 'Travel Tips', slug: { current: 'travel-tips' } },
  { _type: 'tag', title: 'Transportation', slug: { current: 'transportation' } },
  { _type: 'tag', title: 'Currency', slug: { current: 'currency' } },
  { _type: 'tag', title: 'Language', slug: { current: 'language' } }
];

// Sample blog posts
const createBlogPosts = (categoryRefs, tagRefs) => [
  {
    _type: 'blogPost',
    cardType: 'mainCard',
    title: 'Jubilee 2025: Stay in Rome\'s Monasteries, Convents & Retreats',
    slug: { current: 'where-to-stay-in-rome-for-jubilee' },
    subtitle: 'Discover unique spiritual accommodations in Rome for the Jubilee 2025 celebration. From historic monasteries to peaceful convents, find your perfect sacred stay in the Eternal City.',
    introduction: 'The Holy Year, or Jubilee Year, is a special time for Catholic pilgrims to journey to Rome and deepen their faith. With the next Jubilee Year arriving in 2025, millions are expected to flock to the Eternal City. While hotels offer practical solutions, for a truly immersive experience, think about staying at monasteries, convents, and spiritual retreat centers.',
    publishDate: '2024-12-15T00:00:00Z',
    category: categoryRefs.find(c => c.title === 'Travel Guide')._ref,
    breadcrumbs: [
      { label: 'Things to do in Rome', href: '/' },
      { label: 'Monasteries and Convents', href: '/' },
      { label: 'Vatican Jubilee 2025', href: '/', isCurrentPage: true }
    ],
    contentSections: [
      {
        _type: 'textSection',
        title: 'The Allure of Monasteries and Convents',
        description: 'Staying in a monastery or convent in Rome offers a unique window into the city\'s spiritual heritage. These sacred spaces have welcomed pilgrims for centuries, providing not just accommodation but a deeper connection to faith and history.'
      },
      {
        _type: 'bulletedSection',
        title: 'What to Expect',
        description: 'Here are the key features you can expect when staying at religious accommodations:',
        bulletPoints: [
          { boldText: 'Location:', subtext: 'Central Rome, often near major basilicas' },
          { boldText: 'Price Range:', subtext: '€40-120 per night' },
          { boldText: 'Amenities:', subtext: 'Simple rooms, shared bathrooms, chapel access' },
          { boldText: 'Rules:', subtext: 'Quiet hours, modest dress code, respectful behavior' }
        ]
      }
    ],
    tableOfContents: [
      { id: 'the-allure-of-monasteries-and-convents', title: 'The Allure of Monasteries and Convents' },
      { id: 'what-to-expect', title: 'What to Expect' }
    ],
    tags: [
      tagRefs.find(t => t.title === 'Rome')._ref,
      tagRefs.find(t => t.title === 'Monasteries')._ref,
      tagRefs.find(t => t.title === 'Jubilee 2025')._ref,
      tagRefs.find(t => t.title === 'Religious Tourism')._ref
    ],
    featured: true
  },
  {
    _type: 'blogPost',
    cardType: 'simple',
    title: 'Best Budget Hotels in Rome for 2025',
    slug: { current: 'best-budget-hotels-rome-2025' },
    subtitle: 'Affordable accommodation options without compromising comfort',
    cardTitle: 'Budget Hotels Rome 2025',
    introduction: 'Rome doesn\'t have to break the bank. With careful planning and the right knowledge, you can find comfortable, well-located accommodations that won\'t drain your travel budget.',
    publishDate: '2024-12-10T00:00:00Z',
    category: categoryRefs.find(c => c.title === 'Budget Travel')._ref,
    contentSections: [
      {
        _type: 'textSection',
        title: 'Top Budget Areas',
        description: 'The best neighborhoods for budget travelers include Trastevere, San Lorenzo, and areas near Termini Station. These areas offer great value while keeping you connected to Rome\'s main attractions.'
      }
    ],
    tags: [
      tagRefs.find(t => t.title === 'Rome')._ref,
      tagRefs.find(t => t.title === 'Budget Travel')._ref,
      tagRefs.find(t => t.title === 'Hotels')._ref
    ]
  },
  {
    _type: 'blogPost',
    cardType: 'carousel',
    title: 'Ultimate Food Tour Guide: Rome\'s Hidden Gems',
    slug: { current: 'rome-food-tour-hidden-gems' },
    subtitle: 'Discover authentic Roman cuisine beyond the tourist trail',
    cardTitle: 'Rome Food Tour Hidden Gems',
    cardDescription: 'Taste authentic Roman cuisine away from tourist traps with our comprehensive guide to the city\'s best hidden culinary treasures.',
    introduction: 'Roman cuisine is more than just pasta and pizza. The city\'s culinary landscape is rich with hidden gems, family-run trattorias, and authentic experiences that most tourists never discover.',
    publishDate: '2024-12-08T00:00:00Z',
    category: categoryRefs.find(c => c.title === 'Food & Dining')._ref,
    contentSections: [
      {
        _type: 'stepSection',
        title: 'Food Tour Steps',
        stepNumber: 1,
        stepTitle: 'Morning Market Visit',
        description: 'Start your culinary journey at Campo de\' Fiori market, where locals have been shopping for fresh ingredients for centuries.',
        location: 'Campo de\' Fiori, Rome',
        price: 'Free to browse',
        booking: {
          text: 'Visit the market early in the morning for the best selection. Guided tours are available for those who want detailed explanations of local ingredients.',
          linkText: 'Book Market Tour',
          link: 'https://example.com/market-tour'
        }
      }
    ],
    tags: [
      tagRefs.find(t => t.title === 'Rome')._ref,
      tagRefs.find(t => t.title === 'Food Tours')._ref,
      tagRefs.find(t => t.title === 'Italy')._ref
    ]
  },
  {
    _type: 'blogPost',
    cardType: 'guide',
    title: 'Paris vs Rome: Which City Should You Visit First?',
    slug: { current: 'paris-vs-rome-comparison' },
    subtitle: 'A detailed comparison of Europe\'s two most iconic cities',
    cardTitle: 'Paris vs Rome Travel Guide',
    introduction: 'Both Paris and Rome offer incredible experiences, but which should you visit first? This comprehensive comparison will help you decide based on your interests, budget, and travel style.',
    publishDate: '2024-12-05T00:00:00Z',
    category: categoryRefs.find(c => c.title === 'Travel Guide')._ref,
    contentSections: [
      {
        _type: 'textSection',
        title: 'Cultural Differences',
        description: 'Paris embodies elegance and sophistication, while Rome pulses with ancient history and vibrant street life. Understanding these cultural nuances will help shape your expectations and travel experience.'
      }
    ],
    tags: [
      tagRefs.find(t => t.title === 'Rome')._ref,
      tagRefs.find(t => t.title === 'Paris')._ref,
      tagRefs.find(t => t.title === 'Travel Tips')._ref
    ]
  },
  {
    _type: 'blogPost',
    cardType: 'bestOf',
    title: 'Best Theme Parks in the World',
    slug: { current: 'best-theme-parks-world' },
    subtitle: 'Top theme parks that should be on every family\'s bucket list',
    cardTitle: 'World\'s Best Theme Parks',
    introduction: 'From the magic of Disney to the thrills of Universal Studios, the world\'s best theme parks offer unforgettable experiences for visitors of all ages.',
    publishDate: '2024-12-01T00:00:00Z',
    category: categoryRefs.find(c => c.title === 'Travel Guide')._ref,
    contentSections: [
      {
        _type: 'textSection',
        title: 'Top Global Destinations',
        description: 'Our selection includes parks from across the globe, each offering unique attractions, immersive experiences, and world-class entertainment that makes them stand out from the rest.'
      }
    ],
    tags: [
      tagRefs.find(t => t.title === 'Family Travel')._ref,
      tagRefs.find(t => t.title === 'Travel Tips')._ref
    ]
  }
];

async function seedData() {
  try {
    console.log('🚀 Starting Sanity data seeding...\n');

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = [];
    for (const category of categories) {
      const result = await client.create(category);
      createdCategories.push({ ...category, _ref: { _type: 'reference', _ref: result._id } });
      console.log(`✅ Created category: ${category.title}`);
    }

    // Create tags
    console.log('\n🏷️  Creating tags...');
    const createdTags = [];
    for (const tag of tags) {
      const result = await client.create(tag);
      createdTags.push({ ...tag, _ref: { _type: 'reference', _ref: result._id } });
      console.log(`✅ Created tag: ${tag.title}`);
    }

    // Create blog posts
    console.log('\n📝 Creating blog posts...');
    const blogPosts = createBlogPosts(createdCategories, createdTags);
    for (const post of blogPosts) {
      const result = await client.create(post);
      console.log(`✅ Created blog post: ${post.title}`);
    }

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Tags: ${tags.length}`);
    console.log(`   Blog Posts: ${blogPosts.length}`);
    console.log('\n🎯 Next steps:');
    console.log('   1. Run "npm run sanity:dev" to start Sanity Studio');
    console.log('   2. Visit http://localhost:3333 to see your content');
    console.log('   3. Test the blog pages to see dynamic data');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}



seedData();