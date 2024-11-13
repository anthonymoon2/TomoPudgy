const typeDefs = `
//check && set user login to db
  type UserLogin {
     _id: ID!
  username: String!
  password: String!
}

  // update user info to db
  type UserInfo {
  _id: ID!
  Weight: Float! 
  Height: String!
  Gender: Boolean!
  Age: Int!
  RecommendedCalorieCalculation: Float!
  DailyCaloricIntake: Float!
}

 type Query {
    loginUser(username: String!, password: String!): UserLogin
  }


  type Mutation {
  createUserLogin(username: String!, password: String!): UserLogin

  addUserInfo(
    _id: ID!,
    Weight: Float!,
    Height: String!,
    Gender: Boolean!,
    Age: Int!,
    RecommendedCalorieCalculation: Float!,
    DailyCaloricIntake: Float!
  ): UserInfo
}
`;

export default typeDefs;
