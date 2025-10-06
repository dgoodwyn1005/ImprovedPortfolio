const { storage } = require('./storage');

const initialContent = [
  // Hero Section
  {
    page: 'home',
    section: 'hero',
    contentKey: 'greeting',
    title: "👋 Hello, I'm Deshawn Goodwyn",
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 1
  },
  {
    page: 'home',
    section: 'hero',
    contentKey: 'main_title',
    title: 'Web, AI, and Music — Crafted with Precision',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 2
  },
  {
    page: 'home',
    section: 'hero',
    contentKey: 'description',
    title: null,
    subtitle: null,
    description: 'Helping businesses and musicians succeed with custom websites, AI automation, and exceptional music services.',
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 3
  },
  {
    page: 'home',
    section: 'hero',
    contentKey: 'ai_button',
    title: null,
    subtitle: null,
    description: null,
    buttonText: 'AI & Web Services',
    buttonLink: '/ai',
    isVisible: true,
    order: 4
  },
  {
    page: 'home',
    section: 'hero',
    contentKey: 'music_button',
    title: null,
    subtitle: null,
    description: null,
    buttonText: 'Piano Services',
    buttonLink: '/music',
    isVisible: true,
    order: 5
  },
  {
    page: 'home',
    section: 'hero',
    contentKey: 'contact_button',
    title: null,
    subtitle: null,
    description: null,
    buttonText: 'Contact Me',
    buttonLink: '#contact',
    isVisible: true,
    order: 6
  },
  {
    page: 'home',
    section: 'hero',
    contentKey: 'portfolio_button',
    title: null,
    subtitle: null,
    description: null,
    buttonText: 'View Portfolio',
    buttonLink: '#portfolio',
    isVisible: true,
    order: 7
  },

  // About Section
  {
    page: 'home',
    section: 'about',
    contentKey: 'section_title',
    title: 'About Deshawn',
    subtitle: 'Multi-domain expertise combining technology, athletics, and music',
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 1
  },
  {
    page: 'home',
    section: 'about',
    contentKey: 'bio_paragraph_1',
    title: null,
    subtitle: null,
    description: 'With a unique blend of technical expertise and creative passion, I bring 15+ years of piano experience and 3+ years of programming to every project. My journey spans Computer Science studies at Virginia State University and a competitive NCAA Division I basketball background.',
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 2
  },
  {
    page: 'home',
    section: 'about',
    contentKey: 'bio_paragraph_2',
    title: null,
    subtitle: null,
    description: 'This diverse foundation has instilled unmatched work ethic, discipline, and the ability to excel across multiple domains—from building cutting-edge web applications to delivering exceptional musical performances.',
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 3
  },
  {
    page: 'home',
    section: 'about',
    contentKey: 'web_development_skill',
    title: 'Web Development',
    subtitle: '3+ Years',
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 4
  },
  {
    page: 'home',
    section: 'about',
    contentKey: 'ai_skill',
    title: 'AI Implementation',
    subtitle: 'Specialist',
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 5
  },
  {
    page: 'home',
    section: 'about',
    contentKey: 'piano_skill',
    title: 'Piano Performance',
    subtitle: '15+ Years',
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 6
  },

  // Navigation
  {
    page: 'global',
    section: 'navigation',
    contentKey: 'home_link',
    title: 'Home',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: '/',
    isVisible: true,
    order: 1
  },
  {
    page: 'global',
    section: 'navigation',
    contentKey: 'about_link',
    title: 'About',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: '#about',
    isVisible: true,
    order: 2
  },
  {
    page: 'global',
    section: 'navigation',
    contentKey: 'portfolio_link',
    title: 'Portfolio',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: '#portfolio',
    isVisible: true,
    order: 3
  },
  {
    page: 'global',
    section: 'navigation',
    contentKey: 'contact_link',
    title: 'Contact',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: '#contact',
    isVisible: true,
    order: 4
  },

  // Footer
  {
    page: 'global',
    section: 'footer',
    contentKey: 'copyright',
    title: '© 2024 Deshawn Goodwyn. All rights reserved.',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 1
  },
  {
    page: 'global',
    section: 'footer',
    contentKey: 'tagline',
    title: 'Web Developer • AI Specialist • Professional Pianist',
    subtitle: null,
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 2
  },

  // Testimonials
  {
    page: 'home',
    section: 'testimonials',
    contentKey: 'section_title',
    title: 'What Clients Say',
    subtitle: 'Real feedback from real people who\'ve experienced the difference',
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 1
  },

  // How It Works
  {
    page: 'home',
    section: 'how_it_works',
    contentKey: 'section_title',
    title: 'How It Works',
    subtitle: 'Three powerful platforms working together for your success',
    description: null,
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 1
  },
  {
    page: 'home',
    section: 'how_it_works',
    contentKey: 'website_platform',
    title: 'Website',
    subtitle: '(Hostinger)',
    description: 'Modern, mobile-ready, SEO-optimized site for your business. Fast, secure, and designed to convert visitors into customers.',
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 2
  },
  {
    page: 'home',
    section: 'how_it_works',
    contentKey: 'ai_platform',
    title: 'AI Features',
    subtitle: '(Replit)',
    description: 'Chatbots, automated replies, lead qualification, and blog generators. Smart AI tools that work 24/7 for your business.',
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 3
  },
  {
    page: 'home',
    section: 'how_it_works',
    contentKey: 'automation_platform',
    title: 'Smart Automation',
    subtitle: '(Zapier Integration)',
    description: 'Email/SMS automation, CRM syncing, and intelligent workflows. Connect your business tools and automate repetitive tasks seamlessly.',
    buttonText: null,
    buttonLink: null,
    isVisible: true,
    order: 4
  }
];

async function seedContent() {
  try {
    console.log('Starting content seeding...');
    
    for (const content of initialContent) {
      try {
        await storage.createPageContent(content);
        console.log(`✓ Created content: ${content.page}/${content.section}/${content.contentKey}`);
      } catch (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
          console.log(`- Content already exists: ${content.page}/${content.section}/${content.contentKey}`);
        } else {
          console.error(`✗ Failed to create content ${content.page}/${content.section}/${content.contentKey}:`, error.message);
        }
      }
    }
    
    console.log('Content seeding completed!');
  } catch (error) {
    console.error('Error seeding content:', error);
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedContent().then(() => {
    console.log('Seeding process finished');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedContent, initialContent };
