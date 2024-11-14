import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      _id
      username
      password
      weight
      height
      gender
      age
      recommendedCalorieCalculation
      dailyCaloricIntake
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      _id
      username
      password
      weight
      height
      gender
      age
      recommendedCalorieCalculation
      dailyCaloricIntake
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($weight: Integer!, $height: Integer!, $age: Integer!, $gender: String!) {
    updateUser(weight: $weight, height: $height, age: $age, gender: $gender) {
      token
      user {
        weight
        height
        age
        gender
      }
    }
  }
`