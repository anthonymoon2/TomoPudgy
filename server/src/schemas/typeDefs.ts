const typeDefs = `
  type Query {
    getUserInfo(_id: String!): UserInfo
    getFoodItem(name: String!): FoodItem
    calculateUserCalories(_id: String, foodName: String):UserInfo
  }

  type UserInfo {
  _id: ID!
  username: String!
  password: String!
  weight: Float 
  height: String
  gender: Boolean
  age: Int
  recommendedCalorieCalculation: Float
  dailyCaloricIntake: Float
}

  type Mutation {
  createUser(username: String!, password: String!): UserInfo
  loginUser(username: String!, password: String! ): UserInfo
  addUserInfo(
    _id: ID!,
    weight: Float,
    height: String,
    gender: Boolean,
    age: Int,
    recommendedCalorieCalculation: Float,
    dailyCaloricIntake: Float
  ): UserInfo
}
  type FoodItem {
  name: String
  calories: Float

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
    loginUser(username: String!, password: String!): UserInfo
    addUserInfo(
      _id: ID!
      weight: Float!
      height: String!
      gender: Boolean!
      age: Int!
      recommendedCalorieCalculation: Float!
      dailyCaloricIntake: Float!

    ): UserInfo

    
  }

  type FoodItem {
    name: String!
    calories: Float!
  }
`;
export default typeDefs;
