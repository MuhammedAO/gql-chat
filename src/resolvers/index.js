const { UserInputError } = require('apollo-server-express')
const bcrypt = require('bcryptjs')
const {User} =  require('../models')


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
    }
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