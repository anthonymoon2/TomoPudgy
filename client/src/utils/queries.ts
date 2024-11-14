import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetUserInfo($id: String!) {
    getUserInfo(_id: $id) {
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