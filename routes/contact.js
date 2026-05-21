const express = require('express')
const prisma = require('../lib/prisma')
const { success, failure } = require('../services/responses')
const { requiredString, isEmail } = require('../services/validation')
const { requireAdminAuth } = require('../services/adminAuth')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!requiredString(name) || !isEmail(email) || !requiredString(message)) {
      return failure(res, 400, 'Invalid contact payload')
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message
      }
    })

    return success(res, contact, 201)
  } catch (err) {
    console.error(err)
    return failure(res, 500, 'Database error')
  }
})

router.get('/', requireAdminAuth, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return success(res, messages)
  } catch (err) {
    console.error(err)
    return failure(res, 500, 'Database error')
  }
})

router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.contactMessage.delete({ where: { id: Number(id) } })

    return success(res, { deleted: true })
  } catch (err) {
    console.error(err)
    return failure(res, 500, 'Database error')
  }
})

module.exports = router
