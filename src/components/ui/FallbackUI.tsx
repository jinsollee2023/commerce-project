import { Button } from "./button";
import { FallbackProps } from "react-error-boundary";

const FallbackUI = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="p-32 flex flex-col items-center space-y-6">
      <div>
        <p>문제가 발생했습니다.</p>
        <p>{error.message}</p>
      </div>
      <Button onClick={resetErrorBoundary}>다시 시도하기</Button>
    </div>
  );
};

export default FallbackUI;
