import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../../ui/button";
import { useCart } from "@/store/CartContext";
import CartItem from "./CartItem";
import ProductNumberWrapper from "@/components/ui/ProductNumberWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/store/ModalContext";

const CartDrawer = () => {
  const { cartIsOpen, setCartIsOpen, cartItemList } = useCart();
  const isSeller = localStorage.getItem("isSeller") === "true" ? true : false;
  const { onOpen } = useModal();
  const { toast } = useToast();

  let totalPrice = 0;
  cartItemList?.forEach((item) => {
    totalPrice += item.product.productPrice * item.qunatity;
  });

  const orderButtonHandler = () => {
    if (isSeller) {
      toast({
        variant: "destructive",
        title: "구매자만 구매가 가능합니다.",
        duration: 1000,
      });
    } else {
      setCartIsOpen(false);
      onOpen();
    }
  };

  return (
    <Drawer open={cartIsOpen!}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>장바구니</DrawerTitle>
          <div className="h-[70vh] overflow-auto">
            {cartItemList ? (
              cartItemList.map((item, idx) => {
                return <CartItem key={idx} item={item} />;
              })
            ) : (
              <p>장바구니에 상품이 없습니다.</p>
            )}
          </div>
        </DrawerHeader>

        <DrawerFooter>
          <div className="flex justify-between p-2">
            <span className="font-semibold">총 상품금액</span>
            <ProductNumberWrapper type="price" productPrice={totalPrice} />
          </div>
          <div className="space-x-1">
            <Button
              className="w-[74%]"
              onClick={orderButtonHandler}
              data-cy="open-order-button"
            >
              주문하기
            </Button>
            <Button
              className="w-[24%]"
              variant="secondary"
              onClick={() => setCartIsOpen(false)}
              data-cy="close-cart-button"
            >
              닫기
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
