const jwt = require('jsonwebtoken')

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  // console.log('Req headers = ', req.headers);

  const token = authHeader && authHeader.split(' ')[1]
  // console.log('Token = ', token);

  if (!token)
    return res.status(401).json({error: 'Unauthorized'})

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    // console.log('user - ', user);
    if (err)
      res.status(403).json({error: 'Invalid token'})

    req.user = user

    next()
  })
}

module.exports = authToken
