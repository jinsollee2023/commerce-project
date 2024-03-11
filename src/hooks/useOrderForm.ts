import { orderFormSchema } from "@/shared/form/formValidation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestPayParams, RequestPayResponse } from "portone";
import useProductMutations from "./queries/product/useProductMutations";
import { ICartItem } from "@/types/types";
import useOrderMutations from "./queries/order/useOrderMutations";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/store/CartContext";
import { useModal } from "@/store/ModalContext";

const useOrderForm = () => {
  const cartItemOfLocalstorage = localStorage.getItem("cartItemList");
  const orderitemList: ICartItem[] = JSON.parse(
    cartItemOfLocalstorage as string
  );

  const orderForm = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
  });

  const onCompletePostCode = (address: string, zonecode: string) => {
    orderForm.setValue("zipCode", zonecode);
    orderForm.setValue("address", address);
  };

  let totalAmount = 0;
  const { updateProductQunatityMutation } = useProductMutations({
    sellerId: undefined,
  });
  const onSubmitOrder = async (values: z.infer<typeof orderFormSchema>) => {
    const updateQunatityPromises = orderitemList.map((item: ICartItem) => {
      totalAmount += item.product.productPrice * item.qunatity;
      return updateProductQunatityMutation.mutate({
        orderItem: item,
        type: "decrease",
      });
    });
    await Promise.all(updateQunatityPromises);
    handlePayment(values);
  };

  const handlePayment = (values: z.infer<typeof orderFormSchema>) => {
    if (!window.IMP) return;
    const { IMP } = window;
    IMP.init("imp56123014");

    const { name, contact, email, zipCode, address, additionalAddress } =
      values;
    const data: RequestPayParams = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      amount: totalAmount,
      name: "아임포트 결제 데이터 분석",
      buyer_name: name,
      buyer_tel: contact,
      buyer_email: email,
      buyer_addr: `${address}${additionalAddress}`,
      buyer_postcode: zipCode,
    };
    IMP.request_pay(data, paymentCallback);
  };

  const { addOrderMutation } = useOrderMutations();
  const { clearCart } = useCart();
  const { onClose } = useModal();
  const navigate = useNavigate();
  const paymentCallback = async (response: RequestPayResponse) => {
    const { success, error_msg } = response;
    if (success) {
      const addOrderPromises = orderitemList.map((item: ICartItem) =>
        addOrderMutation.mutate(item)
      );
      await Promise.all(addOrderPromises);
      onClose();
      clearCart();
      navigate("/mypage");
    } else {
      alert(`결제 실패: ${error_msg}`);
      onClose();
      const updateQunatityPromises = orderitemList.map((item: ICartItem) =>
        updateProductQunatityMutation.mutate({
          orderItem: item,
          type: "increase",
        })
      );
      await Promise.all(updateQunatityPromises);
    }
  };

  return { orderitemList, orderForm, onSubmitOrder, onCompletePostCode };
};

export default useOrderForm;
