import { IOrder } from "@/types/types";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  query,
  orderByChild,
  equalTo,
  update,
} from "firebase/database";

export const orderAPI = {
  addOrder: async (newOrder: IOrder) => {
    const timestampCreatedAt = newOrder.createdAt.getTime();
    const timestampUpdatedAt = newOrder.updatedAt.getTime();

    const newOrderWithTimestamp = {
      ...newOrder,
      createdAt: timestampCreatedAt,
      updatedAt: timestampUpdatedAt,
    };
    try {
      const db = getDatabase();
      set(ref(db, `orders/${newOrder.id}`), newOrderWithTimestamp);
      return newOrder;
    } catch (error) {
      console.error(error);
    }
  },

  getOrderList: async (id: string, role: "seller" | "buyer") => {
    try {
      const dbRef = ref(getDatabase());
      const queryRef = query(
        child(dbRef, "orders"),
        orderByChild(`${role}Id`),
        equalTo(id)
      );
      const snapshot = await get(queryRef);
      if (snapshot.exists()) {
        const orderList = Object.values(snapshot.val());
        return orderList as IOrder[];
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  },

  updateOrderState: async (orderId: string, status: string) => {
    const db = getDatabase();
    try {
      await update(ref(db, `orders/${orderId}`), {
        status: status,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
