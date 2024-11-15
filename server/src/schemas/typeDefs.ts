const typeDefs = `
  type Query {
    getUserInfo(_id: String!): UserInfo
    getFoodItem(name: String!): FoodItem
 
   }

  type UserInfo {
    _id: ID!
    username: String!
    password: String!
    weight: Float
    feet: Int
    inches: Int
    gender: Boolean
    age: Int
    recommendedCalorieCalculation: Float
    dailyCaloricIntake: Float
    currentCalories: Float
  }

  type Compare {
    result: Boolean
    currentCalories: Float  
  }

  type Mutation {
    createUser(username: String!, password: String!): UserInfo
    loginUser(username: String!, password: String! ): UserInfo

    addUserInfo(
      _id: ID!,
      weight: Float,
      feet: Int,
      inches: Int,
      gender: Boolean,
      age: Int
    ): UserInfo


    
    recommendedCalorieCalculation(
      _id: ID!
    ): Float
    compareUserCalories(_id: String!, foodName: String!): Compare
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
    currentCalories: Float
  }
`;

export default typeDefs;
