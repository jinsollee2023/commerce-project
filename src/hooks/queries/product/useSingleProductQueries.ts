import { queryClient } from "@/App";
import { productAPI } from "@/lib/api/productAPI";
import { useQuery } from "@tanstack/react-query";

interface useSingleProductQueriesProps {
  productId: string;
}

const useSingleProductQueries = ({
  productId,
}: useSingleProductQueriesProps) => {
  const {
    data: singleProductData,
    isError: isErrorSingleProductData,
    isLoading: isLoadingSingleProductData,
  } = useQuery({
    queryKey: ["singleProduct", productId],
    queryFn: async () => {
      try {
        const productData = await productAPI.getSingleProduct(productId);
        return productData;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: !!productId,
  });

  const prefetchProductData = async (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["singleProduct", productId],
      queryFn: async () => {
        try {
          const productData = await productAPI.getSingleProduct(productId);
          return productData;
        } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
      },
    });
  };

  return {
    singleProductData,
    isErrorSingleProductData,
    isLoadingSingleProductData,
    prefetchProductData,
  };
};

export default useSingleProductQueries;
