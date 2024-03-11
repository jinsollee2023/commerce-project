import { IUser } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/App";
import { useUser } from "@/store/UserContext";
import { userAPI } from "@/lib/api/userAPI";

const useUserMutations = () => {
  const { setUser, setIsSeller } = useUser();

  const addUserMutation = useMutation({
    mutationFn: async (newUser: IUser) => {
      await userAPI.addUserToDatabase(newUser, setUser, setIsSeller);
    },
    onMutate: async (value) => {
      const previousUser: IUser[] | undefined = queryClient.getQueryData([
        "user",
      ]);
      if (previousUser) {
        await queryClient.cancelQueries({
          queryKey: ["user"],
        });
        queryClient.setQueryData(["user"], value);
      }
      return { previousUser, newUser: value };
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      queryClient.setQueryData(["user"], undefined);
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
  return { addUserMutation };
};

export default useUserMutations;
