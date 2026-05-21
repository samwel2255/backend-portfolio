const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')

const prisma = require('../lib/prisma')

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const uploadsDir = path.resolve(__dirname, '..', 'uploads')
const defaultAvatarPath = path.join(uploadsDir, 'default-avatar.svg')
const portraitSourcePath = path.resolve(__dirname, '..', '..', 'frontend', 'waku.jpeg')
const portraitTargetPath = path.join(uploadsDir, 'waku.jpeg')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

if (!fs.existsSync(defaultAvatarPath)) {
  fs.writeFileSync(
    defaultAvatarPath,
    `<svg width="960" height="960" viewBox="0 0 960 960" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="g" x1="120" y1="120" x2="840" y2="840" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFB6C1"/>
<stop offset="0.5" stop-color="#B799FF"/>
<stop offset="1" stop-color="#2B0A3D"/>
</linearGradient>
</defs>
<rect width="960" height="960" rx="180" fill="#0F0A1F"/>
<circle cx="480" cy="380" r="190" fill="url(#g)" fill-opacity="0.92"/>
<path d="M240 790C294 662 384 600 480 600C576 600 666 662 720 790" stroke="url(#g)" stroke-width="88" stroke-linecap="round"/>
<circle cx="480" cy="360" r="250" fill="white" fill-opacity="0.04"/>
<text x="480" y="900" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" fill="#FDFBFF" fill-opacity="0.8">Wakuru Juma Gilagali</text>
</svg>`
  )
}

if (fs.existsSync(portraitSourcePath)) {
  fs.copyFileSync(portraitSourcePath, portraitTargetPath)
}

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      name: 'Wakuru Juma Gilagali',
      title: 'Final-year software developer',
      summary: 'Frontend and backend developer, data analyst, and AI enthusiast.',
      bio: 'Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.',
      resumeUrl: '/resume.pdf',
      avatarUrl: fs.existsSync(portraitTargetPath) ? '/uploads/waku.jpeg' : '/uploads/default-avatar.svg',
      githubUrl: 'https://github.com/',
      linkedinUrl: 'https://linkedin.com/'
    },
    create: {
      name: 'Wakuru Juma Gilagali',
      title: 'Final-year software developer',
      summary: 'Frontend and backend developer, data analyst, and AI enthusiast.',
      bio: 'Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.',
      resumeUrl: '/resume.pdf',
      avatarUrl: fs.existsSync(portraitTargetPath) ? '/uploads/waku.jpeg' : '/uploads/default-avatar.svg',
      githubUrl: 'https://github.com/',
      linkedinUrl: 'https://linkedin.com/'
    }
  })

  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.education.deleteMany()
  await prisma.contactMessage.deleteMany()

  await prisma.project.createMany({
    data: [
      {
        title: 'Data Visualization Dashboard',
        description: 'Interactive analytics dashboard showcasing insights with responsive charts and KPI storytelling.',
        tech: ['React', 'D3.js', 'Tailwind'],
        github: '#',
        demo: '#',
        featured: true
      },
      {
        title: 'Machine Learning Classifier',
        description: 'End-to-end ML workflow for classification with model evaluation and deployment-ready APIs.',
        tech: ['Python', 'Scikit-learn', 'FastAPI'],
        github: '#',
        demo: '#',
        featured: false
      }
    ],
    skipDuplicates: true
  })

  await prisma.skill.createMany({
    data: [
      { name: 'HTML', level: 90, icon: 'bi-filetype-html', category: 'Frontend' },
      { name: 'CSS', level: 88, icon: 'bi-filetype-css', category: 'Frontend' },
      { name: 'JavaScript', level: 86, icon: 'bi-filetype-js', category: 'Frontend' },
      { name: 'React', level: 84, icon: 'bi-cpu', category: 'Frontend' },
      { name: 'Node.js', level: 78, icon: 'bi-diagram-3', category: 'Backend' },
      { name: 'Data Analysis', level: 82, icon: 'bi-graph-up', category: 'Analytics' },
      { name: 'Machine Learning', level: 76, icon: 'bi-cpu-fill', category: 'AI' }
    ]
  })

  await prisma.education.createMany({
    data: [
      {
        school: 'Eastern Africa Statistical Training Centre (EASTC)',
        degree: 'BSc',
        field: 'Official Statistics',
        startYear: 2022,
        endYear: 2026,
        description: 'Final-year student expected to graduate in July 2026.'
      }
    ]
  })

  const adminPasswordHash = await bcrypt.hash('wakuru@123', 10)

  await prisma.admin.upsert({
    where: { email: 'wakuru@gmail.com' },
    update: {
      passwordHash: adminPasswordHash,
      lastActivity: new Date()
    },
    create: {
      email: 'wakuru@gmail.com',
      passwordHash: adminPasswordHash
    }
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })