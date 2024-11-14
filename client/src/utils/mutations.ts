import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
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