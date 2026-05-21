function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isEmail(value) {
  return typeof value === 'string' && /.+@.+\..+/.test(value)
}

module.exports = {
  requiredString,
  isEmail
}