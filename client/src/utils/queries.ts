import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetUserInfo($id: String!) {
    getUserInfo(_id: $id) {
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