import UserInfo, { IUserInfo } from "../models/UserInfo.js";
import UserLogin, { IUserLogin } from "../models/UserLogin.js";

const resolvers = {
  Query: {
    loginUser: async (
      { username, password }: { username: string; password: string }
    ): Promise<IUserLogin | null> => {
      try {
        const userLogin = await UserLogin.findOne({ username, password });
        return userLogin;
      } catch (err) {
        console.error("Error checking UserLogin:", err);
        return err;
      }
    },
  },

  Mutation: {
    createUser: async (
      args: { username: string; password: string }
    ): Promise<IUserLogin | null> => {
      try {
        const userLogin = await UserLogin.create(args);
        return userLogin;
      } catch (err) {
        console.error("Error creating UserLogin:", err);
        return err;
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
        return err;
      }
    },
  },
};

export default resolvers;
