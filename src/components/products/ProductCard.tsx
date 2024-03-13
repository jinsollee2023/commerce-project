import useProductMutations from "@/hooks/queries/product/useProductMutations";
import { useUser } from "@/store/UserContext";
import { IProduct } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiPencilFill, RiDeleteBin2Line } from "react-icons/ri";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryTitle } from "@/shared/common";
import { useState } from "react";
import ProductNumberWrapper from "../ui/ProductNumberWrapper";
import useSingleProductQueries from "@/hooks/queries/product/useSingleProductQueries";
import { useToast } from "../ui/use-toast";

interface ProductCardProps {
  product: IProduct;
  viewType?: string;
}

const ProductCard = ({ product, viewType }: ProductCardProps) => {
  const { user } = useUser();
  const userId = user ? user.id : localStorage.getItem("userId");
  const navigate = useNavigate();
  const { toast } = useToast();

  const path = location.pathname;
  const managementMode = path === "/mypage";

  const { deleteProductMutation } = useProductMutations({
    sellerId: userId as string,
  });

  const productDeleteButtonHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (userId === product.sellerId) {
      deleteProductMutation.mutate({
        productId: product.id,
        sellerId: userId!,
      });
    } else {
      toast({
        variant: "destructive",
        title: "삭제 권한이 없습니다.",
        duration: 1000,
      });
    }
  };

  const goToProductUpdate = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (userId === product.sellerId) {
      prefetchProductData(product.id);
      navigate(`/product-registration?productId=${product.id}`);
    } else {
      toast({
        variant: "destructive",
        title: "수정 권한이 없습니다.",
        duration: 1000,
      });
    }
  };

  const [imageIsLoading, setImageIsLoading] = useState(true);
  const {
    id: productId,
    productName,
    productPrice,
    productImage,
    productCategory,
    productDescription,
  } = product;

  const { prefetchProductData } = useSingleProductQueries({
    productId: product.id,
  });

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    prefetchProductData(product.id);
    navigate(`/${productCategory}/${productId}`);
  };

  const view = viewType ? viewType : "grid";

  return (
    <div data-cy="product-card">
      {view === "grid" && (
        <Card
          key={productId}
          onClick={handleCardClick}
          className={`w-full h-[360px] ${
            !managementMode && "group"
          } cursor-pointer relative flex flex-col`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:block hidden"
            style={{
              backgroundImage: `url(${productImage[0]})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-75"></div>
          <div className="absolute inset-0 p-8 text-white group-hover:block hidden">
            <p className="text-lg font-semibold">{productName}</p>
            <p>{productDescription}</p>
          </div>

          <CardHeader className="group-hover:hidden">
            <div className="flex flex-row justify-between items-center">
              <Badge>{categoryTitle(productCategory)}</Badge>
              <div
                className={`${
                  managementMode ? "" : "hidden"
                } flex space-x-1 z-20`}
              >
                <button
                  onClick={(event) => goToProductUpdate(event)}
                  data-cy="product-update-button"
                >
                  <RiPencilFill className="cursor-pointer" />
                </button>
                <button
                  onClick={(event) => productDeleteButtonHandler(event)}
                  data-cy="product-delete-button"
                >
                  <RiDeleteBin2Line className="cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <div className="w-48 h-48 flex justify-center items-center">
                {imageIsLoading && (
                  <Skeleton className="rounded-sm object-cover" />
                )}
                <img
                  src={productImage[0] as string}
                  alt={productName}
                  onLoad={() => setImageIsLoading(false)}
                  className={`${
                    imageIsLoading ? "hidden" : "none"
                  } w-48 h-48 mb-2 object-cover`}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="group-hover:hidden">
            <p className="text-xl font-semibold">{productName}</p>
            <ProductNumberWrapper type="price" productPrice={productPrice} />
          </CardContent>
        </Card>
      )}

      {view === "list" && (
        <Card
          key={productId}
          onClick={handleCardClick}
          className="cursor-pointer px-2 py-2 mx-auto sm:px-8 lg:px-20"
        >
          <div className="w-full flex flex-row items-center justify-between space-x-4">
            <div className="w-28 h-28 items-center hidden sm:flex ">
              {imageIsLoading && (
                <Skeleton className="object-cover rounded-sm" />
              )}
              <img
                src={productImage[0] as string}
                alt={productName}
                onLoad={() => setImageIsLoading(false)}
                className={`${imageIsLoading ? "hidden" : "none"} object-cover`}
              />
            </div>

            <div className="sm:w-1/3 flex flex-col space-y-1 ">
              <div>
                <Badge>{categoryTitle(productCategory)}</Badge>
              </div>
              <p className="text-xl">{productName}</p>
            </div>

            <div className="w-1/3 flex space-x-2 justify-end items-center">
              <div className="w-full flex items-center flex-col xl:flex-row sm:space-x-2">
                <p className="font-semibold">판매가</p>
                <ProductNumberWrapper
                  type="price"
                  productPrice={productPrice}
                />
              </div>
              <div
                className={`${
                  managementMode ? "" : "hidden"
                } flex space-x-0 justify-end flex-col lg:flex-row lg:space-x-1`}
              >
                <button
                  className="w-16 border px-3"
                  onClick={(event) => goToProductUpdate(event)}
                  data-cy="product-update-button"
                >
                  수정
                </button>
                <button
                  className="w-16 border px-3"
                  onClick={(event) => productDeleteButtonHandler(event)}
                  data-cy="product-delete-button"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductCard;
