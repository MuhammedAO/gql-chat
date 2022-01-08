const { UserInputError } = require('apollo-server-express')
const bcrypt = require('bcryptjs')
const {User} =  require('../models')
const jwt = require('jsonwebtoken')


module.exports  = {
  Query: {
    getUsers: async () => {
      try {
      const x = await User.findAll()
      console.log(x)
      return x
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    login: async () => {
      const { username, password } = args
      let errors = {}

      try {
        if (username.trim() === '')
          errors.username = 'username must not be empty'
        if (password === '') errors.password = 'password must not be empty'

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('bad input', { errors })
        }

        const user = await User.findOne({
          where: { username },
        })

        if (!user) {
          errors.username = 'user not found'
          throw new UserInputError('user not found', { errors })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
          errors.password = 'password is incorrect'
          throw new AuthenticationError('password is incorrect', { errors })
        }

        const token = jwt.sign({ username }, 'JWT_SECRET', {
          expiresIn: 60 * 60,
        })

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    
  },
  Mutation: {
    register: async (_, args) => {
      let {username, email, password, confirmPassword} = args
      let errors = {}
      try {
        if (email.trim() === '') errors.email = 'email must not be empty'
        if (username.trim() === '') errors.username = 'username must not be empty'
        if (password.trim() === '')errors.password = 'password must not be empty'
        if (confirmPassword.trim() === '')errors.confirmPassword = 'repeat password must not be empty'

        if (password !== confirmPassword) errors.confirmPassword = 'passwords must match'
        
        // const userByUsername = await User.findOne({ where: { username } })
        // const userByEmail = await User.findOne({ where: { email } })

        // if (userByUsername) errors.username = 'Username is taken'
        // if (userByEmail) errors.email = 'Email is taken'

        if (Object.keys(errors).length > 0) {
          throw errors
        }

        password = await bcrypt.hash(password, 10)

        return await User.create({
          username,
          email,
          password, 
        })
      } catch (error) {
        console.log(error)
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          )
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message))
        }
        throw new UserInputError('Bad input', { errors })
      }
    }
  }
}