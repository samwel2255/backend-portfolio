const express = require('express')
const bcrypt = require('bcryptjs')

const prisma = require('../lib/prisma')
const { signAdminToken, requireAdminAuth } = require('../services/adminAuth')
const { success, failure } = require('../services/responses')
const { upload } = require('../services/upload')

const router = express.Router()

async function touchAdminActivity(adminId) {
  if (!adminId) {
    return
  }

  await prisma.admin.update({
    where: { id: adminId },
    data: { lastActivity: new Date() }
  })
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      return failure(res, 401, 'Email not found')
    }

    const passwordMatches = await bcrypt.compare(password || '', admin.passwordHash)

    if (!passwordMatches) {
      return failure(res, 401, 'Incorrect password')
    }

    await touchAdminActivity(admin.id)

    return success(res, {
      token: signAdminToken({ id: admin.id, email: admin.email }),
      admin: {
        id: admin.id,
        email: admin.email,
        lastActivity: admin.lastActivity
      }
    })
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Login failed')
  }
})

router.use(requireAdminAuth)

router.get('/session', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
    return success(res, {
      id: admin.id,
      email: admin.email,
      lastActivity: admin.lastActivity
    })
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to load session')
  }
})

router.get('/profile', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const profile = await prisma.profile.findFirst({ orderBy: { id: 'asc' } })
    return success(res, profile)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to load profile')
  }
})

router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const currentProfile = await prisma.profile.findFirst({ orderBy: { id: 'asc' } })
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : payload.avatarUrl || currentProfile?.avatarUrl || null

    const profile = await prisma.profile.upsert({
      where: { id: currentProfile?.id || 1 },
      update: {
        name: payload.name,
        title: payload.title,
        summary: payload.summary,
        bio: payload.bio,
        resumeUrl: payload.resumeUrl,
        avatarUrl,
        githubUrl: payload.githubUrl,
        linkedinUrl: payload.linkedinUrl,
        email: payload.email
      },
      create: {
        name: payload.name || 'Wakuru Juma Gilagali',
        title: payload.title || 'Final-year software developer',
        summary: payload.summary || '',
        bio: payload.bio || '',
        resumeUrl: payload.resumeUrl || null,
        avatarUrl,
        githubUrl: payload.githubUrl || null,
        linkedinUrl: payload.linkedinUrl || null,
        email: payload.email || null
      }
    })

    return success(res, profile)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to update profile')
  }
})

router.get('/projects', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const projects = await prisma.project.findMany({ orderBy: [{ featured: 'desc' }, { id: 'asc' }] })
    return success(res, projects)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to load projects')
  }
})

router.post('/projects', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const project = await prisma.project.create({
      data: {
        title: payload.title,
        description: payload.description,
        tech: Array.isArray(payload.tech) ? payload.tech : [],
        github: payload.github,
        demo: payload.demo,
        featured: Boolean(payload.featured)
      }
    })

    return success(res, project, 201)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to create project')
  }
})

router.put('/projects/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: {
        title: payload.title,
        description: payload.description,
        tech: Array.isArray(payload.tech) ? payload.tech : [],
        github: payload.github,
        demo: payload.demo,
        featured: Boolean(payload.featured)
      }
    })

    return success(res, project)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to update project')
  }
})

router.delete('/projects/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    await prisma.project.delete({ where: { id: Number(req.params.id) } })
    return success(res, { deleted: true })
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to delete project')
  }
})

router.get('/skills', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const skills = await prisma.skill.findMany({ orderBy: { id: 'asc' } })
    return success(res, skills)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to load skills')
  }
})

router.post('/skills', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const skill = await prisma.skill.create({
      data: {
        name: payload.name,
        level: Number(payload.level) || 0,
        icon: payload.icon,
        category: payload.category
      }
    })

    return success(res, skill, 201)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to create skill')
  }
})

router.put('/skills/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const skill = await prisma.skill.update({
      where: { id: Number(req.params.id) },
      data: {
        name: payload.name,
        level: Number(payload.level) || 0,
        icon: payload.icon,
        category: payload.category
      }
    })

    return success(res, skill)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to update skill')
  }
})

router.delete('/skills/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    await prisma.skill.delete({ where: { id: Number(req.params.id) } })
    return success(res, { deleted: true })
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to delete skill')
  }
})

router.get('/education', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const education = await prisma.education.findMany({ orderBy: [{ endYear: 'desc' }, { id: 'asc' }] })
    return success(res, education)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to load education')
  }
})

router.post('/education', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const education = await prisma.education.create({
      data: {
        school: payload.school,
        degree: payload.degree,
        field: payload.field,
        startYear: payload.startYear ? Number(payload.startYear) : null,
        endYear: payload.endYear ? Number(payload.endYear) : null,
        description: payload.description
      }
    })

    return success(res, education, 201)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to create education record')
  }
})

router.put('/education/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const payload = req.body || {}
    const education = await prisma.education.update({
      where: { id: Number(req.params.id) },
      data: {
        school: payload.school,
        degree: payload.degree,
        field: payload.field,
        startYear: payload.startYear ? Number(payload.startYear) : null,
        endYear: payload.endYear ? Number(payload.endYear) : null,
        description: payload.description
      }
    })

    return success(res, education)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to update education record')
  }
})

router.delete('/education/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    await prisma.education.delete({ where: { id: Number(req.params.id) } })
    return success(res, { deleted: true })
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to delete education record')
  }
})

router.get('/contacts', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
    return success(res, messages)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to load contacts')
  }
})

router.delete('/contacts/:id', async (req, res) => {
  try {
    await touchAdminActivity(req.admin.id)
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } })
    return success(res, { deleted: true })
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Unable to delete contact')
  }
})

module.exports = router