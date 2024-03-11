import { useLocation } from "react-router-dom";
import ProductListBox from "../ProductListBox";
import SearchForm from "./SearchForm";
import useSearchProductsQueries from "@/hooks/queries/product/useSearchProductsQueries";
import { IInpiniteProduct } from "@/types/types";
import { useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "@/components/ui/FallbackUI";

export interface IInitialValues {
  searchKeyword: string;
  searchCategory: string;
  fromPrice: string;
  toPrice: string;
}

const SearchProducts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get("keyword")
    ? decodeURIComponent(searchParams.get("keyword") as string)
    : "";
  const searchCategory = searchParams.get("category")
    ? decodeURIComponent(searchParams.get("category") as string)
    : "";
  const searchToPrice = searchParams.get("toPrice")
    ? decodeURIComponent(searchParams.get("toPrice") as string)
    : "";
  const searchFromPrice = searchParams.get("fromPrice")
    ? decodeURIComponent(searchParams.get("fromPrice") as string)
    : "";

  const initialValues = {
    searchKeyword: searchKeyword,
    searchCategory: searchCategory,
    fromPrice: searchFromPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    toPrice: searchToPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  };
  const [searchItem, setSearchItem] = useState(initialValues);

  const {
    fetchNextAllProductPage,
    hasNextAllProductPage,
    isFetchingNextAllProductPage,
    allproductData,
    isErrorAllProduct,
    isLoadingAllProduct,
  } = useSearchProductsQueries(searchKeyword as string);

  const nameFilteredProductList = allproductData?.pages.map((group) => ({
    ...group,
    sortedProductsArray: group.sortedProductsArray.filter((product) =>
      product.productName.includes(searchKeyword as string)
    ),
  }));

  const categoryFilteredProductList = nameFilteredProductList?.map((group) => ({
    ...group,
    sortedProductsArray: group.sortedProductsArray.filter(
      (product) => product.productCategory === (searchCategory as string)
    ),
  }));

  const allFilteredProductList = (
    searchCategory ? categoryFilteredProductList : nameFilteredProductList
  )?.map((group) => ({
    ...group,
    sortedProductsArray: group.sortedProductsArray.filter((product) => {
      const formattedFromPrice = searchFromPrice ? searchFromPrice : 0;
      const formattedToPrice = searchToPrice ? searchToPrice : 10000000000;
      return (
        product.productPrice >= Number(formattedFromPrice) &&
        product.productPrice <= Number(formattedToPrice)
      );
    }),
  }));

  const productListProps = {
    products: {
      ...allproductData,
      pages: allFilteredProductList,
    } as IInpiniteProduct,
    fetchNextPage: fetchNextAllProductPage,
    hasNextPage: hasNextAllProductPage,
    isFetchingNextPage: isFetchingNextAllProductPage,
    isLoading: isLoadingAllProduct,
    isError: isErrorAllProduct,
  };

  return (
    <div className="space-y-2">
      <SearchForm searchItem={searchItem} setSearchItem={setSearchItem} />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
            <ProductListBox {...productListProps} />{" "}
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
};

export default SearchProducts;
