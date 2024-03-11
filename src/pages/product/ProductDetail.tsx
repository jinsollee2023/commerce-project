import ProductDetailInfo from "@/components/products/ProductDetailInfo";
import FallbackUI from "@/components/ui/FallbackUI";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const ProductDetail = () => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
          <div className="h-full mt-28 mx-auto px-[5%] md:px-[15%]">
            <ProductDetailInfo />
          </div>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ProductDetail;
