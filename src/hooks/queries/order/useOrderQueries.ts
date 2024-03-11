import { orderAPI } from "@/lib/api/orderAPI";
import { useQuery } from "@tanstack/react-query";

interface useOrderQueriesProps {
  id: string;
  role: "seller" | "buyer";
}

const useOrderQueries = ({ id, role }: useOrderQueriesProps) => {
  const {
    data: orderData,
    isError: isErrorOrderData,
    isLoading: isLoadingOrderData,
  } = useQuery({
    queryKey: ["orderList", id],
    queryFn: async () => {
      try {
        const orderData = await orderAPI.getOrderList(id, role);
        return orderData;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: !!id && !!role,
  });
  return { orderData, isErrorOrderData, isLoadingOrderData };
};

export default useOrderQueries;
