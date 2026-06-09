// API Service Layer for Tectigon Academy
// Configure NEXT_PUBLIC_API_URL to point to your PHP backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Types
export interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  originalPrice?: number
  category: string
  image: string
  instructor: string
  instructorImage: string
  rating: number
  reviewCount: number
  studentsEnrolled: number
  modules: CourseModule[]
  skills: string[]
  prerequisites: string[]
  certification: boolean
  featured: boolean
}

export interface CourseModule {
  title: string
  lessons: string[]
  duration: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  image: string
  content: string
  rating: number
  course: string
}

export interface CertificateVerification {
  valid: boolean
  certificate?: {
    id: string
    studentName: string
    courseName: string
    issueDate: string
    expiryDate?: string
    grade: string
  }
  error?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
  linkedin?: string
  twitter?: string
}

export interface Stats {
  studentsGraduated: number
  employmentRate: number
  coursesOffered: number
  yearsExperience: number
  partnerCompanies: number
}

// Mock Data (used when API is not configured)
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    description:
      'Ndërto aplikacione moderne nga fillimi deri në fund. Mëso frontend, backend, databaza dhe publikim, duke punuar në projekte reale.',
    shortDescription:
      'Aplikacione të plota web: frontend, backend, databaza dhe publikim.',
    duration: '6 muaj',
    level: 'Intermediate',
    price: 1499,
    originalPrice: 1999,
    category: 'Full Stack Developer',
    image: '/images/courses/web-dev.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/arta.jpg',
    rating: 4.9,
    reviewCount: 320,
    studentsEnrolled: 1350,
    modules: [
      {
        title: 'Frontend Fundamentals',
        lessons: ['HTML & CSS', 'JavaScript (ES6+)', 'Responsive UI', 'Git & GitHub'],
        duration: '4 javë',
      },
      {
        title: 'Modern Frontend',
        lessons: ['React Basics', 'State & Hooks', 'Routing', 'Forms & Validation'],
        duration: '6 javë',
      },
      {
        title: 'Backend & APIs',
        lessons: ['Node.js/Express', 'REST APIs', 'Auth & Security', 'Testing Basics'],
        duration: '6 javë',
      },
      {
        title: 'Databases & Deployment',
        lessons: ['SQL Basics', 'PostgreSQL', 'Docker Intro', 'Deployment & CI basics'],
        duration: '4 javë',
      },
      {
        title: 'Capstone Project',
        lessons: ['Planning', 'Build', 'Deploy', 'Presentation'],
        duration: '4 javë',
      },
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'Git', 'Docker'],
    prerequisites: ['Njohuri bazike të programimit', 'Laptop + internet'],
    certification: true,
    featured: true,
  },
  {
    id: '2',
    title: 'Graphic Design & UI/UX',
    slug: 'graphic-design-ui-ux',
    description:
      'Krijo identitet vizual dhe përvoja digjitale të orientuara te përdoruesi. Mëso dizajn grafik, UI/UX, prototipim dhe dizajn sisteme.',
    shortDescription:
      'Dizajn grafik + UI/UX: prototipim, dizajn sisteme dhe portofol.',
    duration: '4 muaj',
    level: 'Beginner',
    price: 1199,
    originalPrice: 1499,
    category: 'Graphic Design & UI/UX',
    image: '/images/courses/ui-ux.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/leonora.jpg',
    rating: 4.8,
    reviewCount: 210,
    studentsEnrolled: 820,
    modules: [
      { title: 'Design Fundamentals', lessons: ['Typography', 'Color', 'Layout', 'Brand Basics'], duration: '3 javë' },
      { title: 'UI Design', lessons: ['Components', 'Grids', 'Design Systems', 'Accessibility'], duration: '4 javë' },
      { title: 'UX Research', lessons: ['Personas', 'User Flows', 'Wireframes', 'Usability Testing'], duration: '3 javë' },
      { title: 'Prototyping & Portfolio', lessons: ['Figma', 'Prototypes', 'Case Studies', 'Portfolio'], duration: '4 javë' },
    ],
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Branding'],
    prerequisites: ['Nuk kërkohet përvojë', 'Kreativitet & motivim'],
    certification: true,
    featured: true,
  },
  {
    id: '3',
    title: 'Java Development',
    slug: 'java-development',
    description:
      'Ndërto aplikacione të qëndrueshme me Java. Mëso OOP, Spring, API, databaza dhe praktikat e industrisë.',
    shortDescription:
      'Java + Spring: OOP, API, databaza dhe aplikacione reale.',
    duration: '5 muaj',
    level: 'Intermediate',
    price: 1399,
    originalPrice: 1799,
    category: 'Java Development',
    image: '/images/courses/web-dev.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/driton.jpg',
    rating: 4.8,
    reviewCount: 165,
    studentsEnrolled: 610,
    modules: [
      { title: 'Java Core', lessons: ['Syntax', 'OOP', 'Collections', 'Exceptions'], duration: '4 javë' },
      { title: 'Backend with Spring', lessons: ['Spring Boot', 'REST APIs', 'Validation', 'Security Basics'], duration: '6 javë' },
      { title: 'Databases', lessons: ['SQL', 'JPA/Hibernate', 'Migrations', 'Performance Basics'], duration: '4 javë' },
      { title: 'Testing & Deployment', lessons: ['Unit Tests', 'Integration Tests', 'Docker Intro', 'Deploy'], duration: '4 javë' },
    ],
    skills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'JPA/Hibernate', 'Testing', 'Git'],
    prerequisites: ['Njohuri bazike programimi', 'Logjikë e mirë'],
    certification: true,
    featured: true,
  },
  {
    id: '4',
    title: 'C# .NET',
    slug: 'csharp-dotnet',
    description:
      'Ndërto aplikacione dhe API me C# dhe .NET. Mëso OOP, ASP.NET Core, databaza dhe best practices.',
    shortDescription:
      'C# + .NET: API, databaza dhe aplikacione të strukturuara.',
    duration: '5 muaj',
    level: 'Intermediate',
    price: 1399,
    originalPrice: 1799,
    category: 'C# .NET',
    image: '/images/courses/web-dev.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/arber.jpg',
    rating: 4.8,
    reviewCount: 150,
    studentsEnrolled: 560,
    modules: [
      { title: 'C# Fundamentals', lessons: ['Syntax', 'OOP', 'LINQ', 'Error Handling'], duration: '4 javë' },
      { title: 'ASP.NET Core', lessons: ['Web API', 'Auth', 'Validation', 'Swagger'], duration: '6 javë' },
      { title: 'Data Access', lessons: ['SQL', 'Entity Framework', 'Migrations', 'Caching Basics'], duration: '4 javë' },
      { title: 'Testing & Deployment', lessons: ['Unit Tests', 'CI basics', 'Docker Intro', 'Deploy'], duration: '4 javë' },
    ],
    skills: ['C#', '.NET', 'ASP.NET Core', 'REST APIs', 'SQL', 'Entity Framework', 'Testing'],
    prerequisites: ['Njohuri bazike programimi'],
    certification: true,
    featured: false,
  },
  {
    id: '5',
    title: 'Cyber Security',
    slug: 'cyber-security',
    description:
      'Mëso mbrojtjen e sistemeve dhe rrjeteve. Praktiko me lab-e reale: hardening, monitoring dhe bazat e pentest.',
    shortDescription:
      'Siguri kibernetike: rrjete, hardening, monitoring dhe incidente.',
    duration: '5 muaj',
    level: 'Advanced',
    price: 1799,
    originalPrice: 2299,
    category: 'Cyber Security',
    image: '/images/courses/cybersecurity.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/besnik.jpg',
    rating: 4.8,
    reviewCount: 240,
    studentsEnrolled: 910,
    modules: [
      { title: 'Fundamentals', lessons: ['Networking', 'Linux Basics', 'Security Principles', 'Threat Modeling'], duration: '3 javë' },
      { title: 'Offense Basics', lessons: ['Recon', 'Web Security', 'Tools', 'Reporting'], duration: '5 javë' },
      { title: 'Defense', lessons: ['Hardening', 'SIEM Intro', 'Incident Response', 'Forensics Basics'], duration: '4 javë' },
      { title: 'Labs & Projects', lessons: ['CTF-style labs', 'Case studies', 'Playbooks', 'Final project'], duration: '4 javë' },
    ],
    skills: ['Network Security', 'Linux', 'OWASP', 'SIEM', 'Incident Response', 'Security Tools'],
    prerequisites: ['Networking bazik', 'Linux bazik'],
    certification: true,
    featured: true,
  },
  {
    id: '6',
    title: 'TechBlend',
    slug: 'techblend',
    description:
      'Program i kombinuar për të hyrë shpejt në teknologji: bazat e web-it, databazat, git dhe projektet praktike.',
    shortDescription:
      'Bazat e teknologjisë me projekte praktike për fillestarë.',
    duration: '3 muaj',
    level: 'Beginner',
    price: 899,
    originalPrice: 1099,
    category: 'TechBlend',
    image: '/images/courses/web-dev.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/arta.jpg',
    rating: 4.7,
    reviewCount: 120,
    studentsEnrolled: 740,
    modules: [
      { title: 'Web Basics', lessons: ['HTML', 'CSS', 'JavaScript Basics', 'Responsive'], duration: '4 javë' },
      { title: 'Tools', lessons: ['Git', 'CLI basics', 'Debugging', 'Productivity'], duration: '2 javë' },
      { title: 'Data Basics', lessons: ['SQL basics', 'APIs basics', 'JSON', 'Auth basics'], duration: '3 javë' },
      { title: 'Project', lessons: ['Mini project', 'Collaboration', 'Deploy', 'Presentation'], duration: '3 javë' },
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'SQL Basics', 'APIs'],
    prerequisites: ['Nuk kërkohet përvojë'],
    certification: true,
    featured: false,
  },
  {
    id: '7',
    title: 'DevOps',
    slug: 'devops',
    description:
      'Mëso praktikat DevOps: CI/CD, Docker, observability dhe bazat e cloud-it për të automatizuar publikimin dhe mirëmbajtjen.',
    shortDescription:
      'CI/CD, Docker, monitoring dhe cloud bazik për DevOps.',
    duration: '4 muaj',
    level: 'Intermediate',
    price: 1499,
    originalPrice: 1899,
    category: 'DevOps',
    image: '/images/courses/cloud.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/driton.jpg',
    rating: 4.8,
    reviewCount: 140,
    studentsEnrolled: 520,
    modules: [
      { title: 'Foundations', lessons: ['Linux', 'Networking', 'Git workflows', 'Scripting basics'], duration: '3 javë' },
      { title: 'Containers', lessons: ['Docker', 'Images', 'Compose', 'Best practices'], duration: '4 javë' },
      { title: 'CI/CD', lessons: ['Pipelines', 'Testing in CI', 'Deploy strategies', 'Secrets'], duration: '4 javë' },
      { title: 'Observability', lessons: ['Monitoring', 'Logging', 'Alerting', 'Incident basics'], duration: '3 javë' },
    ],
    skills: ['Docker', 'CI/CD', 'Linux', 'Monitoring', 'Automation', 'Git'],
    prerequisites: ['Bazat e programimit', 'Linux bazik (ndihmon)'],
    certification: true,
    featured: true,
  },
  {
    id: '8',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description:
      'Mëso marketingun digjital: strategji, content, reklama, SEO dhe analytics për të rritur një brand apo biznes online.',
    shortDescription:
      'Strategji, SEO, Ads dhe analytics për rezultate reale.',
    duration: '3 muaj',
    level: 'Beginner',
    price: 799,
    originalPrice: 999,
    category: 'Digital Marketing',
    image: '/images/courses/ui-ux.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/leonora.jpg',
    rating: 4.7,
    reviewCount: 110,
    studentsEnrolled: 680,
    modules: [
      { title: 'Marketing Basics', lessons: ['Positioning', 'Personas', 'Funnels', 'KPIs'], duration: '2 javë' },
      { title: 'Content & Social', lessons: ['Content strategy', 'Calendars', 'Copywriting', 'Community'], duration: '3 javë' },
      { title: 'SEO & Ads', lessons: ['SEO basics', 'On-page', 'Google Ads basics', 'Meta Ads basics'], duration: '4 javë' },
      { title: 'Analytics', lessons: ['GA basics', 'UTM tracking', 'Reports', 'Optimization'], duration: '3 javë' },
    ],
    skills: ['SEO', 'Content Strategy', 'Ads Basics', 'Analytics', 'Copywriting', 'Branding'],
    prerequisites: ['Nuk kërkohet përvojë'],
    certification: true,
    featured: false,
  },
  {
    id: '9',
    title: 'Python Data Science',
    slug: 'python-data-science',
    description:
      'Analizo dhe vizualizo të dhëna me Python. Mëso Pandas, vizualizim, SQL bazik dhe modele ML bazike për projekte reale.',
    shortDescription:
      'Python + data analysis: Pandas, vizualizim dhe projekte.',
    duration: '5 muaj',
    level: 'Intermediate',
    price: 1699,
    originalPrice: 2199,
    category: 'Python Data Science',
    image: '/images/courses/data-science.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/fatos.jpg',
    rating: 4.9,
    reviewCount: 260,
    studentsEnrolled: 1120,
    modules: [
      { title: 'Python Core', lessons: ['Python basics', 'Functions', 'OOP basics', 'Notebooks'], duration: '4 javë' },
      { title: 'Data Analysis', lessons: ['NumPy', 'Pandas', 'Cleaning', 'EDA'], duration: '5 javë' },
      { title: 'Visualization', lessons: ['Matplotlib', 'Seaborn', 'Dashboards', 'Storytelling'], duration: '3 javë' },
      { title: 'ML Basics', lessons: ['scikit-learn', 'Regression', 'Classification', 'Evaluation'], duration: '4 javë' },
    ],
    skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization', 'SQL Basics', 'scikit-learn'],
    prerequisites: ['Bazat e programimit', 'Matematikë bazike (ndihmon)'],
    certification: true,
    featured: true,
  },
  {
    id: '10',
    title: 'Project Management & Product Ownership',
    slug: 'project-management-product-ownership',
    description:
      'Mëso të menaxhosh projekte dhe produkte: Agile/Scrum, planifikim, backlog, kërkesa dhe komunikim me stakeholderë.',
    shortDescription:
      'Agile/Scrum, planifikim, backlog dhe delivery i suksesshëm.',
    duration: '3 muaj',
    level: 'Beginner',
    price: 899,
    originalPrice: 1099,
    category: 'Project Management & Product Ownership',
    image: '/images/courses/ui-ux.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/arta.jpg',
    rating: 4.7,
    reviewCount: 95,
    studentsEnrolled: 430,
    modules: [
      { title: 'PM Fundamentals', lessons: ['Scope', 'Timeline', 'Risks', 'Stakeholders'], duration: '2 javë' },
      { title: 'Agile & Scrum', lessons: ['Roles', 'Ceremonies', 'Artifacts', 'Estimation'], duration: '3 javë' },
      { title: 'Product Ownership', lessons: ['Discovery', 'Backlog', 'Prioritization', 'Roadmaps'], duration: '3 javë' },
      { title: 'Delivery', lessons: ['Metrics', 'Reporting', 'Communication', 'Case studies'], duration: '2 javë' },
    ],
    skills: ['Agile', 'Scrum', 'Backlog Management', 'Roadmapping', 'Communication', 'Planning'],
    prerequisites: ['Nuk kërkohet përvojë'],
    certification: true,
    featured: false,
  },
  {
    id: '11',
    title: 'WordPress & Shopify',
    slug: 'wordpress-shopify',
    description:
      'Ndërto faqe dhe e-commerce: WordPress, tema/plugins, Shopify store setup, pages, payments dhe optimizim.',
    shortDescription:
      'Website + e-commerce me WordPress dhe Shopify.',
    duration: '2.5 muaj',
    level: 'Beginner',
    price: 699,
    originalPrice: 899,
    category: 'WordPress & Shopify',
    image: '/images/courses/web-dev.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/leonora.jpg',
    rating: 4.6,
    reviewCount: 80,
    studentsEnrolled: 520,
    modules: [
      { title: 'WordPress Basics', lessons: ['Setup', 'Themes', 'Plugins', 'SEO basics'], duration: '3 javë' },
      { title: 'Content & Pages', lessons: ['Page builders', 'Forms', 'Performance', 'Security basics'], duration: '2 javë' },
      { title: 'Shopify Store', lessons: ['Store setup', 'Products', 'Payments', 'Shipping'], duration: '3 javë' },
      { title: 'Launch', lessons: ['Analytics basics', 'Testing', 'Go-live checklist', 'Maintenance'], duration: '2 javë' },
    ],
    skills: ['WordPress', 'Shopify', 'SEO Basics', 'E-commerce', 'Performance', 'Content'],
    prerequisites: ['Nuk kërkohet përvojë'],
    certification: true,
    featured: false,
  },
  {
    id: '12',
    title: 'Video Production',
    slug: 'video-production',
    description:
      'Mëso produksionin e videos: planifikim, xhirim, audio, montazh dhe publikim për social media dhe biznes.',
    shortDescription:
      'Xhirim, audio dhe montazh profesional për video moderne.',
    duration: '3 muaj',
    level: 'Beginner',
    price: 899,
    originalPrice: 1099,
    category: 'Video Production',
    image: '/images/courses/ui-ux.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/leonora.jpg',
    rating: 4.7,
    reviewCount: 70,
    studentsEnrolled: 260,
    modules: [
      { title: 'Pre-production', lessons: ['Brief', 'Script', 'Storyboards', 'Shot list'], duration: '2 javë' },
      { title: 'Production', lessons: ['Camera basics', 'Lighting', 'Audio', 'Composition'], duration: '3 javë' },
      { title: 'Editing', lessons: ['Timeline', 'Color basics', 'Sound mix', 'Export'], duration: '4 javë' },
      { title: 'Publishing', lessons: ['Formats', 'Thumbnails', 'Captions', 'Workflow'], duration: '2 javë' },
    ],
    skills: ['Editing', 'Lighting', 'Audio', 'Storytelling', 'Publishing', 'Workflow'],
    prerequisites: ['Nuk kërkohet përvojë'],
    certification: true,
    featured: false,
  },
  {
    id: '13',
    title: '3D Modeling',
    slug: '3d-modeling',
    description:
      'Krijo modele 3D: bazat e modelimit, teksturimit, ndriçimit dhe renderimit për projekte praktike.',
    shortDescription:
      'Modelim 3D, teksturim dhe renderim për portofol.',
    duration: '4 muaj',
    level: 'Intermediate',
    price: 1199,
    originalPrice: 1499,
    category: '3D Modeling',
    image: '/images/courses/ui-ux.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/leonora.jpg',
    rating: 4.7,
    reviewCount: 60,
    studentsEnrolled: 210,
    modules: [
      { title: 'Basics', lessons: ['3D workflow', 'Modeling basics', 'Topology', 'UV basics'], duration: '3 javë' },
      { title: 'Materials', lessons: ['Texturing', 'Shaders', 'PBR basics', 'Lookdev'], duration: '3 javë' },
      { title: 'Lighting', lessons: ['Lights', 'Cameras', 'Composition', 'Render settings'], duration: '3 javë' },
      { title: 'Portfolio', lessons: ['Assets', 'Scenes', 'Renders', 'Presentation'], duration: '3 javë' },
    ],
    skills: ['3D Modeling', 'Texturing', 'Lighting', 'Rendering', 'Topology', 'Portfolio'],
    prerequisites: ['Bazat e dizajnit (ndihmon)'],
    certification: true,
    featured: false,
  },
  {
    id: '14',
    title: 'QA',
    slug: 'qa',
    description:
      'Mëso testimin e softuerit: manual testing, test cases, bug reporting dhe bazat e automation.',
    shortDescription:
      'Manual QA + bazat e automation për testim profesional.',
    duration: '3 muaj',
    level: 'Beginner',
    price: 899,
    originalPrice: 1099,
    category: 'QA',
    image: '/images/courses/web-dev.jpg',
    instructor: 'Ekipi i Tectigon Academy',
    instructorImage: '/images/instructors/besnik.jpg',
    rating: 4.7,
    reviewCount: 85,
    studentsEnrolled: 420,
    modules: [
      { title: 'QA Foundations', lessons: ['SDLC', 'Test types', 'Test cases', 'Bug reporting'], duration: '3 javë' },
      { title: 'Tools', lessons: ['Jira basics', 'Test management', 'API testing basics', 'Postman'], duration: '3 javë' },
      { title: 'Automation Basics', lessons: ['Intro to automation', 'Selectors', 'Test structure', 'CI basics'], duration: '3 javë' },
      { title: 'Project', lessons: ['Test plan', 'Execute', 'Report', 'Presentation'], duration: '3 javë' },
    ],
    skills: ['Manual Testing', 'Test Cases', 'Bug Reporting', 'Jira', 'API Testing', 'Automation Basics'],
    prerequisites: ['Nuk kërkohet përvojë'],
    certification: true,
    featured: true,
  },
]

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ermal Krasniqi',
    role: 'Full-Stack Developer',
    company: 'Microsoft Kosovo',
    image: '/images/testimonials/ermal.jpg',
    content: 'Tectigon Academy completely transformed my career. I went from a retail job to working at Microsoft in just 8 months. The instructors are world-class and the curriculum is exactly what the industry needs.',
    rating: 5,
    course: 'Full Stack Developer',
  },
  {
    id: '2',
    name: 'Vlora Ahmeti',
    role: 'Security Analyst',
    company: 'Deloitte',
    image: '/images/testimonials/vlora.jpg',
    content: 'The cybersecurity program gave me hands-on experience with real-world scenarios. I passed my CEH certification on the first attempt and landed my dream job within weeks of graduating.',
    rating: 5,
    course: 'Cyber Security',
  },
  {
    id: '3',
    name: 'Luan Berisha',
    role: 'Data Scientist',
    company: 'KPMG',
    image: '/images/testimonials/luan.jpg',
    content: 'The data science program exceeded all my expectations. The balance between theory and practical projects prepared me perfectly for the industry. Now I work on projects that actually impact businesses.',
    rating: 5,
    course: 'Python Data Science',
  },
  {
    id: '4',
    name: 'Dafina Morina',
    role: 'UX Designer',
    company: 'Spotify',
    image: '/images/testimonials/dafina.jpg',
    content: 'I always loved design but didn\'t know how to break into tech. Tectigon\'s UX program taught me not just tools, but how to think like a designer. Six months later, I was hired by Spotify!',
    rating: 5,
    course: 'Graphic Design & UI/UX',
  },
  {
    id: '5',
    name: 'Arben Hoxha',
    role: 'Cloud Architect',
    company: 'Amazon Web Services',
    image: '/images/testimonials/arben.jpg',
    content: 'The AWS course at Tectigon is comprehensive and practical. I earned two AWS certifications during the program and now I help businesses migrate to the cloud. Best investment I ever made.',
    rating: 5,
    course: 'DevOps',
  },
]

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Blerim Rexha',
    role: 'Founder & CEO',
    image: '/images/team/blerim.jpg',
    bio: 'Former Google engineer with 15+ years in tech. PhD in Computer Science from MIT. Passionate about bringing world-class tech education to Kosovo.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
  {
    id: '2',
    name: 'Dr. Arta Krasniqi',
    role: 'Head of Curriculum',
    image: '/images/team/arta.jpg',
    bio: 'Former tech lead at Netflix. Expert in full-stack development and modern web technologies. Designed curricula adopted by universities across Europe.',
    linkedin: 'https://linkedin.com',
  },
  {
    id: '3',
    name: 'Besnik Gashi',
    role: 'Cybersecurity Director',
    image: '/images/team/besnik.jpg',
    bio: 'Certified Ethical Hacker with experience at NATO Cooperative Cyber Defence. Led security teams for Fortune 500 companies.',
    linkedin: 'https://linkedin.com',
  },
  {
    id: '4',
    name: 'Dr. Fatos Morina',
    role: 'Data Science Lead',
    image: '/images/team/fatos.jpg',
    bio: 'PhD in Machine Learning from Stanford. Former AI researcher at DeepMind. Published author and conference speaker.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
]

