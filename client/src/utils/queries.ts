import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetUserInfo($id: String!) {
    getUserInfo(_id: $id) {
      _id
      username
      password
      weight
      feet
      inches
      gender
      age
      recommendedCalorieCalculation
      dailyCaloricIntake
      currentCalories
      foodItems {
        _id       
        name      
        calories  
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      password
      weight
      feet
      inches
      gender
      age
      recommendedCalorieCalculation
      dailyCaloricIntake
      currentCalories
      foodItems {
        _id       
        name      
        calories  
      }
    }
  }
`;
