const typeDefs = `
  type Query {
  getUserInfo(_id: String!): UserInfo
}

  type UserInfo {
  _id: ID!
  username: String!
  password: String!
  weight: Float! 
  height: String!
  gender: Boolean!
  age: Int!
  recommendedCalorieCalculation: Float!
  dailyCaloricIntake: Float!
}

  type Mutation {
  createUser(username: String!, password: String!): UserInfo
  loginUser(username: String!, password: String! ): UserInfo
  addUserInfo(
    _id: ID!,
    weight: Float!,
    height: String!,
    gender: Boolean!,
    age: Int!,
    recommendedCalorieCalculation: Float!,
    dailyCaloricIntake: Float!
  ): UserInfo
}
  type FoodItem {
  _id: ID!
  name: String!
  calories: Float!
  fat_total_g: Float!
  protein_g: Float!
  carbs_total_g: Float!
  }
`;

export default typeDefs;
