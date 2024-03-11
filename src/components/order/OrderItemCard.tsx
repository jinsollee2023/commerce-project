import useUserQueries from "@/hooks/queries/user/useUserQueries";
import { IOrder } from "@/types/types";
import ProductNumberWrapper from "../ui/ProductNumberWrapper";
import useSingleProductQueries from "@/hooks/queries/product/useSingleProductQueries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrderMutations from "@/hooks/queries/order/useOrderMutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

interface OrderItemCardProps {
  orderItem: IOrder;
  role: "seller" | "buyer";
}
const OrderItemCard = ({ orderItem, role }: OrderItemCardProps) => {
  const { userData, userDataIsLoading, userDataIsError } = useUserQueries({
    userId: orderItem?.sellerId,
  });
  const { productId, productQunatity, status } = orderItem || {};
  const {
    singleProductData,
    isErrorSingleProductData,
    isLoadingSingleProductData,
  } = useSingleProductQueries({ productId: productId as string });
  const { productImage, productName, productPrice } = singleProductData || {};
  const { toast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>(status);
  const onStatusSelectHandler = (value: string) => {
    if (role === "buyer" && orderStatus !== "주문 완료") {
      toast({
        variant: "destructive",
        title: "판매자에게 문의해주세요.",
        duration: 1500,
      });
    } else {
      setOrderStatus(value);
      setIsConfirmOpen(true);
    }
  };

  const { updateOrderStateMutate } = useOrderMutations();
  const onStatusChange = () => {
    updateOrderStateMutate.mutate({
      orderId: orderItem.id,
      status: orderStatus,
    });
  };

  if (userDataIsLoading || isErrorSingleProductData) {
    return <p>Loading...</p>;
  }

  if (userDataIsError || isLoadingSingleProductData) {
    return <p>Error...</p>;
  }
  return (
    <div
      className="flex items-center justify-between"
      data-cy="order-item-card"
    >
      <div className="w-3/4 sm:w-[40%] flex items-center space-x-2">
        <img
          src={productImage && (productImage[0] as string)}
          className="w-20 h-20"
        />
        <div className="flex flex-col">
          <span
            className={`text-muted-foreground text-sm ${
              role === "seller" ? "hidden" : ""
            }`}
          >
            {userData?.nickname}
          </span>
          <span>{productName}</span>
          <div className="flex space-x-1">
            <ProductNumberWrapper
              type="price"
              productPrice={productPrice}
              className="sm:hidden"
            />
            <span className="sm:hidden">*</span>
            <ProductNumberWrapper
              type="qunatity"
              productQunatity={productQunatity}
              className="sm:hidden"
            />
          </div>
          <ProductNumberWrapper
            type="price"
            productPrice={productPrice * productQunatity}
            className="sm:hidden"
          />
        </div>
      </div>
      <div className="w-[15%] hidden sm:flex sm:justify-center">
        <ProductNumberWrapper type="price" productPrice={productPrice} />
      </div>
      <div className="w-[15%] hidden sm:flex sm:justify-center">
        <ProductNumberWrapper
          type="qunatity"
          productQunatity={productQunatity}
        />
      </div>
      <div className="w-[15%] hidden sm:block">
        <ProductNumberWrapper
          type="price"
          productPrice={productPrice * productQunatity}
          className="flex justify-center"
        />
      </div>
      <div className="w-1/3 sm:w-[15%] flex justify-center">
        {status !== "주문 취소" ? (
          <Select
            defaultValue={status}
            value={status}
            onValueChange={(value) => onStatusSelectHandler(value)}
          >
            <SelectTrigger className="statusStyle" data-cy="status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="주문 완료" data-cy="ordered-option">
                주문 완료
              </SelectItem>
              <SelectItem
                value="발송 대기"
                className={role === "buyer" ? "hidden" : ""}
                data-cy="send-wating-option"
              >
                발송 대기
              </SelectItem>
              <SelectItem
                value="발송 시작"
                className={role === "buyer" ? "hidden" : ""}
                data-cy="send-start-option"
              >
                발송 시작
              </SelectItem>
              <SelectItem value="주문 취소" data-cy="canceled-option">
                주문 취소
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="mx-auto">주문 취소</p>
        )}
      </div>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>주문 상태 변경</AlertDialogTitle>
            <AlertDialogDescription>
              {productName}의 주문 상태를 {orderStatus}로 변경하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onStatusChange}
              data-cy="status-change-ok-option"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderItemCard;
