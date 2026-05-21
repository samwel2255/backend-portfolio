const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

dotenv.config()

const { buildCorsOptions } = require('./services/cors')
const apiRouter = require('./routes')

const app = express()

app.use(express.json())
app.use(cors(buildCorsOptions()))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Wakuru backend'
  })
})

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Route not found'
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(500).json({
    ok: false,
    error: err.message || 'Internal Server Error'
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})