const attachUserToContext = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    req.uid = `uid from ${token.replace('Bearer ', '')}`
    next()
  }
  else {
    res
      .status(401)
      .send({ message: 'You must attach token' })
  }
}

export default attachUserToContext