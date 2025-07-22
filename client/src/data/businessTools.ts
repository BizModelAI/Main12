// Real tools with actual URLs and descriptions for each business model
export interface BusinessTool {
  name: string;
  url: string;
  description: string;
  category: 'Essential' | 'Recommended' | 'Advanced';
  price: 'Free' | 'Freemium' | 'Paid';
}

export const businessTools: Record<string, BusinessTool[]> = {
  'freelancing': [
    {
      name: 'Upwork',
      url: 'https://www.upwork.com',
      description: 'The largest freelancing platform to find clients and projects across all skill areas',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Fiverr',
      url: 'https://www.fiverr.com',
      description: 'Gig-based marketplace perfect for selling specific services starting at $5',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Toggl Track',
      url: 'https://toggl.com',
      description: 'Time tracking software to monitor hours worked and improve productivity',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'FreshBooks',
      url: 'https://www.freshbooks.com',
      description: 'Accounting software for invoicing, expense tracking, and financial management',
      category: 'Recommended',
      price: 'Paid'
    },
    {
      name: 'Slack',
      url: 'https://slack.com',
      description: 'Communication platform for collaborating with clients and teams',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Calendly',
      url: 'https://calendly.com',
      description: 'Scheduling tool to let clients book meetings automatically',
      category: 'Recommended',
      price: 'Freemium'
    }
  ],
  'affiliate-marketing': [
    {
      name: 'WordPress',
      url: 'https://wordpress.com',
      description: 'Website building platform essential for creating affiliate marketing content',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'ConvertKit',
      url: 'https://convertkit.com',
      description: 'Email marketing platform designed for creators and affiliate marketers',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Google Analytics',
      url: 'https://analytics.google.com',
      description: 'Track website traffic, user behavior, and conversion metrics',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Design tool for creating graphics, social media posts, and marketing materials',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'ThirstyAffiliates',
      url: 'https://thirstyaffiliates.com',
      description: 'WordPress plugin for managing and cloaking affiliate links',
      category: 'Recommended',
      price: 'Paid'
    },
    {
      name: 'SEMrush',
      url: 'https://www.semrush.com',
      description: 'SEO and keyword research tool to optimize content for search engines',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'online-course': [
    {
      name: 'Teachable',
      url: 'https://teachable.com',
      description: 'Course platform to create, market, and sell online courses',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Loom',
      url: 'https://www.loom.com',
      description: 'Screen recording software for creating course videos quickly',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Zoom',
      url: 'https://zoom.us',
      description: 'Video conferencing for live sessions and student interaction',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Design course materials, presentations, and marketing graphics',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Typeform',
      url: 'https://www.typeform.com',
      description: 'Create surveys and quizzes to engage students and gather feedback',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Camtasia',
      url: 'https://www.techsmith.com/video-editor.html',
      description: 'Professional video editing software for polished course content',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'dropshipping': [
    {
      name: 'Shopify',
      url: 'https://www.shopify.com',
      description: 'E-commerce platform to build and manage your dropshipping store',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'Oberlo',
      url: 'https://www.oberlo.com',
      description: 'Shopify app for finding and importing products from suppliers',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'AliExpress',
      url: 'https://www.aliexpress.com',
      description: 'Source products from suppliers worldwide for dropshipping',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Facebook Ads Manager',
      url: 'https://www.facebook.com/business/tools/ads-manager',
      description: 'Create and manage paid advertising campaigns to drive traffic',
      category: 'Recommended',
      price: 'Free'
    },
    {
      name: 'Google Ads',
      url: 'https://ads.google.com',
      description: 'Search advertising platform to reach customers actively searching',
      category: 'Recommended',
      price: 'Free'
    },
    {
      name: 'Spocket',
      url: 'https://www.spocket.co',
      description: 'Premium dropshipping app with faster shipping from US/EU suppliers',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'consulting': [
    {
      name: 'Zoom',
      url: 'https://zoom.us',
      description: 'Video conferencing for client meetings and consultations',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Calendly',
      url: 'https://calendly.com',
      description: 'Automated scheduling for consultation bookings',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com',
      description: 'Professional networking to find clients and establish credibility',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Notion',
      url: 'https://www.notion.so',
      description: 'All-in-one workspace for project management and client documentation',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'DocuSign',
      url: 'https://www.docusign.com',
      description: 'Electronic signature platform for contracts and agreements',
      category: 'Recommended',
      price: 'Paid'
    },
    {
      name: 'HubSpot CRM',
      url: 'https://www.hubspot.com/products/crm',
      description: 'Customer relationship management to track leads and clients',
      category: 'Advanced',
      price: 'Freemium'
    }
  ],
  'social-media-management': [
    {
      name: 'Buffer',
      url: 'https://buffer.com',
      description: 'Schedule and manage social media posts across multiple platforms',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Hootsuite',
      url: 'https://hootsuite.com',
      description: 'Comprehensive social media management dashboard',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Create professional social media graphics and content',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Later',
      url: 'https://later.com',
      description: 'Visual content calendar and Instagram scheduling tool',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Sprout Social',
      url: 'https://sproutsocial.com',
      description: 'Advanced social media management with analytics and monitoring',
      category: 'Advanced',
      price: 'Paid'
    },
    {
      name: 'Unsplash',
      url: 'https://unsplash.com',
      description: 'Free high-quality stock photos for social media content',
      category: 'Recommended',
      price: 'Free'
    }
  ],
  'amazon-fba': [
    {
      name: 'Helium 10',
      url: 'https://www.helium10.com',
      description: 'Comprehensive Amazon FBA research and optimization tools',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'Jungle Scout',
      url: 'https://www.junglescout.com',
      description: 'Product research and keyword tracking for Amazon sellers',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'Seller Central',
      url: 'https://sellercentral.amazon.com',
      description: 'Amazon\'s official seller management platform',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Keepa',
      url: 'https://keepa.com',
      description: 'Track Amazon product prices and sales history',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'AMZScout',
      url: 'https://amzscout.net',
      description: 'Product research and market analysis tools',
      category: 'Recommended',
      price: 'Paid'
    },
    {
      name: 'Sellics',
      url: 'https://sellics.com',
      description: 'All-in-one Amazon optimization and management platform',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'podcasting': [
    {
      name: 'Anchor',
      url: 'https://anchor.fm',
      description: 'Free podcast hosting and distribution platform by Spotify',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Audacity',
      url: 'https://www.audacityteam.org',
      description: 'Free audio recording and editing software',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Zoom',
      url: 'https://zoom.us',
      description: 'Video conferencing for remote podcast interviews',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Design podcast cover art and promotional graphics',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Mailchimp',
      url: 'https://mailchimp.com',
      description: 'Email marketing to build and engage your podcast audience',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Descript',
      url: 'https://www.descript.com',
      description: 'Advanced audio editing with transcription and collaboration',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'blogging': [
    {
      name: 'WordPress',
      url: 'https://wordpress.com',
      description: 'Most popular blogging platform with extensive customization',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Yoast SEO',
      url: 'https://yoast.com',
      description: 'WordPress plugin for SEO optimization and content analysis',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Mailchimp',
      url: 'https://mailchimp.com',
      description: 'Email marketing to build and engage your blog audience',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Design blog graphics, featured images, and social media content',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Google Analytics',
      url: 'https://analytics.google.com',
      description: 'Track blog traffic, user behavior, and content performance',
      category: 'Recommended',
      price: 'Free'
    },
    {
      name: 'SEMrush',
      url: 'https://www.semrush.com',
      description: 'Advanced SEO and keyword research for content optimization',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'real-estate-investing': [
    {
      name: 'Zillow',
      url: 'https://www.zillow.com',
      description: 'Property search and market analysis platform',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'BiggerPockets',
      url: 'https://www.biggerpockets.com',
      description: 'Real estate investing community and education platform',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'RentSpree',
      url: 'https://rentspree.com',
      description: 'Tenant screening and rental application management',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'QuickBooks',
      url: 'https://quickbooks.intuit.com',
      description: 'Financial management and accounting for real estate businesses',
      category: 'Recommended',
      price: 'Paid'
    },
    {
      name: 'Cozy',
      url: 'https://cozy.co',
      description: 'Property management software for landlords',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'PropStream',
      url: 'https://www.propstream.com',
      description: 'Advanced real estate data and lead generation',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'online-course-creation': [
    {
      name: 'Teachable',
      url: 'https://teachable.com',
      description: 'Course platform to create, market, and sell online courses',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Camtasia',
      url: 'https://www.techsmith.com/video-editor.html',
      description: 'Professional screen recording and video editing software',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'Loom',
      url: 'https://www.loom.com',
      description: 'Quick screen recording for course content creation',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Design course materials, presentations, and marketing graphics',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Mailchimp',
      url: 'https://mailchimp.com',
      description: 'Email marketing to promote courses and engage students',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Kajabi',
      url: 'https://kajabi.com',
      description: 'All-in-one platform for course creation and business management',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'copywriting': [
    {
      name: 'Google Docs',
      url: 'https://docs.google.com',
      description: 'Collaborative writing and document sharing platform',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Grammarly',
      url: 'https://www.grammarly.com',
      description: 'Writing assistant for grammar and style improvement',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Hemingway Editor',
      url: 'https://hemingwayapp.com',
      description: 'Simplify and improve writing clarity',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Trello',
      url: 'https://trello.com',
      description: 'Project management for organizing writing projects',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Stripe',
      url: 'https://stripe.com',
      description: 'Payment processing for copywriting services',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Jasper',
      url: 'https://www.jasper.ai',
      description: 'AI writing assistant for content creation',
      category: 'Advanced',
      price: 'Paid'
    }
  ],
  'ghostwriting': [
    {
      name: 'Google Docs',
      url: 'https://docs.google.com',
      description: 'Collaborative writing and document sharing platform',
      category: 'Essential',
      price: 'Free'
    },
    {
      name: 'Scrivener',
      url: 'https://www.literatureandlatte.com/scrivener/',
      description: 'Professional writing software for long-form content',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'Zoom',
      url: 'https://zoom.us',
      description: 'Video conferencing for client meetings and interviews',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Trello',
      url: 'https://trello.com',
      description: 'Project management for organizing writing projects',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'PayPal',
      url: 'https://www.paypal.com',
      description: 'Secure payment processing for ghostwriting services',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Grammarly',
      url: 'https://www.grammarly.com',
      description: 'Writing assistant for grammar and style improvement',
      category: 'Advanced',
      price: 'Freemium'
    }
  ],
  'e-commerce': [
    {
      name: 'Shopify',
      url: 'https://www.shopify.com',
      description: 'Complete e-commerce platform to build and manage online stores',
      category: 'Essential',
      price: 'Paid'
    },
    {
      name: 'WooCommerce',
      url: 'https://woocommerce.com',
      description: 'WordPress e-commerce plugin for customizable online stores',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Mailchimp',
      url: 'https://mailchimp.com',
      description: 'Email marketing to engage customers and drive sales',
      category: 'Essential',
      price: 'Freemium'
    },
    {
      name: 'Google Analytics',
      url: 'https://analytics.google.com',
      description: 'Track website traffic, conversions, and customer behavior',
      category: 'Recommended',
      price: 'Free'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      description: 'Design product images, marketing materials, and social media content',
      category: 'Recommended',
      price: 'Freemium'
    },
    {
      name: 'Klaviyo',
      url: 'https://www.klaviyo.com',
      description: 'Advanced email marketing and SMS for e-commerce',
      category: 'Advanced',
      price: 'Paid'
    }
  ]
};

// Default tools for business models not explicitly defined
export const defaultBusinessTools: BusinessTool[] = [
  {
    name: 'Google Workspace',
    url: 'https://workspace.google.com',
    description: 'Suite of productivity tools including Gmail, Drive, and Docs',
    category: 'Essential',
    price: 'Freemium'
  },
  {
    name: 'Slack',
    url: 'https://slack.com',
    description: 'Communication platform for team collaboration',
    category: 'Recommended',
    price: 'Freemium'
  },
  {
    name: 'Notion',
    url: 'https://www.notion.so',
    description: 'All-in-one workspace for notes, tasks, and project management',
    category: 'Recommended',
    price: 'Freemium'
  },
  {
    name: 'Canva',
    url: 'https://www.canva.com',
    description: 'Design tool for creating professional graphics and marketing materials',
    category: 'Recommended',
    price: 'Freemium'
  }
];