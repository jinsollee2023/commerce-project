import { IUser } from "@/types/types";
import { getDatabase, ref, set, get, child } from "firebase/database";
import axios from "axios";

export const userAPI = {
  addUserToDatabase: async (
    newUser: IUser,
    setUser: (user: IUser) => void,
    setIsSeller: (isSeller: boolean) => void
  ) => {
    const db = getDatabase();
    const timestampCreatedAt = newUser.createdAt.getTime();
    const timestampUpdatedAt = newUser.updatedAt.getTime();
    const userWithTimestamp = {
      ...newUser,
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    };
    try {
      set(ref(db, "users/" + newUser.id), userWithTimestamp);
      setUser(newUser);
      setIsSeller(newUser.isSeller);
      localStorage.setItem("userId", newUser.id);
      localStorage.setItem("isSeller", String(newUser.isSeller));
    } catch (error) {
      console.error(error);
    }
  },

  getUserFromGoogle: async (accessToken: string) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getUserFromDatabase: async (userId: string) => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists()) {
        const user = snapshot.val();
        return user;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
