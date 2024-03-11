import { IOrder } from "@/types/types";
import OrderItemCard from "./OrderItemCard";
import useOrderQueries from "@/hooks/queries/order/useOrderQueries";

const OrderItemBox = () => {
  const myId = localStorage.getItem("userId");
  const isSeller = localStorage.getItem("isSeller");
  const role = isSeller === "true" ? "seller" : "buyer";
  const { orderData, isErrorOrderData, isLoadingOrderData } = useOrderQueries({
    id: myId as string,
    role,
  });

  if (isLoadingOrderData) {
    <p>Loading...</p>;
  }

  if (isErrorOrderData) {
    <p>Error...</p>;
  }

  return (
    <div className="pt-4 pb-10">
      <div className="py-4 flex justify-between border-b">
        <div className="w-3/4 sm:w-[40%]">상품 정보</div>
        <div className="w-[15%] text-center hidden sm:block ">판매가</div>
        <div className="w-[15%] text-center hidden sm:block ">수량</div>
        <div className="w-[15%] text-center hidden sm:block">합계</div>
        <div className="w-1/4 sm:w-[15%] text-center">상태</div>
      </div>

      {orderData ? (
        orderData?.map((item: IOrder, idx: number) => {
          return (
            <div key={idx} className="py-4 border-b">
              <OrderItemCard orderItem={item} role={role} />
            </div>
          );
        })
      ) : (
        <p className="pt-8">주문 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default OrderItemBox;
