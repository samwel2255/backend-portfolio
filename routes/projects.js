const express = require('express')
const prisma = require('../lib/prisma')
const { success, failure } = require('../services/responses')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { id: 'asc' }]
    })

    return success(res, projects)
  } catch (err) {
    console.error(err)
    return failure(res, 500, 'Database error')
  }
})

module.exports = router
