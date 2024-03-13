import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useProductForm from "@/hooks/useProductForm";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { IoAddOutline } from "react-icons/io5";
import { HiOutlineXMark } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import useSingleProductQueries from "@/hooks/queries/product/useSingleProductQueries";
import { useUser } from "@/store/UserContext";

import LoadingSpinner from "@/components/layout/LoadingSpinner";

const ProductForm = () => {
  const { user } = useUser();
  const userId = user ? user.id : localStorage.getItem("userId");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const updateProductId = searchParams.get("productId");

  const {
    singleProductData,
    isErrorSingleProductData,
    isLoadingSingleProductData,
  } = useSingleProductQueries({
    productId: updateProductId as string,
  });

  const {
    productForm,
    onSubmitAddProduct,
    onSubmitUpdateProduct,
    isLoading,
    isLoadingDataSet,
    formatNumberOnChangeHandler,
    showImages,
    addImageOnChangeHandler,
    handleDeleteImage,
    isResizingImage,
  } = useProductForm({
    userId: userId as string,
    updateProduct: singleProductData,
  });

  console.log(isLoadingDataSet);

  const spinners = [
    {
      text: singleProductData ? "포스트 수정 중.." : "포스트 등록 중..",
      isLoading: isLoading,
    },
    { text: "포스트 불러오는 중", isLoading: isLoadingDataSet },
    { text: "이미지 변환 중..", isLoading: isResizingImage },
  ];

  if (isLoadingSingleProductData) {
    return <p>Loading...</p>;
  }

  if (isErrorSingleProductData) {
    return <p>Error...</p>;
  }

  return (
    <div className="p-10 ">
      <Form {...productForm}>
        <form
          onSubmit={productForm.handleSubmit(async (values) => {
            singleProductData
              ? onSubmitUpdateProduct(values)
              : await onSubmitAddProduct(values);
          })}
          className="space-y-2 w-full"
        >
          <FormField
            control={productForm.control}
            name="title"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>상품명</FormLabel>
                  <FormControl>
                    <Input data-cy="product-name-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="md:flex md:justify-between">
            <FormField
              control={productForm.control}
              name="category"
              render={({ field }) => (
                <>
                  <FormItem className="md:w-[30%]">
                    <FormLabel>카테고리</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            name="category"
                            data-cy="product-category-select"
                          >
                            <SelectValue placeholder="선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="earring" data-cy="earring-option">
                            귀걸이
                          </SelectItem>
                          <SelectItem
                            value="necklace"
                            data-cy="necklace-option"
                          >
                            목걸이
                          </SelectItem>
                          <SelectItem value="ring" data-cy="ring-option">
                            반지
                          </SelectItem>
                          <SelectItem
                            value="bracelet"
                            data-cy="bracelet-option"
                          >
                            팔찌
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={productForm.control}
              name="price"
              render={({ field: { value, onChange }, ...field }) => {
                return (
                  <>
                    <FormItem className="md:w-[33%]">
                      <FormLabel>가격</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-1">
                          <Input
                            {...field}
                            value={value}
                            onChange={(event) => {
                              formatNumberOnChangeHandler(event, onChange);
                            }}
                            data-cy="product-price-input"
                          />
                          <p>원</p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                );
              }}
            />
            <FormField
              control={productForm.control}
              name="qunatity"
              render={({ field: { value, onChange }, ...field }) => {
                return (
                  <>
                    <FormItem className="md:w-[33%]">
                      <FormLabel>상품 수량</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-1">
                          <Input
                            {...field}
                            value={value}
                            onChange={(event) => {
                              formatNumberOnChangeHandler(event, onChange);
                            }}
                            data-cy="product-qunatity-input"
                          />
                          <p>개</p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                );
              }}
            />
          </div>
          <FormField
            control={productForm.control}
            name="description"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>상품 설명</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-32 resize-none"
                      data-cy="product-description-textarea"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={productForm.control}
            name="images"
            render={({ field: { onChange }, ...field }) => {
              const images = productForm.watch("images");

              return (
                <FormItem>
                  <FormLabel>상품 이미지</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      multiple={true}
                      disabled={productForm.formState.isSubmitting}
                      className="hidden"
                      {...field}
                      onChange={(event) => {
                        addImageOnChangeHandler(images, event, onChange);
                      }}
                      data-cy="product-images-input"
                    />
                  </FormControl>

                  <div className="p-4 mt-2 border rounded-md space-y-2 sm:flex sm:items-center sm:space-y-0">
                    <div className="w-full mt-2 flex justify-center sm:w-10 sm:mr-4 sm:mt-0 sm:justify-start">
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="rounded-3xl"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <IoAddOutline size={20} />
                      </Button>
                    </div>

                    <div className="flex flex-col space-y-2 sm:flex-row sm:overflow-auto sm:space-x-4 sm:space-y-0">
                      {showImages &&
                        showImages.map((image, id) => {
                          return (
                            <div
                              className="relative flex flex-shrink-0 justify-center sm:justify-start"
                              key={id}
                            >
                              <img
                                src={image}
                                alt={`${image}-${id}`}
                                className="h-40"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(id)}
                                className="p-[2px] absolute top-1 right-1 z-10 bg-gray-200 rounded-full"
                              >
                                <HiOutlineXMark size={15} />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="pt-6 flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || isResizingImage}
              data-cy="product-register-button"
            >
              {singleProductData ? "상품 수정하기" : "상품 등록하기"}
            </Button>
          </div>
        </form>
      </Form>
      {spinners.map((spinner, index) => (
        <LoadingSpinner
          key={index}
          text={spinner.text}
          isLoading={spinner.isLoading}
        />
      ))}
    </div>
  );
};

export default ProductForm;
