import { useCart } from "@/store/CartContext";
import Modal from "../ui/Modal";
import OrderForm from "./OrderForm";
import { HiOutlineXMark } from "react-icons/hi2";
import CartItem from "../products/cart/CartItem";
import { useModal } from "@/store/ModalContext";
import ProductNumberWrapper from "../ui/ProductNumberWrapper";

const OrderFormModal = () => {
  const { cartItemList } = useCart();
  const { isOpen, onClose } = useModal();
  let totalAmount = 0;
  return (
    <Modal isOpen={isOpen}>
      <Modal.Header>
        <Modal.Close>
          <div className="flex justify-end">
            <button onClick={onClose}>
              <HiOutlineXMark size={20} />
            </button>
          </div>
        </Modal.Close>
      </Modal.Header>
      <Modal.Body>
        <p className="pb-4 text-xl font-bold">주문 정보</p>
        {cartItemList?.map((item, idx) => {
          totalAmount += item.product.productPrice * item.qunatity;
          return <CartItem key={idx} item={item} type="orderForm" />;
        })}
        <div className="pt-4 flex justify-end space-x-2">
          <span className="font-semibold">총 결제 금액:</span>
          <ProductNumberWrapper
            type="price"
            productPrice={totalAmount}
            textClassName="font-semibold"
          />
        </div>

        <OrderForm />
      </Modal.Body>
    </Modal>
  );
};

export default OrderFormModal;
