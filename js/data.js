/**
 * Portfolio content — single source of truth.
 *
 * RULES (do not break these):
 *  1. Every project the owner has built belongs here. Do not trim the archive.
 *  2. `status` must reflect a real check. Never label a dead site "live".
 *  3. Every status carries `verified` (the date it was last checked).
 *  4. One contact email: meta.email. Never hard-code another address.
 */

export const meta = {
  name: 'Muhammad Usama',
  role: 'Full-Stack & Automation Engineer',
  location: 'Karachi, Pakistan',
  email: 'tahir12721@gmail.com',
  phone: '+92 320 7101485',
  whatsapp: 'https://wa.me/923207101485',
  linkedin: 'https://www.linkedin.com/in/muhammad-usama-5996bb24b/',
  github: 'https://github.com/MUHAMMADUSAMA64874',
  resume: './Muhammad-Usama-CV.pdf',
  headline: 'Full-Stack WordPress Developer & AI Automation Engineer',
  years: '4+',
  availability: 'Available now · 0-day notice',
  workModes: 'Remote worldwide · Hybrid / on-site in Karachi',
  timezone: 'PKT (UTC+5)',
  site: 'https://muhammadusama64874.github.io/Portfolio/',
  lastAudit: '2026-10-27',
  auditNote: 'Statuses marked Offline represent preserved projects whose work and codebase still exist.'
};

export const statusMeta = {
  live: { label: 'Live', tone: 'live', description: 'Public site is online and serving.' },
  staging: { label: 'Staging', tone: 'staging', description: 'Preview or client staging build.' },
  local: { label: 'Local build', tone: 'local', description: 'Runs locally — offline project.' },
  archive: { label: 'Archive', tone: 'archive', description: 'Preserved / restored project.' },
  github: { label: 'GitHub', tone: 'github', description: 'Source available on GitHub.' },
  down: { label: 'Offline', tone: 'down', description: 'Offline — archived client project.' }
};

export const about = [
  "I'm a <strong>Full-Stack & Automation Engineer</strong> from Karachi, Pakistan, with 4+ years of hands-on experience building scalable web systems, AI-powered automation workflows, and custom WordPress solutions that solve real business problems.",
  "My work spans <strong>PHP, Laravel, JavaScript, Python, WordPress, WooCommerce, n8n, OpenCV, Firebase, MySQL, MSSQL, REST APIs</strong>, and AI-integrated backend systems. I build clean WordPress themes and custom functionality without depending on page builders when a more reliable architecture is needed.",
  "Recently, I have been focused on <strong>AI automation workflows</strong>, connecting LLMs, APIs, databases, web scraping tools, and backend systems to reduce manual work and increase operational efficiency.",
  "I focus on systems that are <strong>cleanly structured, performance-optimized, scalable, and automation-ready</strong>. Whether the project is a WooCommerce build, a REST API, an n8n workflow, or a custom backend integration, I care about reliability as much as the interface.",
  "I am currently completing my degree at PAF-Karachi Institute of Economics & Technology while working across full-stack development, advanced WordPress development, backend engineering, and AI automation projects."
];

export const skills = [
  {
    title: 'Full-Stack Development',
    tags: ['PHP', 'Laravel', 'JavaScript', 'Python', 'REST APIs', 'Responsive Interfaces']
  },
  {
    title: 'AI Automation',
    tags: ['n8n', 'Make.com', 'LLM Workflows', 'Ollama', 'API Integrations', 'Chatbots']
  },
  {
    title: 'WordPress Development',
    tags: ['Custom Themes', 'Plugin Customization', 'WooCommerce', 'Performance Optimization']
  },
  {
    title: 'Data & Computer Vision',
    tags: ['MySQL', 'MSSQL', 'Firebase', 'OpenCV', 'Scraping Pipelines', 'Data Analysis']
  },
  {
    title: 'Engineering Tools',
    tags: ['Version Control', 'React.js', 'jQuery', 'Backend Architecture', 'Deployment Support']
  }
];

export const experience = [
  {
    role: 'WordPress Developer',
    company: 'Codencoders',
    location: 'Karachi, Pakistan',
    period: 'February 2026 – Present',
    description: 'Advanced WordPress development, enterprise client site delivery, and custom plugin functionality without page builder bloat.',
    skills: ['WordPress', 'PHP 8', 'WooCommerce', 'REST APIs', 'Custom Theme Architecture']
  },
  {
    role: 'n8n Automation Engineer',
    company: 'Decotechs',
    location: 'Karachi, Pakistan',
    period: 'September 2025 – February 2026',
    description: 'Architected and deployed 81+ AI-driven automation workflows with n8n, Make.com, LLMs, web scrapers, and multi-channel notification bots.',
    skills: ['n8n', 'Make.com', 'OpenAI API', 'Web Scraping', 'MySQL', 'Telegram / Slack Bots']
  },
  {
    role: 'WordPress Developer',
    company: 'Diznik',
    location: 'Karachi, Pakistan',
    period: 'July 2024 – July 2025',
    description: 'Bespoke WordPress theme and e-commerce development, speed optimization, and responsive design systems.',
    skills: ['WordPress', 'PHP', 'JavaScript', 'ACF Pro', 'CSS3 / Responsive']
  },
  {
    role: 'Web Developer',
    company: 'XPACE TECHNOLOGIES (Pvt) Ltd',
    location: 'Karachi, Pakistan',
    period: 'May 2024 – July 2024',
    description: 'Full-stack web engineering across responsive frontend interfaces, database models, and backend endpoints.',
    skills: ['Full-Stack', 'Laravel', 'JavaScript', 'MySQL', 'Bootstrap']
  },
  {
    role: 'WordPress Developer',
    company: 'BrandSoft Solutions',
    location: 'Karachi, Pakistan',
    period: 'October 2023 – February 2024',
    description: 'Theme customization, custom WooCommerce flows, bug resolution, and live production deployments.',
    skills: ['WordPress', 'WooCommerce', 'Theme Customization', 'PHP']
  },
  {
    role: 'SEO & WordPress Intern',
    company: 'DigiSkills.pk',
    location: 'Online',
    period: 'November 2022 – January 2023',
    description: 'SEO fundamentals, on-page optimization, content structure, and core WordPress workflows.',
    skills: ['SEO', 'On-Page Optimization', 'WordPress Core']
  }
];

