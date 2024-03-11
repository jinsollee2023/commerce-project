import FourProductsByCategory from "@/components/products/FourProductsByCategory";
import SearchInput from "@/components/products/search/SearchInput";
import RoleDialog from "@/components/signUp/RoleDialog";
import { userAPI } from "@/lib/api/userAPI";
import { useUser } from "@/store/UserContext";
import { IGoogleUser } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<IGoogleUser>();
  const { setUser, setIsSeller } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = parsedHash.get("access_token");
    const getUserData = async () => {
      try {
        const googleUserData = await userAPI.getUserFromGoogle(
          accessToken as string
        );
        setGoogleUser(googleUserData);
        const userDataFromDatabase = await userAPI.getUserFromDatabase(
          googleUserData.id
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
        googleUserData={googleUser as IGoogleUser}
      />
      <SearchInput />
      <FourProductsByCategory />
    </div>
  );
};

export default Home;
