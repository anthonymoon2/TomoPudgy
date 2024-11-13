const typeDefs = `
  type UserInfo {
  _id: ID!
  username: String!
  password: String!
  Weight: Float! 
  Height: String!
  Gender: Boolean!
  Age: Int!
  RecommendedCalorieCalculation: Float!
  DailyCaloricIntake: Float!
}

  type Mutation {
  createUser(username: String!, password: String!): UserInfo
  loginUser(username: String!, password: String! ): UserInfo
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
