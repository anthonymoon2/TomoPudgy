import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      _id
      username
      password
      Weight
      Height
      Gender
      Age
      RecommendedCalorieCalculation
      DailyCaloricIntake
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      _id
      username
      password
      Weight
      Height
      Gender
      Age
      RecommendedCalorieCalculation
      DailyCaloricIntake
    }
  }
`;