// import { Query } from "mongoose";
import UserInfo, { IUserInfo } from "../models/UserInfo.js";

const resolvers = {
  Query: {
    getUserInfo: async (_: any, { _id }: {_id: string}): Promise<IUserInfo | null> => {
      try {
        const user = await UserInfo.findById(_id);
        return user;
      } catch (error) {
        console.error('Error fetching user info', error);
        return null;
      }
    }
  },

  Mutation: {
    createUser: async (
      args: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const userLogin = await UserInfo.create(args);
        return userLogin;
      } catch (err) {
        console.error("Error creating UserLogin:", err);
        return null;
      }
    },

    loginUser: async (
      { username, password }: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const userLogin = await UserInfo.findOne({ username, password });
        return userLogin;
      } catch (err) {
        console.error("Error checking UserLogin:", err);
        return null;
      }
    },

    addUserInfo: async (
      { _id, updateData }: { _id: string; updateData: Partial<IUserInfo> }
    ): Promise<IUserInfo | null> => {
      try {
        const updatedUserInfo = await UserInfo.findOneAndUpdate(
          { _id },
          { $set: updateData },
          { new: true }
        );
        return updatedUserInfo;
      } catch (err) {
        console.error("Error updating UserInfo:", err);
        return null;
      }
    },
  },
};

export default resolvers;
