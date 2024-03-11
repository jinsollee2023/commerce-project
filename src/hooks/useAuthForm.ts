import { useToast } from "@/components/ui/use-toast";
import {
  signUpFormSchema,
  loginFormSchema,
} from "@/shared/form/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase";
import { IUser } from "@/types/types";
import { useUser } from "@/store/UserContext";
import useUserMutations from "./queries/user/useUserMutations";
import { userAPI } from "@/lib/api/userAPI";

export type ServerErrorResponse = {
  message: string;
};

const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setIsSeller } = useUser();
  const { addUserMutation } = useUserMutations();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
  });

  const addUser = async (
    values: z.infer<typeof signUpFormSchema>,
    uid: string
  ) => {
    const { name, email, role, password } = values;
    const isSeller = role === "seller" ? true : false;
    const date = new Date();

    const newUser: IUser = {
      id: uid,
      nickname: name,
      email,
      isSeller,
      password,
      createdAt: date,
      updatedAt: date,
    };
    addUserMutation.mutate(newUser);
  };

  const onAuthenticationSuccess = () => {
    toast({
      variant: "green",
      title: "로그인되었습니다.",
      duration: 1000,
    });
    const searchParams = new URLSearchParams(location.search);
    const nextParam = searchParams.get("next");
    if (nextParam) {
      navigate(nextParam);
    } else {
      navigate("/");
    }
  };

  const onSubmitSignUp = async (values: z.infer<typeof signUpFormSchema>) => {
    const { email, password, name } = values;
    setIsLoading(true);
    if (values.password === values.confirmPassword) {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, { displayName: name });
        await addUser(values, user.uid);
        onAuthenticationSuccess();
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "이미 사용 중인 이메일입니다.",
          duration: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
    }
  };

  const getUserInfoAndSetContext = async (userId: string) => {
    const user = await userAPI.getUserFromDatabase(userId);
    setUser(user);
    setIsSeller(user.isSeller);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isSeller", String(user.isSeller));
  };

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      getUserInfoAndSetContext(user.uid);
      onAuthenticationSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "잘못된 로그인 정보입니다.",
        duration: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToLoginOrSignUp = (path: string) => {
    navigate(`/${path}`);
  };

  return {
    isLoading,
    loginForm,
    onSubmitLogin,
    signUpForm,
    onSubmitSignUp,
    goToLoginOrSignUp,
  };
};

export default useAuthForm;
