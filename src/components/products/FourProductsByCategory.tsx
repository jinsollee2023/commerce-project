import useProductsOfCategoryQueries from "@/hooks/queries/product/useProductsOfCategoryQueries";
import MainCategorySection from "./MainCategorySection";
import { IInpiniteProduct } from "@/types/types";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "../ui/FallbackUI";

const FourProductsByCategory = () => {
  const {
    productsOfCategory: productsOfEarring,
    isErrorProductsOfCategory: isErrorProductsOfEarring,
    isLoadingProductsOfCategory: isLoadingProductsOfEarring,
  } = useProductsOfCategoryQueries("earring");

  const {
    productsOfCategory: productsOfBracelet,
    isErrorProductsOfCategory: isErrorProductsOfBracelet,
    isLoadingProductsOfCategory: isLoadingProductsOfBracelet,
  } = useProductsOfCategoryQueries("bracelet");

  const {
    productsOfCategory: productsOfNecklace,
    isErrorProductsOfCategory: isErrorProductsOfNecklace,
    isLoadingProductsOfCategory: isLoadingProductsOfNecklace,
  } = useProductsOfCategoryQueries("necklace");

  const {
    productsOfCategory: productsOfRing,
    isErrorProductsOfCategory: isErrorProductsOfRing,
    isLoadingProductsOfCategory: isLoadingProductsOfRing,
  } = useProductsOfCategoryQueries("ring");

  if (
    isLoadingProductsOfRing ||
    isLoadingProductsOfNecklace ||
    isLoadingProductsOfEarring ||
    isLoadingProductsOfBracelet
  ) {
    return <p>Loading...</p>;
  }
  if (
    isErrorProductsOfRing ||
    isErrorProductsOfNecklace ||
    isErrorProductsOfEarring ||
    isErrorProductsOfBracelet
  ) {
    return <p>Error..</p>;
  }

  return (
    <div>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
            <MainCategorySection
              category="necklace"
              products={productsOfNecklace as IInpiniteProduct}
            />
            <MainCategorySection
              category="earring"
              products={productsOfEarring as IInpiniteProduct}
            />
            <MainCategorySection
              category="bracelet"
              products={productsOfBracelet as IInpiniteProduct}
            />
            <MainCategorySection
              category="ring"
              products={productsOfRing as IInpiniteProduct}
            />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
};

export default FourProductsByCategory;
