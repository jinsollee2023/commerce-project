import { userAPI } from "@/lib/api/userAPI";
import { useQuery } from "@tanstack/react-query";

interface useGoogleUserQueriesProps {
  accessToken: string;
}
const useGoogleUserQueries = ({ accessToken }: useGoogleUserQueriesProps) => {
  const { data: googleUserData } = useQuery({
    queryKey: ["googleUser"],
    queryFn: async () => {
      try {
        const userData = await userAPI.getUserFromGoogle(accessToken);
        return userData;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!accessToken,
  });
  return { googleUserData };
};

export default useGoogleUserQueries;
