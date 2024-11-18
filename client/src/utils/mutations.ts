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
    }
  }
`