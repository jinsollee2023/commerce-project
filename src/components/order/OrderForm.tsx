import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useOrderForm from "@/hooks/useOrderForm";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import PostCodeDialog from "./PostCodeDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useModal } from "@/store/ModalContext";

const OrderForm = () => {
  const { orderForm, onSubmitOrder, onCompletePostCode } = useOrderForm();
  const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);
  const { onClose } = useModal();

  console.log(orderForm.getValues("checkOrder"));
  return (
    <div className="pt-6">
      <p className="pb-4 text-xl font-bold">배송 정보</p>
      <Form {...orderForm}>
        <form
          onSubmit={orderForm.handleSubmit(onSubmitOrder)}
          className="space-y-3"
        >
          <FormField
            control={orderForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="홍길동"
                    data-cy="order-name-input"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between space-x-2">
            <FormField
              control={orderForm.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>연락처</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="010-0000-0000"
                      data-cy="order-contact-input"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={orderForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="sparta@sparta.com"
                      data-cy="order-email-input"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={orderForm.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주소</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl className="w-1/3">
                      <Input
                        {...field}
                        placeholder="00000"
                        data-cy="order-zipcode-input"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => setIsOpenPostDialog(true)}
                    >
                      우편번호
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              <FormField
                control={orderForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="기본 주소"
                        data-cy="order-address-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={orderForm.control}
                name="additionalAddress"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="상세 주소"
                        data-cy="order-additional-address-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={orderForm.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>배송메세지</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={orderForm.control}
            name="checkOrder"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-cy="order-check-box"
                    />
                  </FormControl>
                  <FormLabel>
                    주문 정보 확인하였으며, 결제 진행을 동의합니다.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6 flex space-x-1">
            <Button type="submit" className="w-2/3" data-cy="order-button">
              결제하기
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-1/3"
              onClick={onClose}
            >
              취소
            </Button>
          </div>
        </form>
      </Form>
      <PostCodeDialog
        isOpen={isOpenPostDialog}
        setIsOpen={setIsOpenPostDialog}
        onCompletePostCode={onCompletePostCode}
      />
    </div>
  );
};

export default OrderForm;