export const projects = [
  // ── Featured flagship work ──────────────────────────────────────────────
  {
    id: 'n8n-workflow-hub',
    title: 'Production n8n Workflow Hub',
    subtitle: '81+ deployed automation pipelines',
    category: 'AI & Automation',
    status: 'local',
    featured: true,
    role: 'Automation architecture & delivery',
    summary: 'A production library of 81+ n8n pipelines connecting LLMs, scrapers, databases, CRMs and messaging platforms. Built while working as an n8n Automation Engineer at Decotechs.',
    highlights: [
      '81+ workflows shipped across lead capture, content, scraping and reporting',
      'Patterns for retries, error branches and idempotent re-runs',
      'LLM steps wrapped with validation before anything reaches a client system'
    ],
    tech: ['n8n', 'Make.com', 'LLMs', 'REST APIs', 'Web scraping', 'MySQL'],
    image: 'assets/images/n8n-workflow-hub.webp',
    thumb: 'assets/images/thumbs/n8n-workflow-hub.webp',
    link: './n8n-hub.html',
    linkLabel: 'Open Workflow Hub',
    gallery: []
  },
  {
    id: 'chef-academy',
    title: 'Chef Academy London & Online',
    subtitle: 'UK enterprise CMS, booking engine and 160KB front end',
    category: 'WordPress & CMS',
    status: 'live',
    featured: true,
    role: 'WordPress development & performance',
    summary: 'A UK cookery school running courses, gift vouchers and online classes. Custom theme work plus a booking flow that ships inside a ~160KB page budget.',
    highlights: [
      'Custom WordPress theme with structured course and class templates',
      'Booking and voucher flows kept light enough to stay fast on mobile',
      'Content modelling that lets the client publish new courses without a developer'
    ],
    tech: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', 'ACF'],
    image: 'assets/images/chefacademyonline.webp',
    link: 'https://www.chefacademyonline.co.uk/',
    linkLabel: 'Visit live site',
    gallery: []
  },
  {
    id: 'commander-safeguard',
    title: 'Commander Safeguard Web Museum',
    subtitle: 'Restoring a 2005–2016 Flash-era site',
    category: 'Full-Stack & Apps',
    status: 'archive',
    featured: true,
    role: 'Archive engineering & front-end',
    summary: 'A preservation project that rebuilds the Commander Safeguard website across ten playback points from 2005 to 2016, serving original Wayback assets and running surviving Flash games through a local Ruffle runtime.',
    highlights: [
      'Ten restored snapshots spanning three major layout eras',
      'Wayback asset pipeline with alias mapping for missing files',
      'Flash games playable again through Ruffle instead of a dead plugin'
    ],
    tech: ['Node.js', 'Ruffle', 'Wayback CDX', 'HTML', 'CSS', 'JavaScript'],
    image: 'assets/images/commander-safeguard.webp',
    link: './commander-safeguard.html',
    linkLabel: 'Explore Web Museum',
    gallery: [
      { src: 'assets/images/commander/catalogue.webp', caption: 'Character catalogue' },
      { src: 'assets/images/commander/games.webp', caption: 'Games index' },
      { src: 'assets/images/commander/snapshot-2007.webp', caption: '2007 layout' }
    ]
  },
  {
    id: 'skl-watches',
    title: 'SKL Luxury Watches',
    subtitle: 'Enterprise Shopify & headless storefront',
    category: 'Shopify & E-Commerce',
    status: 'staging',
    featured: true,
    role: 'Shopify theme engineering',
    summary: 'A luxury watch storefront built on Shopify with a headless-friendly section architecture, designed around large product imagery and a restrained buying flow.',
    highlights: [
      'Custom sections instead of a rigid template',
      'Product pages tuned for high-resolution photography',
      'Staging deployment for client review'
    ],
    tech: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
    image: 'assets/images/skl-watches.png',
    link: 'https://lightsalmon-skunk-273227.hostingersite.com/',
    linkLabel: 'Open staging site',
    gallery: []
  },
  {
    id: 'qrlytics',
    title: 'QRlytics Attribution & Telemetry',
    subtitle: 'Dynamic QR campaigns with live attribution',
    category: 'Full-Stack & Apps',
    status: 'staging',
    featured: true,
    role: 'Full-stack development',
    summary: 'A SaaS-style platform for dynamic QR campaigns: each code can be re-pointed after printing, and every scan is attributed with device, location and campaign telemetry.',
    highlights: [
      'Dynamic QR destinations that can change without reprinting',
      'Scan telemetry with per-campaign attribution',
      'Dashboard views for campaigns and live activity'
    ],
    tech: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'REST APIs'],
    image: 'assets/images/qrlytics.png',
    link: 'http://mediumseagreen-sandpiper-209946.hostingersite.com',
    linkLabel: 'Open staging site',
    gallery: []
  },
  {
    id: 'hairforce-1',
    title: 'Hairforce 1 Barbershop & Academy',
    subtitle: 'East London barbershop and training academy',
    category: 'WordPress & CMS',
    status: 'live',
    featured: true,
    role: 'WordPress development',
    summary: 'A barbershop and barbering academy in East London. The site carries two audiences — walk-in clients and students — with course information and bookings alongside the shop.',
    highlights: [
      'Dual-audience navigation for clients and academy students',
      'Custom post types for courses and team members',
      'Built for fast mobile loading, where most of the traffic lands'
    ],
    tech: ['WordPress', 'PHP', 'JavaScript', 'ACF'],
    image: 'assets/images/hairforce-1-v1.png',
    link: 'https://hairforce-1.co.uk/',
    linkLabel: 'Visit live site',
    gallery: []
  },
  {
    id: 'asl-gesture-interpreter',
    title: 'Real-Time ASL Gesture Interpreter',
    subtitle: 'Android app translating sign language on-device',
    category: 'AI & Automation',
    status: 'local',
    featured: true,
    role: 'Computer vision & Android',
    summary: 'An Android application that reads American Sign Language hand shapes from the camera and translates them in real time, running the recognition pipeline on-device.',
    highlights: [
      'On-device hand tracking and gesture classification',
      'Live camera overlay with recognised letters',
      'Built with OpenCV and a Kotlin Android app'
    ],
    tech: ['Kotlin', 'Android', 'OpenCV', 'Python', 'TensorFlow'],
    image: 'assets/images/asl-gesture-interpreter.webp',
    link: 'https://github.com/MUHAMMADUSAMA64874',
    linkLabel: 'View on GitHub',
    gallery: []
  },
  {
    id: 'seaholm',
    title: 'Seaholm Luxury Watches',
    subtitle: 'Shopify storefront and theme system',
    category: 'Shopify & E-Commerce',
    status: 'live',
    featured: true,
    role: 'Shopify theme development',
    summary: 'A luxury watch retailer on Shopify with a custom theme system built around editorial product presentation and a calm, high-contrast shopping flow.',
    highlights: [
      'Custom Shopify sections and product templates',
      'Editorial layouts for collections and featured pieces',
      'Theme source maintained in its own repository'
    ],
    tech: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
    image: 'assets/images/seaholm.webp',
    thumb: 'assets/images/thumbs/seaholm.webp',
    link: 'https://seaholmautomatic.com/',
    linkLabel: 'Visit live site',
    gallery: []
  },
  {
    id: 'equinix-edge',
    title: 'Edge Cloud Landing Page (concept)',
    subtitle: 'Unofficial data-centre landing page concept',
    category: 'Full-Stack & Apps',
    status: 'local',
    featured: true,
    role: 'Front-end engineering & UI architecture',
    summary: 'Unofficial concept build of a data-centre / edge-cloud landing page, inspired by Equinix. Practice project — not affiliated with or endorsed by Equinix.',
    highlights: [
      'Interactive edge service showcases & cloud interconnect directory',
      'Dynamic power and footprint calculations for high-density AI clusters',
      'High-performance asset optimization with modern CSS grid architecture'
    ],
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Edge Cloud', 'REST APIs'],
    image: 'assets/images/equinix.webp',
    thumb: 'assets/images/thumbs/equinix.webp',
    link: '',
    linkLabel: '',
    gallery: []
  },

  // ── WordPress & CMS ─────────────────────────────────────────────────────
  {
    id: 'cut-and-taste-lv',
    title: 'Cut and Taste LV',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Food and catering brand site with a custom WordPress build and menu-led layouts.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/cutandtastelv.webp',
    link: 'https://www.cutandtastelv.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'old-money',
    title: 'Old Money',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Fashion retail site built on a custom WordPress theme with editorial collection pages.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/oldmoney.webp',
    link: 'https://old-money.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'varsovia-moda',
    title: 'Varsovia Moda',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Womenswear label storefront. Now served from its current domain after a migration.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/varsoviamoda.webp',
    link: 'https://www.varsovia-moda.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'bellarosa-mode',
    title: 'Bellarosa Mode',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Fashion storefront with a custom theme and product-led landing pages.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/bellarosa.webp',
    link: 'https://bellarosamode.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'editing-dock',
    title: 'Editing Dock',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Video editing studio site with service packages and a conversion-focused landing page.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/editingdock.webp',
    link: 'https://editing-dock.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'anchor-energy-partners',
    title: 'Anchor Energy Partners',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Energy investment firm site with a corporate content structure and deal-focused pages.',
    tech: ['WordPress', 'PHP', 'ACF'],
    image: 'assets/images/anchorenergy.webp',
    link: 'https://www.anchorenergypartners.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'kinfolk',
    title: 'Kinfolk',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Editorial lifestyle publication build with long-form article templates.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/kinfolk.webp',
    link: 'https://www.kinfolk.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'sm-plastic-industries',
    title: 'SM Plastic Industries',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Manufacturer site with a product catalogue and an enquiry pipeline.',
    tech: ['WordPress', 'PHP', 'WooCommerce'],
    image: 'assets/images/smplasticindustries.webp',
    link: 'https://smplasticindustries.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'ideales-wasser',
    title: 'Ideales Wasser',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Water treatment company site, now live on its rebranded domain.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/idealeswasser.webp',
    link: 'https://ideal-water.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'home-sweet-linens',
    title: 'Home Sweet Linens',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Home textiles storefront with a WooCommerce product catalogue.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/homesweetlinens.webp',
    link: 'https://homesweetlinens.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'sow-fertility',
    title: 'Sow Fertility',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Fertility clinic site with treatment pages and appointment enquiries.',
    tech: ['WordPress', 'PHP', 'ACF'],
    image: 'assets/images/sowfertility.webp',
    link: 'https://www.sowfertility.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'jdc-welfare',
    title: 'JDC Welfare',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Welfare organisation site with donation-focused content and campaign pages.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/jdcwelfare.webp',
    link: 'https://jdcwelfare.org/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'rogue-logics',
    title: 'Rogue Logics',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Technology consultancy site with service and case-study sections.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/roguelogics.webp',
    link: 'https://roguelogics.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'dawate-islami-usa',
    title: 'Dawate Islami USA',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Large multi-section organisation site with events, media and donation content.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/dawateislamiusa.webp',
    link: 'https://www.dawateislamiusa.org/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'zini-technologies',
    title: 'Zini Technologies',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Software services company site with service pages and lead capture.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/zinitechnologies.webp',
    link: 'https://zinitechnologies.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'flint-rock-suites',
    title: 'Flint Rock Suites',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Hospitality and short-stay accommodation site with room listings and enquiries.',
    tech: ['WordPress', 'PHP', 'ACF'],
    image: 'assets/images/flintrocksuites.webp',
    link: 'https://flintrocksuites.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'noveha',
    title: 'Noveha',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Brand and product site built on a custom WordPress theme.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/noveha.webp',
    link: 'https://noveha.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'heaven-dream-homes',
    title: 'Heaven Dream Homes',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Real estate site with property listings and enquiry forms.',
    tech: ['WordPress', 'PHP', 'ACF'],
    image: 'assets/images/heavendreamhomes.webp',
    link: 'https://heavendreamhomes.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'solidifyy',
    title: 'Solidifyy',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Business services site with a custom theme and conversion-focused landing pages.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/solidifyy.webp',
    link: 'https://solidifyy.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'the-texas-consultancy',
    title: 'The Texas Consultancy',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Consultancy site with service structure and lead-generation pages.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/thetexasconsultancy.webp',
    link: 'https://thetexasconsultancy.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'footy-vision',
    title: 'Footy Vision',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Football media site with article templates and video-led content.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/footyvision.webp',
    link: 'https://footyvision.net/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'aerovex-systems',
    title: 'Aerovex Systems',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Engineering and systems company site with product and capability pages.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/aerovexsystems.webp',
    link: 'https://aerovexsystems.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'codencoders',
    title: 'Codencoders Digital Agency',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Digital agency site with services, work and contact flows.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/codencoder.png',
    link: 'https://codencoder.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'avizone-tech',
    title: 'Avizone Tech Software House',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Software house site with service pages, portfolio and enquiry forms.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/avizonetech.png',
    link: 'https://avizonetech.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'the-quantum-north',
    title: 'The Quantum North',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development',
    summary: 'Global exporter site with product categories and international enquiry flows.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/thequantumnorth.png',
    link: 'https://thequantumnorth.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'vending-solutions',
    title: 'Vending Solutions',
    category: 'WordPress & CMS',
    status: 'down',
    verified: '2026-11-01',
    role: 'WordPress development',
    summary: 'Vending machine supplier site with product ranges and location enquiries. Served behind bot protection, so automated checks return 403 while the site is up in a browser.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/vendingsolutions.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'jugador-nutrition',
    title: 'Jugador Nutrition',
    category: 'WordPress & CMS',
    status: 'down',
    verified: '2026-11-01',
    role: 'WordPress development',
    summary: 'Sports nutrition storefront. Served behind bot protection, so automated checks return 403 while the site works in a browser.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/jugadornutrition.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'honeydew',
    title: 'Honeydew',
    category: 'WordPress & CMS',
    status: 'staging',
    role: 'WordPress development',
    summary: 'Client build on a temporary Hostinger preview domain, kept for review.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/honeydew.webp',
    link: 'https://honeydew-dolphin-528603.hostingersite.com/',
    linkLabel: 'Open staging site'
  },
  {
    id: 'the-pastel-papers',
    title: 'The Pastel Papers',
    category: 'WordPress & CMS',
    status: 'staging',
    role: 'WordPress development',
    summary: 'Stationery and paper goods storefront on a staging domain.',
    tech: ['WordPress', 'WooCommerce', 'PHP'],
    image: 'assets/images/thepastelpapers.webp',
    link: 'https://lightblue-donkey-900318.hostingersite.com/',
    linkLabel: 'Open staging site'
  },
  {
    id: 'creative-ins',
    title: 'Creative Ins',
    category: 'WordPress & CMS',
    status: 'staging',
    role: 'WordPress development',
    summary: 'Creative studio build on a staging domain. The original preview link used a parenthesised path that returns 404, so the card points at the staging root.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/creativeins.webp',
    link: 'https://darkseagreen-wallaby-778198.hostingersite.com/',
    linkLabel: 'Open staging site'
  },

  // ── Shopify & E-Commerce ────────────────────────────────────────────────
  {
    id: 'hush-puppies-sandals',
    title: 'Hush Puppies Sandals Store',
    category: 'Shopify & E-Commerce',
    status: 'staging',
    role: 'Shopify theme development',
    summary: 'Footwear storefront built on Shopify, currently on a staging domain.',
    tech: ['Shopify', 'Liquid', 'JavaScript'],
    image: 'assets/images/hush-puppies-sandals.png',
    link: 'https://lightpink-walrus-156419.hostingersite.com/',
    linkLabel: 'Open staging site'
  },
  {
    id: 'retrograde-bbq',
    title: 'Retrograde BBQ & Brewery',
    category: 'Shopify & E-Commerce',
    status: 'staging',
    role: 'Shopify theme development',
    summary: 'Restaurant and brewery storefront on a staging domain.',
    tech: ['Shopify', 'Liquid', 'CSS'],
    image: 'assets/images/retrograde-bbq.png',
    link: 'https://sienna-elk-247779.hostingersite.com/',
    linkLabel: 'Open staging site'
  },
  {
    id: 'inyourpostcode',
    title: 'InYourPostcode Custom Apparel',
    category: 'Shopify & E-Commerce',
    status: 'live',
    role: 'Shopify theme development',
    summary: 'Custom apparel store with print-on-demand style product flows.',
    tech: ['Shopify', 'Liquid', 'JavaScript'],
    image: 'assets/images/inyourpostcode.png',
    link: 'https://inyourpostcode.co.uk/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'fatima-shehzad',
    title: 'Fatima Shehzad Luxury Pret',
    category: 'Shopify & E-Commerce',
    status: 'live',
    role: 'Shopify theme development',
    summary: 'Luxury pret fashion store with collection-led merchandising.',
    tech: ['Shopify', 'Liquid', 'CSS'],
    image: 'assets/images/fatimashehzad.png',
    link: 'https://fatimashehzad.com/',
    linkLabel: 'Visit live site'
  },

  // ── Full-stack, AI and local builds ─────────────────────────────────────
  {
    id: 'dragon-throne',
    title: 'Dragon Throne 3D Experience',
    category: 'Full-Stack & Apps',
    status: 'local',
    role: 'Three.js & 3D Web Graphics',
    summary: 'A full-fidelity 3D web experience with real-time lighting, interactive dragon model animations, particle shaders, and cinematic orbit controls.',
    tech: ['Three.js', 'WebGL', 'JavaScript', 'CSS3', 'FBX/DAE 3D'],
    image: 'assets/images/dragon-throne.webp',
    thumb: 'assets/images/thumbs/dragon-throne.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'menucanvas',
    title: 'MenuCanvas Multi-Branch Restaurant Suite',
    category: 'Full-Stack & Apps',
    status: 'local',
    role: 'Full-stack development',
    summary: 'A multi-branch restaurant management suite covering menus, branches and ordering, built as a self-contained local application.',
    tech: ['PHP', 'Laravel', 'MySQL', 'JavaScript'],
    image: 'assets/images/menucanvas.webp',
    thumb: 'assets/images/thumbs/menucanvas.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'ollama-3d-character',
    title: 'Interactive 3D Character with Ollama',
    category: 'AI & Automation',
    status: 'local',
    role: 'Three.js, GSAP & local LLM integration',
    summary: 'A browser-based cartoon character built from Three.js primitives, animated with GSAP and driven by a locally hosted Ollama model for conversation.',
    highlights: [
      'Idle breathing, talking mouth, walking and gesture animations',
      'Conversation routed to a local Ollama model — no cloud calls',
      'Settings panel for model selection and animation toggles'
    ],
    tech: ['Three.js', 'GSAP', 'Ollama', 'JavaScript'],
    image: 'assets/images/ollama-character.webp',
    link: 'https://github.com/MUHAMMADUSAMA64874',
    linkLabel: 'View on GitHub'
  },
  {
    id: 'website-crawler',
    title: 'Website Crawler & Capture Tool',
    category: 'AI & Automation',
    status: 'local',
    role: 'Tooling & automation',
    summary: 'A Playwright-driven crawler that walks a site, captures pages as screenshots and exports structured metadata for auditing and archiving.',
    highlights: [
      'Headless capture with configurable depth and viewport',
      'Structured output for page inventories and audits',
      'Used to produce the screenshots in this portfolio'
    ],
    tech: ['Playwright', 'Node.js', 'JavaScript'],
    image: 'assets/images/website-crawler.webp',
    link: 'https://github.com/MUHAMMADUSAMA64874',
    linkLabel: 'View on GitHub'
  },
  {
    id: 'ovelo-theme',
    title: 'OVELO Shopify Theme',
    category: 'Shopify & E-Commerce',
    status: 'local',
    role: 'Theme engineering',
    summary: 'A full Shopify theme built from sections and blocks, with configurable layouts and merchandising controls.',
    tech: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
    image: 'assets/images/ovelo-theme.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'seaholm-theme-source',
    title: 'Seaholm Shopify Theme Source',
    category: 'Shopify & E-Commerce',
    status: 'local',
    role: 'Theme engineering',
    summary: 'The maintained Shopify theme behind the Seaholm storefront — sections, snippets, templates and locales.',
    tech: ['Shopify', 'Liquid', 'JavaScript'],
    image: 'assets/images/seaholm-theme.webp',
    link: 'https://seaholmautomatic.com/',
    linkLabel: 'See it live'
  },
  {
    id: 'wordpress-theme-kit',
    title: 'Custom WordPress Theme Kit',
    category: 'WordPress & CMS',
    status: 'local',
    role: 'WordPress theme development',
    summary: 'A reusable WordPress theme scaffold with build instructions, template hierarchy and block-ready styles.',
    tech: ['WordPress', 'PHP', 'SCSS', 'JavaScript'],
    image: 'assets/images/wordpress-theme-kit.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'caybookme',
    title: 'Cay Book Me',
    category: 'Full-Stack & Apps',
    status: 'local',
    role: 'Front-end development',
    summary: 'A booking-oriented landing site built as a standalone static front end.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'assets/images/caybookme.webp',
    thumb: 'assets/images/thumbs/caybookme.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'windows-xp-website',
    title: 'Windows XP Desktop Website',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Front-end experiment',
    summary: 'A browser recreation of the Windows XP desktop — draggable windows, taskbar and start menu.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'assets/images/windows-xp-website.webp',
    thumb: 'assets/images/thumbs/windows-xp-website.webp',
    link: './winxp/index.html',
    linkLabel: 'Launch Windows XP Desktop'
  },

  // ── Front-end practice and concept work ─────────────────────────────────
  {
    id: 'omni-cook',
    title: 'Omni Cook',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Recipe and cooking concept page built with hand-written HTML and CSS.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/omni cook.webp',
    link: 'assets/images/omni cook.webp',
    linkLabel: ''
  },
  {
    id: 'mobile-concept',
    title: 'Mobile Product Concept',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Mobile device product landing concept.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/q-1.webp',
    link: 'assets/images/q-1.webp',
    linkLabel: ''
  },
  {
    id: 'construction-concept',
    title: 'Construction Company Concept',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Construction services landing page concept.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/q-2.webp',
    link: 'assets/images/q-2.webp',
    linkLabel: ''
  },
  {
    id: 'event-management',
    title: 'Event Management Concept',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Event planning and venue landing concept.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/restaurant.webp',
    link: 'assets/images/restaurant.webp',
    linkLabel: ''
  },
  {
    id: 'kitchen-concept',
    title: 'Kitchen Interior Concept',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Kitchen and interior design landing concept.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/q-6.webp',
    link: 'assets/images/q-6.webp',
    linkLabel: ''
  },
  {
    id: 'sofa-listing',
    title: 'Sofa Product Listing',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Product listing layout produced for an eBay storefront.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/q-3.webp',
    link: 'assets/images/q-3.webp',
    linkLabel: ''
  },
  {
    id: 'product-listing-concept',
    title: 'Product Listing Concept I',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Marketplace product listing layout concept.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/q-4.webp',
    link: 'assets/images/q-4.webp',
    linkLabel: ''
  },
  {
    id: 'product-listing-concept-2',
    title: 'Product Listing Concept II',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML & CSS',
    summary: 'Second marketplace product listing layout concept.',
    tech: ['HTML', 'CSS'],
    image: 'assets/images/q-5.webp',
    link: 'assets/images/q-5.webp',
    linkLabel: ''
  },
  {
    id: 'site-parallax',
    title: 'Parallax Site Concept',
    category: 'Frontend Practice',
    status: 'local',
    role: 'HTML, CSS & JavaScript',
    summary: 'Scroll parallax landing page experiment.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'assets/images/q-7.webp',
    link: 'assets/images/q-7.webp',
    linkLabel: ''
  },
  {
    id: 'bootstrap-landing',
    title: 'Bootstrap Landing Page',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Bootstrap',
    summary: 'Responsive landing page built with Bootstrap.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/1.webp',
    link: 'assets/images/1.webp',
    linkLabel: ''
  },
  {
    id: 'bootstrap-form',
    title: 'Bootstrap Online Form',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Bootstrap',
    summary: 'Multi-field online form with Bootstrap validation styling.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/2.webp',
    link: 'assets/images/2.webp',
    linkLabel: ''
  },
  {
    id: 'bootstrap-knowledge',
    title: 'Bootstrap Knowledge Base',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Bootstrap',
    summary: 'Knowledge base layout with article cards and navigation.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/3.webp',
    link: 'assets/images/3.webp',
    linkLabel: ''
  },
  {
    id: 'bootstrap-cv',
    title: 'Bootstrap CV Page',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Bootstrap',
    summary: 'Responsive curriculum vitae layout.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/4.webp',
    link: 'assets/images/4.webp',
    linkLabel: ''
  },
  {
    id: 'bootstrap-business',
    title: 'Bootstrap Business Page',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Bootstrap',
    summary: 'Corporate business landing layout.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/5.webp',
    link: 'assets/images/5.webp',
    linkLabel: ''
  },
  {
    id: 'bootstrap-survey',
    title: 'Bootstrap Survey Form',
    category: 'Frontend Practice',
    status: 'local',
    role: 'Bootstrap',
    summary: 'Survey and questionnaire form layout.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/6.webp',
    link: 'assets/images/6.webp',
    linkLabel: ''
  },
  {
    id: 'wordpress-lms',
    title: 'WordPress LMS Course Site',
    category: 'Frontend Practice',
    status: 'live',
    role: 'WordPress & Python tooling',
    summary: 'A learning-management site with course listings, built with Python tooling and WordPress.',
    tech: ['WordPress', 'Python', 'PHP'],
    image: 'assets/images/lms.webp',
    link: 'http://bestcourses.42web.io/?i=1',
    linkLabel: 'Visit live site'
  },

  // ── Verified credentials ────────────────────────────────────────────────
  {
    id: 'udemy-html-css-bootstrap',
    title: 'Udemy: HTML, CSS & Bootstrap',
    category: 'Credentials',
    status: 'live',
    role: 'Verified certification',
    summary: 'Completed certification covering semantic HTML, responsive CSS and Bootstrap.',
    tech: ['HTML', 'CSS', 'Bootstrap'],
    image: 'assets/images/html-css-bootstrap-certificate.png',
    link: 'https://www.udemy.com/certificate/UC-46819960-3af4-4e1d-b78e-5178374527b7/',
    linkLabel: 'Verify certificate'
  },
  {
    id: 'udemy-git-github-markdown',
    title: 'Udemy: Git, GitHub & Markdown',
    category: 'Credentials',
    status: 'live',
    role: 'Verified certification',
    summary: 'Completed certification covering version control, GitHub workflows and Markdown.',
    tech: ['Git', 'GitHub', 'Markdown'],
    image: 'assets/images/git-github-markdown-certificate.png',
    link: 'https://www.udemy.com/certificate/UC-0021e75c-e501-4c60-9a97-26c693efa7dc/',
    linkLabel: 'Verify certificate'
  },

  // ── Offline / unreachable client work (kept, not hidden) ────────────────
  {
    id: 'cellit',
    title: 'Cellit',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Client WordPress build. The domain returned a server error on the last check; the site is kept here for the record.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/cellit.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'pure-haven',
    title: 'Pure Haven LLC',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Client WordPress build. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/purehaven.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'cubix-build',
    title: 'Cubix Build Construct',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Australian construction company site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/cubixbuild.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'ebook-sells',
    title: 'Ebook Sells',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Digital product storefront. The domain did not resolve on the last check.',
    tech: ['WordPress', 'WooCommerce'],
    image: 'assets/images/ebooksells.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'adept-fire',
    title: 'Adept Fire Australia',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Fire safety services site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/adeptfire.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'all-operations',
    title: 'All Operations Websites',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Agency site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/alloperations.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'assignment-writing-provider',
    title: 'Assignment Writing Provider',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Service site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/assignmentwritingprovider.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'american-branding-experts',
    title: 'American Branding Experts',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Branding agency site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/americanbrandingexperts.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'dr-makki',
    title: 'Dr. Makki',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Clinic site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/drmakki.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'the-designic',
    title: 'The Designic',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Design studio site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/thedesignic.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'great-feast-ballroom',
    title: 'The Great Feast Ballroom',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Events venue site. The domain did not resolve on the last check.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/thegreatfeastballroom.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'tehreemart-store',
    title: 'Tehreemart Store',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'E-commerce storefront. The domain has expired and now redirects to a registrar parking page.',
    tech: ['WordPress', 'WooCommerce'],
    image: 'assets/images/tehreemartstore.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'pursuit-athletic-performance',
    title: 'Pursuit Athletic Performance',
    category: 'WordPress & CMS',
    status: 'down',
    role: 'WordPress development',
    summary: 'Athletic training site. The domain now redirects to a host returning a server error.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/pursuitathleticperformance.webp',
    link: '',
    linkLabel: ''
  },

  // ── Added 2026-11-01 from the CV and the DATA folder (screenshots captured that day) ──
  {
    id: 'chef-academy-london',
    verified: '2026-11-01',
    title: 'Chef Academy of London',
    subtitle: 'Joomla → WordPress migration, 6 languages',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'Lead WordPress & migration engineer',
    summary: 'Enterprise migration of an international culinary academy from legacy Joomla to WordPress, with multilingual routing across six languages.',
    highlights: [
      '3,474 legacy URLs mapped to 301 redirects to keep search rankings',
      '6-language setup with Polylang Pro; 26 cross-language routing conflicts fixed',
      '72 Stripe payment links audited and re-mapped for enrolment deposits'
    ],
    tech: ['WordPress', 'Polylang Pro', 'Stripe', 'PHP', 'Joomla migration', 'SEO'],
    image: 'assets/images/chef-academy-london.webp',
    link: 'https://chefacademyoflondon.com/en/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'chef-academy-booking',
    verified: '2026-11-01',
    title: 'Chef Academy Course Booking Plugin',
    subtitle: 'Intakes, waitlists and enrolment — v4.3.2',
    category: 'WordPress & CMS',
    status: 'local',
    role: 'Custom plugin development',
    summary: 'A 2,600-line custom WordPress plugin that runs course intake dates, waitlists for fully booked dates and a full enrolment application form, with admin notifications and SMTP settings.',
    highlights: [
      'Waitlist flow with a threshold alert once 5 entries are pending',
      'Direct enrolment saved to custom tables with admin email notifications',
      'Settings screen for SMTP delivery and booking rules'
    ],
    tech: ['WordPress', 'PHP', 'MySQL', 'Custom tables', 'SMTP'],
    image: 'assets/images/chef-academy-booking.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'employee-management-plugin',
    verified: '2026-11-01',
    title: 'Employee Management Plugin',
    category: 'WordPress & CMS',
    status: 'local',
    role: 'Custom plugin development',
    summary: 'A WordPress plugin that stores staff records as a custom post type and exposes a searchable employee directory through the [employee-search] shortcode.',
    tech: ['WordPress', 'PHP', 'JavaScript', 'Shortcodes'],
    image: 'assets/images/employee-management-plugin.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'custom-certificate-plugin',
    verified: '2026-11-01',
    title: 'Custom Certificate Generator Plugin',
    category: 'WordPress & CMS',
    status: 'local',
    role: 'Custom plugin development',
    summary: 'Admin pages to create and list certificates, rendered on the front end through the [display_certificate] shortcode with a printable template. Used at BrandSoft for staff achievement certificates.',
    tech: ['WordPress', 'PHP', 'Admin UI', 'Shortcodes'],
    image: 'assets/images/custom-certificate-plugin.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'page-locker-plugin',
    verified: '2026-11-01',
    title: 'WordPress Page Locker',
    category: 'WordPress & CMS',
    status: 'local',
    role: 'Custom plugin development',
    summary: 'An admin tool that locks every page, or a single page by ID, behind an unlock prompt using post-meta flags.',
    tech: ['WordPress', 'PHP'],
    image: 'assets/images/page-locker-plugin.webp',
    link: '',
    linkLabel: ''
  },
  {
    id: 'snugglebug',
    verified: '2026-11-01',
    title: 'Snugglebug',
    category: 'Shopify & E-Commerce',
    status: 'live',
    role: 'Shopify development (Codencoder)',
    summary: 'Baby clothing storefront on Shopify with seasonal collections and sale campaigns.',
    tech: ['Shopify', 'Liquid', 'CSS'],
    image: 'assets/images/snugglebug.webp',
    link: 'https://snugglebug.co/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'copa-system',
    verified: '2026-11-01',
    title: 'Copa System',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development (Codencoder)',
    summary: 'Medical AV integration company site with service pages and a lead-capture quote form.',
    tech: ['WordPress', 'PHP', 'Forms'],
    image: 'assets/images/copa-system.webp',
    link: 'https://copasystem.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'accretive-wm',
    verified: '2026-11-01',
    title: 'Accretive Wealth Management',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development (Codencoder)',
    summary: 'Canary Wharf wealth management firm — regulated financial services site with consultation booking.',
    tech: ['WordPress', 'PHP', 'SEO'],
    image: 'assets/images/accretive-wm.webp',
    link: 'https://www.accretive-wm.co.uk/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'whoopba',
    verified: '2026-11-01',
    title: 'Whoopba',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development (Codencoder)',
    summary: 'Marketing site for a white-label staffing and recruitment app platform, with product tours and demo booking.',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    image: 'assets/images/whoopba.webp',
    link: 'https://www.whoopba.com/',
    linkLabel: 'Visit live site'
  },
  {
    id: 'airavizone',
    verified: '2026-11-01',
    title: 'Air Avizone',
    category: 'WordPress & CMS',
    status: 'live',
    role: 'WordPress development (Codencoder)',
    summary: 'Corporate jet charter and aviation services site with service catalogue and enquiry flow.',
    tech: ['WordPress', 'PHP', 'CSS'],
    image: 'assets/images/airavizone.webp',
    link: 'https://airavizone.com/',
    linkLabel: 'Visit live site'
  }
];

