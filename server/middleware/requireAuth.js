function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Please log in before creating a listing. Login is not connected yet.',
    })
  }

  return next()
}

export default requireAuth
