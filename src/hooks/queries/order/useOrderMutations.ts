import { queryClient } from "@/App";
import { orderAPI } from "@/lib/api/orderAPI";
import { getKoreaTimeDate } from "@/shared/common";
import { ICartItem, IOrder } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

const useOrderMutations = () => {
  const myId = localStorage.getItem("userId");
  const addOrderMutation = useMutation({
    mutationFn: async (orderItem: ICartItem) => {
      const { sellerId, id } = orderItem.product;
      const newOrder: IOrder = {
        id: uuidv4(),
        sellerId: sellerId,
        buyerId: myId as string,
        productId: id,
        productQunatity: orderItem.qunatity,
        status: "주문 완료",
        createdAt: getKoreaTimeDate(),
        updatedAt: getKoreaTimeDate(),
      };
      return await orderAPI.addOrder(newOrder);
    },
    onMutate: async (value) => {
      const previousOrders: IOrder[] | undefined = queryClient.getQueryData([
        "orderList",
        myId,
      ]);
      if (previousOrders) {
        await queryClient.cancelQueries({
          queryKey: ["orderList", myId],
        });
        queryClient.setQueryData(
          ["orderList", myId],
          [
            ...previousOrders,
            {
              id: uuidv4(),
              sellerId: value.product.sellerId,
              buyerId: myId as string,
              productId: value.product.id,
              productQunatity: value.qunatity,
              status: "주문 완료",
              createdAt: getKoreaTimeDate(),
              updatedAt: getKoreaTimeDate(),
            },
          ]
        );
        return { previousOrders };
      }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["orderList", myId], context?.previousOrders);
      console.log(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderList", myId],
      });
    },
  });

  const updateOrderStateMutate = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      await orderAPI.updateOrderState(orderId, status);
    },
    onMutate: async (value) => {
      const previousOrders: IOrder[] | undefined = queryClient.getQueryData([
        "orderList",
        myId,
      ]);
      if (previousOrders) {
        await queryClient.cancelQueries({
          queryKey: ["orderList", myId],
        });
        queryClient.setQueryData(
          ["orderList", myId],
          previousOrders.map((order) => {
            if (order.id === value.orderId) {
              return { ...order, status: value.status };
            } else return;
          })
        );
        return { previousOrders };
      }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["orderList", myId], context?.previousOrders);
      console.log(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderList", myId],
      });
    },
  });

  return { addOrderMutation, updateOrderStateMutate };
};

export default useOrderMutations;
