
   
const { gql } = require("apollo-server-express")


module.exports = gql`
  type User {
    _id: ID
    username: String
    email: String
  }
  type UserCreateResponse {
    email: String!
    dexertoId: String
  }
  
  
  
  type Query {
    getUsers: [User]
  }
  
  type Mutation {
    userCreate(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      areTermsAccepted: Boolean!
      isMarketingConsent: Boolean!
    ): UserCreateResponse!
   
  }
`;