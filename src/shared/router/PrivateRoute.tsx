import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const AnyRoute = (): React.ReactElement => {
  return <Outlet />;
};

export const PrivateRoute = (): React.ReactElement => {
  const { toast } = useToast();
  const user = localStorage.getItem("userId");

  const userCheck = (user: any | null): boolean => {
    if (user) {
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "로그인 후에 접근 가능합니다.",
        duration: 1000,
      });
      return false;
    }
  };

  return userCheck(user) ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoute = (): React.ReactElement => {
  const { toast } = useToast();
  const user = localStorage.getItem("userId");

  const userCheck = (user: any | null): boolean => {
    if (user) {
      toast({
        variant: "destructive",
        title: "로그인 상태입니다.",
        duration: 1000,
      });
      return true;
    } else {
      return false;
    }
  };
  return userCheck(user) ? <Navigate to="/" /> : <Outlet />;
};

export const SellerRoute = (): React.ReactElement => {
  const { toast } = useToast();
  const isSeller = localStorage.getItem("isSeller") === "true" ? true : false;

  const sellerCheck = (isSeller: boolean): boolean => {
    if (isSeller) {
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "판매자만 접근 가능합니다.",
        duration: 1000,
      });
      return false;
    }
  };
  return sellerCheck(isSeller) ? <Outlet /> : <Navigate to="/" />;
};