// Full technical stack (from the CV). Used by the skills bento.
export const stack = [
  { title: 'CMS & E-Commerce', icon: 'cms', tags: ['WordPress core & plugins', 'WooCommerce', 'Shopify / Liquid', 'ACF Pro', 'Elementor Pro', 'Kadence', 'Polylang Pro', 'WP Rocket', 'Rank Math', 'Joomla → WP migration'] },
  { title: 'AI & Automation', icon: 'ai', tags: ['n8n', 'Make.com', 'Ollama / Llama 3.2', 'OpenAI GPT-4o', 'Claude API', 'Gemini API', 'AI agents', 'Prompt engineering'] },
  { title: 'Backend & Languages', icon: 'code', tags: ['PHP', 'JavaScript ES6+', 'Python', 'Node.js', 'Express', 'Laravel', 'REST', 'GraphQL', 'WebSockets', 'Webhooks'] },
  { title: 'Scraping & Data', icon: 'data', tags: ['Playwright', 'Puppeteer', 'Cheerio', 'Apify', 'DataForSEO', 'Data cleaning'] },
  { title: 'Databases & Cloud', icon: 'cloud', tags: ['MySQL', 'PostgreSQL / Supabase', 'MongoDB', 'Vector DBs', 'NocoDB', 'Docker', 'DigitalOcean', 'Cloudways', 'cPanel'] },
  { title: 'Integrations & Tools', icon: 'tools', tags: ['Stripe', 'Meta Graph API', 'Google Workspace APIs', 'Brevo', 'HubSpot', 'Git / GitHub', 'Jira', 'ClickUp', 'Slack'] }
];

