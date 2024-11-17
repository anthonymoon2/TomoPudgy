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