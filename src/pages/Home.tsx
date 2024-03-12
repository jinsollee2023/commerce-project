import FourProductsByCategory from "@/components/products/FourProductsByCategory";
import SearchInput from "@/components/products/search/SearchInput";
import RoleDialog from "@/components/signUp/RoleDialog";
import { userAPI } from "@/lib/api/userAPI";
import { useUser } from "@/store/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, User, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebase";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<User>();
  const { setUser, setIsSeller } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = parsedHash.get("access_token");
    const getUserData = async () => {
      try {
        const credential = GoogleAuthProvider.credential(null, accessToken);
        const { user } = await signInWithCredential(auth, credential!);
        setGoogleUser(user);
        const userDataFromDatabase = await userAPI.getUserFromDatabase(
          user.uid
        );
        if (!userDataFromDatabase) {
          setOpen(true);
        } else {
          setUser(userDataFromDatabase);
          setIsSeller(userDataFromDatabase.isSeller);
          localStorage.setItem("userId", userDataFromDatabase.id);
          localStorage.setItem(
            "isSeller",
            String(userDataFromDatabase.isSeller)
          );
        }
      } catch (error) {
        throw error;
      } finally {
        navigate("/");
      }
    };
    accessToken && getUserData();
  }, []);

  return (
    <div className="mt-32 mx-auto px-[5%] md:px-[15%]">
      <RoleDialog
        open={open}
        setOpen={setOpen}
        googleUserData={googleUser as User}
      />
      <SearchInput />
      <FourProductsByCategory />
    </div>
  );
};

export default Home;
