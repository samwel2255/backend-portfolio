const express = require('express')
const prisma = require('../lib/prisma')
const { success, failure } = require('../services/responses')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { id: 'asc' } })

    return success(res, skills)
  } catch (err) {
    console.error(err)
    return failure(res, 500, 'Database error')
  }
})

module.exports = router
