import { productAPI } from "@/lib/api/productAPI";
import { getKoreaTimeDate } from "@/shared/common";
import { IInpiniteProductPages } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useSellerProductsQueriesProps {
  sellerId: string;
}

const useSellerProductsQueries = ({
  sellerId,
}: useSellerProductsQueriesProps) => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: productListBySeller,
    isError: isErrorProductListBySeller,
    isLoading: isLoadingProductListBySeller,
  } = useInfiniteQuery<IInpiniteProductPages>({
    queryKey: ["productsBySellerId", sellerId],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await productAPI.getProductsBySeller(
        sellerId,
        pageParam as number
      );
      return result as IInpiniteProductPages;
    },
    initialPageParam: getKoreaTimeDate().getTime(),
    enabled: !!sellerId,
    staleTime: 0,
    gcTime: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam ?? undefined,
  });

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    productListBySeller,
    isErrorProductListBySeller,
    isLoadingProductListBySeller,
  };
};

export default useSellerProductsQueries;
