function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ ok: true, data })
}

function failure(res, statusCode, message, details) {
  return res.status(statusCode).json({ ok: false, message, details })
}

module.exports = {
  success,
  failure
}