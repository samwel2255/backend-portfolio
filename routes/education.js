const express = require('express')

const prisma = require('../lib/prisma')
const { success, failure } = require('../services/responses')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ endYear: 'desc' }, { id: 'asc' }]
    })

    return success(res, education)
  } catch (error) {
    console.error(error)
    return failure(res, 500, 'Database error')
  }
})

module.exports = router