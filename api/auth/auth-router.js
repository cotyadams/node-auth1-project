// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const bcrypt = require('bcryptjs')
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists } = require('./auth-middleware')
const users = require('../users/users-model')


const router = express.Router();

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post('/register',
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 8)
    req.body.password = hash
    const userID = await users.add(req.body)
    const user = await users.findById(userID);
    res.status(201).json({
      username: user[0].username,
      user_id: user[0].user_id
    })
  res.status(200)
})
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', checkUsernameExists, async (req, res, next) => {
  const {password} = req.body
  try {
    if (bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user
      console.log(req.session)
      res.status(200).json({
        message: `Welcome ${req.user.username}!`
      })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res, next) => {
  const {username} = req.session.user
  req.session.destroy(err => {
    if (err) {
      res.json({ message: 'you shall not leave me!' })
    } else {
      res.json({
        message: `goodbye ${username}`
      })
    }
  })
})
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router