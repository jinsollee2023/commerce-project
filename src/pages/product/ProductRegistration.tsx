import ProductForm from "@/components/products/seller/ProductForm";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "@/components/ui/FallbackUI";

const ProductRegistration = () => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
          <div className="mt-20 mx-auto px-[5%] md:px-[15%]">
            <ProductForm />
          </div>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ProductRegistration;
