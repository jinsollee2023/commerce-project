import { productAPI } from "@/lib/api/productAPI";
import { getKoreaTimeDate } from "@/shared/common";
import { IInpiniteProductPages } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const useProductsOfCategoryQueries = (category: string) => {
  const {
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
    isFetchingNextPage: isFetchingNextCategoryPage,
    data: productsOfCategory,
    isError: isErrorProductsOfCategory,
    isLoading: isLoadingProductsOfCategory,
  } = useInfiniteQuery<IInpiniteProductPages>({
    queryKey: ["productsOfCategory", category],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await productAPI.getProductsOfCategory(
        category,
        pageParam as number
      );
      return result as IInpiniteProductPages;
    },
    enabled: !!category,
    initialPageParam: getKoreaTimeDate().getTime(),
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPageParam;
    },
  });

  return {
    fetchNextCategoryPage,
    hasNextCategoryPage,
    isFetchingNextCategoryPage,
    productsOfCategory,
    isErrorProductsOfCategory,
    isLoadingProductsOfCategory,
  };
};

export default useProductsOfCategoryQueries;
