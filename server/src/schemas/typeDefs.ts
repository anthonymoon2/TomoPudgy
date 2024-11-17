const typeDefs = `
  type Query {
    getUserInfo(_id: String!): UserInfo

    getFoodItem(foodName: String!): FoodItem

    calculateUserCalories(_id: String!, foodName: String!): Float
    me: UserInfo
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
    foodItems: [FoodItem!]!
  }
  
  type Compare {
    result: Boolean
    currentCalories: Float  
    }
    
<<<<<<< HEAD
  type FoodItem {
    name: String!
    calories: Float!
    _id: ID!
  } 
=======
type Compare {
  result: Boolean
  currentCalories: Float
  weight: Float
}

      
    type FoodItem {
      name: String!
      calories: Float!
      _id: ID!
    } 
>>>>>>> b0e8cc520f645e151234a90d75b1907fbef650bb

  type Auth {
    token: String!
    userLogin: UserInfo
  }
  
  input ProfileInput {
    username: String!
    password: String!
  }

  type Mutation {
<<<<<<< HEAD
    createUser(input: ProfileInput!): Auth
=======
    createUser(username: String!, password: String!): Auth

>>>>>>> b0e8cc520f645e151234a90d75b1907fbef650bb
    loginUser(username: String!, password: String! ): Auth

    addUserInfo(
      _id: ID!,
      weight: Float,
      feet: Int,
      inches: Int,
      gender: Boolean,
      age: Int
    ): UserInfo
    recommendedCalorieCalculation(_id: ID!): Float
      compareUserCalories(_id: String!): Compare
      addFoodItemToUser(userId: String!, foodName: String!): FoodItem

  }
`;


export default typeDefs;
