import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation CreateUser($input: ProfileInput!) {
    createUser(input: $input) {
      token
      userLogin {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      userLogin {
        _id
        username
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation Mutation($id: ID!, $weight: Float, $feet: Int, $inches: Int, $gender: Boolean, $age: Int) {
    addUserInfo(_id: $id, weight: $weight, feet: $feet, inches: $inches, gender: $gender, age: $age) {
      _id
      weight
      feet
      inches
      gender
      age
      recommendedCalorieCalculation
    }
  }
`;

export const ADD_USER_MEAL = gql`
  mutation Mutation($userId: String!, $foodName: String!) {
    addFoodItemToUser(userId: $userId, foodName: $foodName) {
      _id
      name
    }
  }
`;

export const CALCULATE_RECOMMENDED_CALORIES = gql`
  mutation Mutation($id: ID!) {
    recommendedCalorieCalculation(_id: $id)
  }
`

export const COMPARE_USER_CALORIES = gql`
  mutation CompareUserCalories($userId: String!) {
    compareUserCalories(_id: $userId) {
      weight
      result
      currentCalories
    }
  }
`