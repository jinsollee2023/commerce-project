// import React from 'react'
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import CartDrawer from "../products/cart/CartDrawer";
import { useCart } from "@/store/CartContext";
import { GrCart } from "react-icons/gr";
import { Badge } from "../ui/badge";
import "./styles.css";
import OrderFormModal from "../order/OrderFormModal";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { toast } = useToast();

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const userId = user ? user : localStorage.getItem("userId");
  const isSeller = localStorage.getItem("isSeller") === "true" ? true : false;

  const logButtonHandler = async () => {
    if (userId) {
      await signOut(auth);
      localStorage.removeItem("userId");
      localStorage.removeItem("isSeller");
      localStorage.removeItem("cartItemList");

      toast({
        variant: "green",
        title: "로그아웃 되었습니다.",
        duration: 1000,
      });
    }
    navigate("/login");
  };

  const { setCartIsOpen, cartIsOpen, cartItemList } = useCart();
  let totalAmount = 0;
  cartItemList?.forEach((item) => {
    totalAmount += item.qunatity;
  });

  return (
    <div className="h-[10vh] fixed top-0 left-0 w-full mx-auto px-[10%] shadow-sm flex items-center z-30 bg-slate-100">
      <nav className="w-full flex items-center justify-between">
        <span className="cursor-pointer" onClick={() => navigate("/")}>
          Logo
        </span>
        {!loading && userId ? (
          <div className="flex space-x-2">
            <div
              className={`nav-button-wrapper ${
                path === "/" ? "hidden" : "flex"
              }`}
            >
              <button onClick={() => navigate("/")}>HOME</button>
            </div>
            <div
              className={`nav-button-wrapper ${
                path === "/mypage" ? "hidden" : "flex"
              }`}
            >
              <button
                onClick={() => navigate("/mypage")}
                data-cy="mypage-button"
              >
                MYPAGE
              </button>
            </div>
            <div className="nav-button-wrapper flex">
              <button onClick={logButtonHandler} className="mr-1">
                LOGOUT
              </button>
            </div>
            {!isSeller && (
              <div className="relative">
                <Button
                  onClick={() => setCartIsOpen(!cartIsOpen)}
                  variant="ghost"
                  size="icon"
                >
                  <GrCart size={18} />
                </Button>
                <Badge size="mini" className="absolute top-0 right-0">
                  {totalAmount}
                </Badge>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <button
              className={`${
                path === "/login" || path === "/sign-up" ? "hidden" : "none"
              }`}
              onClick={logButtonHandler}
            >
              LOGIN
            </button>
          )
        )}
      </nav>
      <CartDrawer />
      <OrderFormModal />
    </div>
  );
};

export default NavBar;
