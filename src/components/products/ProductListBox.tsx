import { IInpiniteProduct } from "@/types/types";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import _debounce from "lodash/debounce";
import ProductCard from "./ProductCard";
import { Button } from "../ui/button";

interface ProductListBoxProps {
  category?: string;
  products: IInpiniteProduct | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
}

const ProductListBox = ({
  products,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
}: ProductListBoxProps) => {
  const { ref, inView } = useInView();
  const debouncedFetchNextPage = _debounce(fetchNextPage, 500);
  const [viewType, setViewType] = useState("grid");

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      debouncedFetchNextPage();
    }
  }, [inView]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>portfolios Error..</p>;
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="link"
          size="icon"
          className={viewType === "grid" ? "underline-offset-4 underline" : ""}
          onClick={() => setViewType("grid")}
        >
          grid
        </Button>
        <Button
          variant="link"
          size="icon"
          className={viewType === "list" ? "underline-offset-4 underline" : ""}
          onClick={() => setViewType("list")}
        >
          list
        </Button>
      </div>
      <div
        className={`w-full ${
          viewType === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
            : "space-y-2"
        }`}
      >
        {products?.pages.map((group, idx) => (
          <React.Fragment key={idx}>
            {group?.sortedProductsArray?.length > 0 &&
              group.sortedProductsArray.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewType={viewType}
                />
              ))}
          </React.Fragment>
        ))}
      </div>
      {products?.pages.every(
        (group) => group.sortedProductsArray.length === 0
      ) && <p>등록된 상품이 없습니다.</p>}
      <div ref={ref} className="h-10"></div>
    </>
  );
};

export default ProductListBox;
