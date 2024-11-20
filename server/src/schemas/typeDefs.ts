const typeDefs = `
  type Query {
    getUserInfo(_id: String!): UserInfo
    getFoodItem(foodName: String!): FoodItem
    calculateUserCalories(_id: String!, foodName: String!): Float
    me: UserInfo
    getUserHistoryLog(_id: String!, username: String!): UserHistoryResponse
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
    currentCalories: Float
    isOverRecommendedCalories: Boolean
    foodItems: [FoodItem!]!
    resetHistory: [ResetHistoryEntry!]!
  }
  
  type ResetHistoryEntry {
    date: String!
    calories: Float!
    foodItems: [String!]
  }

  type UserHistoryResponse {
    username: String!
    currentCalories: Float!
    foodItems: [String!]!
    resetHistory: [ResetHistoryEntry!]!
  }
  
  type Compare {
    result: Boolean
    currentCalories: Float
    weight: Float
  }

      
  type FoodItem {
    name: String
    calories: Float
    _id: ID!
  } 

  type Auth {
    token: String!
    userLogin: UserInfo
  }
  
  input ProfileInput {
    username: String!
    password: String!
  }

  type Mutation {
    createUser(input: ProfileInput!): Auth
    loginUser(username: String!, password: String! ): Auth

  addUserInfo(
    _id: ID!,
    weight: Float,
    feet: Int,
    inches: Int,
    gender: Boolean,
    age: Int,
  ): UserInfo

  recommendedCalorieCalculation(_id: ID!): Float
  compareUserCalories(_id: String!): Compare
  addFoodItemToUser(userId: String!, foodName: String!): FoodItem
  }
`;


export default typeDefs;