// Education and languages (from the CV, 2026-10-23).
export const education = [
  { degree: 'BS Computer Science', school: 'Karachi Institute of Economics & Technology (KIET)', period: '2021 – 2026', note: 'CGPA 3.23 / 4.00 · Software Engineering, DSA, Databases, Web, AI, OOP' },
  { degree: 'HSC — Pre-Engineering', school: 'Fazaia Degree College, Karachi', period: '2018 – 2019', note: '' }
];

export const languages = [
  { name: 'English', level: 'Professional (C1)' },
  { name: 'Urdu', level: 'Native' }
];

// Selected production automations (from the CV). Shown on the home page.
export const workflows = [
  { title: 'Monthly SEO reporting engine', impact: 'Saves 15–20 h / month', body: 'Pulls DataForSEO + Sheets metrics, a local Llama 3.2 model writes the trend analysis, then 15+ Google Slides are generated, exported to PDF and emailed to clients.', stack: ['n8n', 'Ollama', 'Slides API', 'Gmail'] },
  { title: 'WordPress auto-publisher & social syndication', impact: 'Saves 10–15 h / week', body: 'Every 2 hours: reads the editorial calendar, drafts SEO articles with OpenAI, publishes via the WP REST API and syndicates to Facebook, X and LinkedIn.', stack: ['n8n', 'OpenAI', 'WP REST', 'Meta Graph'] },
  { title: 'SERP rank tracker with anomaly alerts', impact: 'Hundreds of keywords daily', body: 'Batches keyword checks to DataForSEO at 1 AM UTC, flags ±3 position moves and pushes webhook alerts while logging history to Sheets.', stack: ['n8n', 'DataForSEO', 'Webhooks'] },
  { title: 'WhatsApp helpdesk bot', impact: '100% automated triage', body: 'Authenticates inbound users against MongoDB, matches their organisation role and routes the ticket to the right support person with an instant reply.', stack: ['n8n', 'MongoDB', 'WhatsApp API'] },
  { title: 'Multi-agent invoice intelligence', impact: '>90% confidence gating', body: 'Drive-triggered: parallel Gemini agents extract structured JSON from PDFs, and only records above the confidence threshold land in Sheets.', stack: ['n8n', 'Gemini 2.5', 'Drive API'] }
];

export const categories = [
  'WordPress & CMS',
  'Shopify & E-Commerce',
  'AI & Automation',
  'Full-Stack & Apps',
  'Frontend Practice',
  'Credentials'
];

export const categoryShort = {
  'WordPress & CMS': 'WordPress',
  'Shopify & E-Commerce': 'Shopify',
  'AI & Automation': 'AI & n8n',
  'Full-Stack & Apps': 'Full-stack',
  'Frontend Practice': 'Front-end',
  'Credentials': 'Credentials'
};

export const projectStats = {
  total: projects.length,
  live: projects.filter(p => p.status === 'live').length,
  // Credentials are live links too, but they are not client sites — never let
  // them inflate the headline number.
  clientSites: projects.filter(p => p.status === 'live' && p.category !== 'Credentials').length,
  staging: projects.filter(p => p.status === 'staging').length,
  local: projects.filter(p => p.status === 'local').length,
  archive: projects.filter(p => p.status === 'archive').length,
  down: projects.filter(p => p.status === 'down').length
};
