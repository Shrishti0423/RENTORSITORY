function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must contain valid JSON.' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: 'Listing validation failed.' })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'A listing field has an invalid value.' })
  }

  console.error('Unhandled API request error.')
  return res.status(500).json({ message: 'Something went wrong. Please try again.' })
}

export default errorHandler
