import useProductsOfCategoryQueries from "@/hooks/queries/product/useProductsOfCategoryQueries";
import ProductListBox from "./ProductListBox";
import { IInpiniteProduct } from "@/types/types";
import { categoryTitle } from "@/shared/common";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { useState } from "react";
import useProductsOfCategorySortByHighPrice from "@/hooks/queries/product/useProductsOfCategorySortByHighPrice";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "../ui/FallbackUI";

const AllProductOfCategory = () => {
  const path = location.pathname;
  const category = path.slice(1);
  const [sortByValue, setSortByValue] = useState("createdAt");

  const {
    fetchNextCategoryPage,
    hasNextCategoryPage,
    isFetchingNextCategoryPage,
    productsOfCategory,
    isErrorProductsOfCategory,
    isLoadingProductsOfCategory,
  } = useProductsOfCategoryQueries(category);

  const {
    fetchNextCategorySortByHighPrice,
    hasNextCategorySortByHighPricePage,
    isFetchingNextCategorySortByHighPrice,
    categorySortByHighPrice,
    isErrorCategorySortByHighPrice,
    isLoadingCategorySortByHighPrice,
  } = useProductsOfCategorySortByHighPrice(category, sortByValue);

  const productListProps = {
    products:
      sortByValue === "createdAt"
        ? (productsOfCategory as IInpiniteProduct)
        : (categorySortByHighPrice as IInpiniteProduct),
    fetchNextPage:
      sortByValue === "createdAt"
        ? fetchNextCategoryPage
        : fetchNextCategorySortByHighPrice,
    hasNextPage:
      sortByValue === "createdAt"
        ? hasNextCategoryPage
        : hasNextCategorySortByHighPricePage,
    isFetchingNextPage:
      sortByValue === "createdAt"
        ? isFetchingNextCategoryPage
        : isFetchingNextCategorySortByHighPrice,
    isLoading:
      sortByValue === "createdAt"
        ? isLoadingProductsOfCategory
        : isLoadingCategorySortByHighPrice,
    isError:
      sortByValue === "createdAt"
        ? isErrorProductsOfCategory
        : isErrorCategorySortByHighPrice,
  };

  return (
    <>
      <div className="pt-4 pb-6 flex justify-between items-center">
        <p className="text-2xl font-semibold">{categoryTitle(category)}</p>
        <div className="w-[180px]">
          <Select
            defaultValue="createdAt"
            onValueChange={(value) => setSortByValue(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택해주세요." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="createdAt">최신순</SelectItem>
                <SelectItem value="productHighPrice">가격순</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
              <ProductListBox {...productListProps} />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </>
  );
};

export default AllProductOfCategory;
