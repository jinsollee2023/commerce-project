import ProductNumberWrapper from "@/components/ui/ProductNumberWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/CartContext";
import { ICartItem } from "@/types/types";
import { useState } from "react";

interface CartItemProps {
  item: ICartItem;
  type?: "orderForm" | undefined;
}

const CartItem = ({ item, type }: CartItemProps) => {
  const { productName, productPrice, id, productQunatity, productImage } =
    item.product;
  const { updateCartItemQunatity, deleteCartItem } = useCart();
  const [qunatityValue, setQunatityValue] = useState(item.qunatity);
  const { toast } = useToast();

  const itemsPrice = productPrice * item.qunatity;

  const updateButtonHandler = () => {
    if (qunatityValue === 0) {
      deleteButtonHandler();
    } else if (qunatityValue === item.qunatity) {
      toast({
        variant: "destructive",
        title: "변경 사항이 없습니다.",
        duration: 1000,
      });
    } else if (qunatityValue < productQunatity + 1) {
      updateCartItemQunatity(id, qunatityValue);
      toast({
        variant: "green",
        title: "상품 갯수가 변경되었습니다.",
        duration: 1000,
      });
    } else {
      toast({
        variant: "destructive",
        title: "구매 가능한 상품 갯수를 초과하였습니다.",
        duration: 1000,
      });
      setQunatityValue(item.qunatity);
    }
  };

  const deleteButtonHandler = () => {
    deleteCartItem(id);
    toast({
      variant: "green",
      title: "상품이 삭제되었습니다.",
      duration: 1000,
    });
  };

  return (
    <div
      className="w-full p-4 space-y-2 border bg-slate-100 rounded-sm"
      data-cy="cart-item-card"
    >
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <img
            src={productImage[0] as string}
            className="w-20 h-20 rounded-sm"
          />
          <div>
            <p>{productName}</p>
            <div className="flex space-x-1">
              <ProductNumberWrapper
                type="price"
                productPrice={productPrice}
                className="flex justify-end"
                textClassName="text-sm"
              />
              <span>*</span>
              <ProductNumberWrapper
                type="qunatity"
                productQunatity={item.qunatity}
                className="flex justify-end"
                textClassName="text-sm"
              />
            </div>
            <ProductNumberWrapper
              type="price"
              productPrice={itemsPrice}
              textClassName="font-semibold"
            />
          </div>
        </div>

        <div className={type === "orderForm" ? "hidden" : ""}>
          <div>
            <input
              type="number"
              defaultValue={item.qunatity}
              value={qunatityValue}
              onChange={(event) => setQunatityValue(Number(event.target.value))}
              className="w-14 px-2 py-1 border-t border-b border-l text-sm"
              data-cy="cart-qunatity-input"
            />
            <button
              className="px-2 py-1 border text-sm bg-white"
              onClick={updateButtonHandler}
              data-cy="cart-qunatity-update-button"
            >
              수정
            </button>
          </div>
          <button
            className="px-9 py-1 border text-sm bg-white"
            onClick={deleteButtonHandler}
            data-cy="cart-delete-button"
          >
            삭제
          </button>
        </div>
      </div>
      {/* <span className="py-2 w-full border-b block"></span> */}
    </div>
  );
};

export default CartItem;
