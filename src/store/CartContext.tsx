import { ICartItem } from "@/types/types";
import React, { createContext, useState } from "react";

interface CartContextProps {
  cartItemList: ICartItem[] | null;
  setCartItemList: (cartItemList: ICartItem[] | null) => void;
  cartIsOpen: boolean | null;
  setCartIsOpen: (user: boolean | null) => void;
  addCartItem: (cartItem: ICartItem) => void;
  deleteCartItem: (cartItemId: string) => void;
  updateCartItemQunatity: (cartItemId: string, itemQunatity: number) => void;
  clearCart: () => void;
}

const storedCartItemList = localStorage.getItem("cartItemList");

const contextDefaultValues: CartContextProps = {
  cartItemList: storedCartItemList ? JSON.parse(storedCartItemList) : null,
  setCartItemList: () => {},
  cartIsOpen: false,
  setCartIsOpen: () => {},
  addCartItem: () => {},
  deleteCartItem: () => {},
  updateCartItemQunatity: () => {},
  clearCart: () => {},
};

const CartContext = createContext(contextDefaultValues);

export const useCart = () => React.useContext(CartContext);

const CartProvider = ({ children }: any) => {
  const [cartItemList, setCartItemList] = useState(
    contextDefaultValues.cartItemList
  );
  const [cartIsOpen, setCartIsOpen] = useState(contextDefaultValues.cartIsOpen);

  const addCartItem = (cartItem: ICartItem) => {
    if (cartItem) {
      const updatedCartItemList = cartItemList
        ? [...cartItemList, cartItem]
        : [cartItem];

      setCartItemList(updatedCartItemList);
      localStorage.setItem("cartItemList", JSON.stringify(updatedCartItemList));
    }
  };

  const deleteCartItem = (cartItemId: string) => {
    if (cartItemId) {
      const cartItemListAfterDelete = cartItemList?.filter(
        (item) => item.product.id !== cartItemId
      );
      setCartItemList(cartItemListAfterDelete as ICartItem[]);
      localStorage.setItem(
        "cartItemList",
        JSON.stringify(cartItemListAfterDelete)
      );
    }
  };

  const updateCartItemQunatity = (cartItemId: string, itemQunatity: number) => {
    if (cartItemId && itemQunatity && cartItemList) {
      const cartItemListAfterUpdate = cartItemList.map((item) => {
        if (item.product.id === cartItemId) {
          return { ...item, qunatity: itemQunatity };
        } else {
          return item;
        }
      });
      setCartItemList(cartItemListAfterUpdate as ICartItem[]);
      localStorage.setItem(
        "cartItemList",
        JSON.stringify(cartItemListAfterUpdate)
      );
    }
  };

  const clearCart = () => {
    setCartItemList([]);
  };

  const contextValue: CartContextProps = {
    cartItemList,
    setCartItemList,
    cartIsOpen,
    setCartIsOpen,
    addCartItem,
    deleteCartItem,
    updateCartItemQunatity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
