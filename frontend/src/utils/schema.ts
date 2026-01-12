import { introConfig } from '../config/intro';

const BASE_URL = 'https://loamstrategy.com';

/**
 * Generate Organization schema (Loam Strategy, LLC)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Loam Strategy, LLC',
    url: BASE_URL,
    logo: `${BASE_URL}/LoamStrategy4Logo.png`,
    description: 'Strategic business planning and coaching services',
    sameAs: [
      // Add social media profiles when available
      // 'https://www.linkedin.com/company/loam-strategy',
      // 'https://twitter.com/loamstrategy',
    ],
  };
}

/**
 * Generate Course/Educational schema (HomeRun Strategy Lab)
 */
export function generateCourseSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'HomeRun Strategy Lab',
    description: 'Transform your business clarity with a proven, step-by-step strategy framework. Complete 5 strategic modules to create a comprehensive 90-day action plan tailored to your business.',
    provider: {
      '@type': 'Organization',
      name: 'Loam Strategy, LLC',
      url: BASE_URL,
    },
    educationalLevel: 'Beginner',
    timeRequired: 'PT2H', // 2 hours in ISO 8601 duration format
    coursePrerequisites: 'None',
    teaches: [
      'Business Strategy',
      'Strategic Planning',
      'Business Clarity',
      '90-Day Action Planning',
      'Customer Analysis',
      'Offer Development',
    ],
    url: BASE_URL,
  };
}

/**
 * Generate FAQPage schema from introConfig FAQs
 */
export function generateFAQSchema() {
  if (!introConfig.faqs || introConfig.faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: introConfig.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HomeRun Strategy Lab',
    url: BASE_URL,
    description: 'Transform your business clarity with a proven, step-by-step strategy framework',
    publisher: {
      '@type': 'Organization',
      name: 'Loam Strategy, LLC',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(currentPath: string = '/') {
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
  ];

  // Add module breadcrumbs if on a module page
  if (currentPath.startsWith('/module/')) {
    const moduleNum = parseInt(currentPath.split('/module/')[1] || '0');
    const moduleNames = [
      'Current Reality',
      'Ideal Customer',
      'Core Offer',
      'Delivery Path',
      '90-Day Plan',
    ];
    
    if (moduleNames[moduleNum]) {
      breadcrumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: `Module ${moduleNum}: ${moduleNames[moduleNum]}`,
        item: `${BASE_URL}${currentPath}`,
      });
    }
  } else if (currentPath === '/summary') {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Final Summary',
      item: `${BASE_URL}${currentPath}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

/**
 * Inject JSON-LD script into document head
 */
export function injectSchemaScript(schema: any, id: string) {
  // Remove existing script if it exists
  const existingScript = document.getElementById(`schema-${id}`);
  if (existingScript) {
    existingScript.remove();
  }

  // Create new script element
  const script = document.createElement('script');
  script.id = `schema-${id}`;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove all schema scripts (cleanup)
 */
export function removeAllSchemaScripts() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach((script) => {
    if (script.id && script.id.startsWith('schema-')) {
      script.remove();
    }
  });
}


