const express = require('express')

const prisma = require('../lib/prisma')
const { success, failure } = require('../services/responses')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst({ orderBy: { id: 'asc' } })

    return success(res, profile || null)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Database error')
  }
})

module.exports = router