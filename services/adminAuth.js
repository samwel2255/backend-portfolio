const jwt = require('jsonwebtoken')

function signAdminToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  })
}

function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')

  if (!token) {
    return res.status(401).json({ ok: false, message: 'Missing bearer token' })
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    return next()
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Invalid or expired token' })
  }
}

module.exports = {
  signAdminToken,
  requireAdminAuth
}