import { productAPI } from "@/lib/api/productAPI";
import { getKoreaTimeDate } from "@/shared/common";
import { IInpiniteProductPages } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const useSearchProductsQueries = (searchKeword: string) => {
  const {
    fetchNextPage: fetchNextAllProductPage,
    hasNextPage: hasNextAllProductPage,
    isFetchingNextPage: isFetchingNextAllProductPage,
    data: allproductData,
    isError: isErrorAllProduct,
    isLoading: isLoadingAllProduct,
  } = useInfiniteQuery<IInpiniteProductPages>({
    queryKey: ["allProduct"],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await productAPI.getAllProduct(pageParam as number);
      return result as IInpiniteProductPages;
    },
    initialPageParam: getKoreaTimeDate().getTime(),
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPageParam;
    },
  });

  const filterAllProduct = () => {
    allproductData?.pages.forEach((group) => {
      const filteredProducts = group.sortedProductsArray.filter((product) =>
        product.productName.includes(searchKeword)
      );
      return filteredProducts;
    });
  };

  if (filterAllProduct.length < 17 && hasNextAllProductPage) {
    fetchNextAllProductPage();
  }

  return {
    fetchNextAllProductPage,
    hasNextAllProductPage,
    isFetchingNextAllProductPage,
    allproductData,
    isErrorAllProduct,
    isLoadingAllProduct,
  };
};

export default useSearchProductsQueries;
