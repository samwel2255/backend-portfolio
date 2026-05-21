const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
]

function buildAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []

  return [...new Set([...defaultOrigins, ...configuredOrigins])]
}

function buildCorsOptions() {
  const allowedOrigins = buildAllowedOrigins()

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS not allowed for origin: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
}

module.exports = {
  buildCorsOptions
}