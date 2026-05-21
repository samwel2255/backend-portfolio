const express = require('express')

const skillsRouter = require('./skills')
const contactRouter = require('./contact')
const projectsRouter = require('./projects')
const aboutRouter = require('./about')
const profileRouter = require('./profile')
const educationRouter = require('./education')
const adminRouter = require('./admin')

const router = express.Router()

router.use('/skills', skillsRouter)
router.use('/contact', contactRouter)
router.use('/projects', projectsRouter)
router.use('/about', aboutRouter)
router.use('/profile', profileRouter)
router.use('/education', educationRouter)
router.use('/admin', adminRouter)

module.exports = router