const mockStats: Stats = {
  studentsGraduated: 5000,
  employmentRate: 95,
  coursesOffered: 25,
  yearsExperience: 8,
  partnerCompanies: 150,
}

// API Functions
async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API not configured')
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  return response.json()
}

// Course API
export async function getCourses(): Promise<Course[]> {
  if (!API_BASE_URL) return mockCourses
  try {
    return await fetchFromAPI<Course[]>('/courses')
  } catch {
    return mockCourses
  }
}

export async function getCourse(slug: string): Promise<Course | null> {
  if (!API_BASE_URL) {
    return mockCourses.find(c => c.slug === slug) || null
  }
  try {
    return await fetchFromAPI<Course>(`/courses/${slug}`)
  } catch {
    return mockCourses.find(c => c.slug === slug) || null
  }
}

export async function getFeaturedCourses(): Promise<Course[]> {
  if (!API_BASE_URL) return mockCourses.filter(c => c.featured)
  try {
    return await fetchFromAPI<Course[]>('/courses?featured=true')
  } catch {
    return mockCourses.filter(c => c.featured)
  }
}

// Testimonials API
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!API_BASE_URL) return mockTestimonials
  try {
    return await fetchFromAPI<Testimonial[]>('/testimonials')
  } catch {
    return mockTestimonials
  }
}

