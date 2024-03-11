import OrderItemBox from "./OrderItemBox";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "@/components/ui/FallbackUI";

const OrderManagement = () => {
  return (
    <>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={FallbackUI}>
            <OrderItemBox />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
};

export default OrderManagement;
