import useSingleProductQueries from "@/hooks/queries/product/useSingleProductQueries";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { categoryTitle } from "@/shared/common";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";
import useProductsOfCategoryQueries from "@/hooks/queries/product/useProductsOfCategoryQueries";
import { useCart } from "@/store/CartContext";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import ProductNumberWrapper from "../ui/ProductNumberWrapper";

const ProductDetailInfo = () => {
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const location = useLocation();
  const path = location.pathname;
  const productId = path.slice(-36);
  const { toast } = useToast();

  const {
    singleProductData,
    isErrorSingleProductData,
    isLoadingSingleProductData,
  } = useSingleProductQueries({ productId });

  const {
    productCategory,
    productName,
    productPrice,
    productQunatity,
    productImage,
    productDescription,
  } = singleProductData || {};

  const {
    productsOfCategory,
    isErrorProductsOfCategory,
    isLoadingProductsOfCategory,
  } = useProductsOfCategoryQueries(productCategory);

  const { cartItemList, setCartIsOpen, addCartItem } = useCart();
  const productInCart = cartItemList?.find(
    (item) => item.product.id === productId
  );
  const user = localStorage.getItem("userId");
  const isSeller = localStorage.getItem("isSeller") === "true" ? true : false;
  const navigate = useNavigate();
  const cartButtonClickHandler = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "로그인 후 이용 가능합니다.",
        duration: 1000,
      });
      navigate(`/login?next=${path}`);
    } else if (isSeller) {
      toast({
        variant: "destructive",
        title: "구매자만 이용 가능합니다.",
        duration: 1000,
      });
    } else if (user && !isSeller && !productInCart) {
      setCartIsOpen(true);
      addCartItem({ product: singleProductData, qunatity: 1 });
      toast({
        variant: "green",
        title: "상품이 장바구니에 추가되었습니다.",
        duration: 1000,
      });
    }
  };

  if (isLoadingSingleProductData || isLoadingProductsOfCategory) {
    return <p>Loading...</p>;
  }

  if (isErrorSingleProductData || isErrorProductsOfCategory) {
    return <p>Error...</p>;
  }

  return (
    <>
      <div className="py-20 md:flex md:space-x-10">
        <div className="md:w-1/2">
          {imageIsLoading && <Skeleton className="rounded-sm" />}
          <Carousel className="flex justify-center items-center">
            <CarouselContent>
              {(productImage as string[]).map((img, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  <img
                    src={img}
                    alt={productName}
                    onLoad={() => setImageIsLoading(false)}
                    className={`h-[400px] object-cover ${
                      imageIsLoading ? "hidden" : "none"
                    }`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex flex-col md:w-1/2">
          <div className="flex items-center space-x-3 pt-4 md:pt-2">
            <Badge>{categoryTitle(productCategory)}</Badge>
            <p className="text-2xl font-semibold">{productName}</p>
          </div>
          <span className="w-full border-b my-4"></span>
          <p className="">{productDescription}</p>
          <div className="mt-auto space-y-2 pt-4">
            <div className="flex">
              <p className="w-20 font-semibold">판매가</p>
              <ProductNumberWrapper type="price" productPrice={productPrice} />
            </div>
            <div className="flex">
              <p className="w-20 font-semibold">남은 수량</p>
              <ProductNumberWrapper
                type="qunatity"
                productQunatity={productQunatity}
              />
            </div>
            {!isSeller && (
              <div className="pt-4 space-x-2 mx-auto">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={cartButtonClickHandler}
                  data-cy="add-cart-button"
                >
                  {productInCart ? "장바구니 보기" : "장바구니 추가"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isErrorProductsOfCategory && !isLoadingProductsOfCategory && (
        <div className="w-full pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
          {productsOfCategory?.pages.map((group, idx) => {
            const recomemendProduct = group.sortedProductsArray
              .filter((product) => product.id !== productId)
              .slice(0, 4);
            return (
              idx === 0 && (
                <React.Fragment key={idx}>
                  {recomemendProduct.length > 0 &&
                    recomemendProduct.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </React.Fragment>
              )
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProductDetailInfo;
