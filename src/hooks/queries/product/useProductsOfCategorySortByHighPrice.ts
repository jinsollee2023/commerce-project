import { productAPI } from "@/lib/api/productAPI";
import { IInpiniteProductPages } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const useProductsOfCategorySortByHighPrice = (
  category: string,
  sortByValue: string
) => {
  const {
    fetchNextPage: fetchNextCategorySortByHighPrice,
    hasNextPage: hasNextCategorySortByHighPricePage,
    isFetchingNextPage: isFetchingNextCategorySortByHighPrice,
    data: categorySortByHighPrice,
    isError: isErrorCategorySortByHighPrice,
    isLoading: isLoadingCategorySortByHighPrice,
  } = useInfiniteQuery<IInpiniteProductPages>({
    queryKey: ["productsOfCategory", category, sortByValue],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await productAPI.getProductsOfCategorySortByHighPrice(
        category,
        pageParam as number
      );
      return result as IInpiniteProductPages;
    },
    initialPageParam: 100000000000,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPageParam;
    },
  });
  return {
    fetchNextCategorySortByHighPrice,
    hasNextCategorySortByHighPricePage,
    isFetchingNextCategorySortByHighPrice,
    categorySortByHighPrice,
    isErrorCategorySortByHighPrice,
    isLoadingCategorySortByHighPrice,
  };
};

export default useProductsOfCategorySortByHighPrice;
