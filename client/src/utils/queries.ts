import { gql } from '@apollo/client';

export const GET_USER_HISTORY = gql 
`query ExampleQuery {
  getUserHistoryLog {
    username
    currentCalories
    foodItems {
      name
      calories
      _id
    }
    resetHistory {
      date
      calories
      foodItems{
        name
        calories
        _id
      }  
    }
  }
}
`

export const GET_USER_INFO = gql`
  query GetUserInfo($id: String!) {
    getUserInfo(_id: $id) {
      _id
      username
      weight
      feet
      inches
      gender
      age
      recommendedCalorieCalculation
      currentCalories
      isOverRecommendedCalories
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
      weight
      feet
      inches
      gender
      age
      recommendedCalorieCalculation
      currentCalories
      isOverRecommendedCalories
      foodItems {
        _id       
        name      
        calories  
      }
    }
  }
    
`;
