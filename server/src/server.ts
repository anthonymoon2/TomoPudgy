import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './utils/auth.js';
import path from 'node:path';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { resetCaloriesForAllUsers } from './utils/resetCaloriesAndFood.js';

dotenv.config();

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const usTimeZones = ['America/Los_Angeles'];

  usTimeZones.forEach((timezone) => {
    cron.schedule('0 0 * * *', async () => {
      console.log(`Running daily calorie reset for timezone: ${timezone}...`);
      await resetCaloriesForAllUsers();
    }, {
      scheduled: true,
      timezone: timezone
    });
  });
  
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
