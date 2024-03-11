import useSellerProductsQueries from "@/hooks/queries/product/useSellerProductsQueries";
import { useUser } from "@/store/UserContext";
import _debounce from "lodash/debounce";
import ProductListBox from "../ProductListBox";
import { IInpiniteProduct } from "@/types/types";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "@/components/ui/FallbackUI";

const AllProduct = () => {
  const { user } = useUser();
  const userId = user ? user.id : localStorage.getItem("userId");

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    productListBySeller,
    isErrorProductListBySeller,
    isLoadingProductListBySeller,
  } = useSellerProductsQueries({ sellerId: userId as string });

  return (
    <>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
            <ProductListBox
              products={productListBySeller as IInpiniteProduct}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isLoading={isLoadingProductListBySeller}
              isError={isErrorProductListBySeller}
            />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
};

export default AllProduct;
