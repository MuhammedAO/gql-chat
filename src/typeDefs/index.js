
   
const { gql } = require("apollo-server-express")


module.exports = gql`
  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    emailVerified: Boolean
    dexertoId: String
    dob: String
    productName: String
    products: [UserProduct]
    createdAt: String
    updatedAt: String
    verifiedGames: [VerifiedGamesData]
    verifiedPlatforms: [PlatformData]
    verifiedSocials: [SocialNetworkData]
    accessToken: String
  }
  type UserCreateResponse {
    email: String!
    dexertoId: String
  }
  
  
  }
  type Query {
    me: User
 
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