# tomogachi-diet-tracker

## Description
Our TamaPudgy is a full-stack MERN (MongoDB, Express, React, Node.js) application providing an intuitive platform for users that is designed to help their track their daily food intake and calorie consumption. We utilized CalorieNinjas API that allows users to obtain calorie data for every food items input. TamaPudgy is a useful tool for anyone trying to better manage their diet because it allows users to quickly receive precise calorie and nutritional information for almost any food item they enter. 

The app features a playful virtual pet avatar whose weight reflects the user's calorie intake. If you consume more calories than is advised, your pet avatar will gain weight and if you consume less calories than advised, your pet avatar will lose weight. In a fun and interesting approach, this dynamic feedback system assists users in maintaining their diet.

## Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Installation Steps](#installation-steps)
- [Contributors](#contributors)
- [Screenshots](#screenshots)
- [License](#license)
- [Badge](#badge)
- [](#)

## Features
* Track Food Items: Add food items and view calorie information in real-time.
* Daily Intake Summary: Automatically calculate and display the total daily calories.
* Custom Recommendations: Compare your daily calorie intake to recommended values.
* GraphQL API Integration: Simplified data querying for efficient communication between front-end and back-end.
* Third-Party API: Leverages the CalorieNinjas API to fetch nutritional data for food items.

## Usage
- Add food items using the search bar.
- View daily calorie totals and recommendations on your dashboard.
- Monitor your virtual pet's weight as it reacts to your calorie intake.

## Technologies Used
Front-End:

* React
* TypeScript
* Apollo Client
* Styled Components / CSS
* Tailwind CSS

Back-End:
  
* Node.js
* Express.js
* Apollo Server
* MongoDB (via Mongoose)
* CalorieNinjas API

## Installation Steps
1. Clone the repository:
   ```bash
   git clone git@github.com:anthonymoon2/TomoPudgy.git

2. Install Dependencies:
   ```
   npm install

3. Configure Environment Variables:
* Create .env file in the /server directory with the following:
   ```
   MONGODB_URI='mongodb://127.0.0.1:27017/tamapudgy'
   CALORIE_NINJA_API_KEY=your-api-key
   JWT_SECRET_KEY=YOUR_SECRET_KEY

4. Start the Application:
   ```
   npm run build
   npm run start:dev

5. Access the App:
   ```
   Navigate to http://localhost:3000 for the client side.
   Use http:localhost:3001/graphql for the GraphQL playground.

## Contributors
 - Vuong: https://github.com/vluu11
 - Kenjy: https://github.com/Kenhie94
 - Bob: https://github.com/bobdajacob
 - Anthony: https://github.com/anthonymoon2
 - Joshua: https://github.com/joshcord99

## Screenshots

### Landing Page 
![alt text](./assets/Landing%20Page.PNG)

### Home Page
![alt text](./assets/Home%20Page.PNG)

### Profile Page
![alt text](./assets/Profile%20Page.PNG)

## License
This project is licensed under the [MIT License](<![License](https://opensource.org/licenses/MIT)>).
(Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.)

## Badge
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