// Team API
export async function getTeam(): Promise<TeamMember[]> {
  if (!API_BASE_URL) return mockTeam
  try {
    return await fetchFromAPI<TeamMember[]>('/team')
  } catch {
    return mockTeam
  }
}

// Stats API
export async function getStats(): Promise<Stats> {
  if (!API_BASE_URL) return mockStats
  try {
    return await fetchFromAPI<Stats>('/stats')
  } catch {
    return mockStats
  }
}

// Certificate Verification API
export async function verifyCertificate(certificateId: string): Promise<CertificateVerification> {
  if (!API_BASE_URL) {
    // Mock verification for demo
    if (certificateId.toUpperCase().startsWith('TEC-')) {
      return {
        valid: true,
        certificate: {
          id: certificateId.toUpperCase(),
          studentName: 'Demo Student',
          courseName: 'Full Stack Developer',
          issueDate: '2024-01-15',
          grade: 'Distinction',
        },
      }
    }
    return { valid: false, error: 'Certificate not found' }
  }
  
  try {
    return await fetchFromAPI<CertificateVerification>('/certificates/verify', {
      method: 'POST',
      body: JSON.stringify({ certificateId }),
    })
  } catch {
    return { valid: false, error: 'Verification service unavailable' }
  }
}

// Contact Form API
export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  if (!API_BASE_URL) {
    // Mock submission for demo
    return { success: true, message: 'Thank you for your message! We will get back to you soon.' }
  }
  
  try {
    return await fetchFromAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch {
    return { success: false, message: 'Failed to send message. Please try again.' }
  }
}

// Newsletter API
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!API_BASE_URL) {
    return { success: true, message: 'Successfully subscribed to newsletter!' }
  }
  
  try {
    return await fetchFromAPI('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  } catch {
    return { success: false, message: 'Failed to subscribe. Please try again.' }
  }
}
