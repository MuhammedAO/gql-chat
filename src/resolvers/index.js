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
    userCreate: async () => {}
  }
}