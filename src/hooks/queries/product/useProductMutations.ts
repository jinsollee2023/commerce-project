import { queryClient } from "@/App";
import { productAPI } from "@/lib/api/productAPI";
import { storageAPI } from "@/lib/api/storageAPI";
import { ICartItem, IProduct } from "@/types/types";
import { InfiniteData, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface useProductMutationsProps {
  sellerId: string | undefined;
  productId?: string;
  setIsLoading?: (isLoading: boolean) => void;
}

const useProductMutations = ({
  sellerId,
  productId,
  setIsLoading,
}: useProductMutationsProps) => {
  const navigate = useNavigate();

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: IProduct) => {
      const imageDownloadURLs = await storageAPI.uploadProductImages(
        newProduct
      );
      return await productAPI.addProduct(newProduct, imageDownloadURLs);
    },
    onMutate: async (newProduct) => {
      const previousProducts: InfiniteData<IProduct[]> | undefined =
        queryClient.getQueryData(["productsBySellerId", newProduct.sellerId]);

      if (previousProducts) {
        await queryClient.cancelQueries({
          queryKey: ["productsBySellerId", newProduct.sellerId],
        });

        queryClient.setQueryData(
          ["productsBySellerId", newProduct.sellerId],
          (old: InfiniteData<IProduct[]>) => {
            return {
              ...old,
              pages: [...old.pages, newProduct],
            };
          }
        );
      }
      return { previousProducts };
    },
    onSuccess: () => {
      navigate("/mypage");
      setIsLoading && setIsLoading(false);
    },
    onError: (err, value, context) => {
      queryClient.setQueryData(
        ["productsBySellerId", value.sellerId],
        context?.previousProducts
      );
      console.log(err);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["productsBySellerId", value?.sellerId],
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (updateProductData: IProduct) => {
      await storageAPI.deleteProductImages(updateProductData.id);
      const imageDownloadURLs = await storageAPI.uploadProductImages(
        updateProductData
      );
      await productAPI.updateProduct(updateProductData, imageDownloadURLs);
    },
    onMutate: async (updateProductData) => {
      await queryClient.cancelQueries({
        queryKey: ["singleProduct", productId],
      });
      const previousProduct: InfiniteData<IProduct[]> | undefined =
        queryClient.getQueryData(["singleProduct", productId]);
      queryClient.setQueryData(["singleProduct", productId], updateProductData);
      return { previousProduct, updateProductData };
    },
    onSuccess: () => {
      setIsLoading && setIsLoading(false);
      navigate("/mypage");
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ["singleProduct", productId],
        context?.previousProduct
      );
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["productsBySellerId", sellerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["singleProduct", productId],
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async ({
      productId,
    }: {
      productId: string;
      sellerId: string;
    }) => {
      await storageAPI.deleteProductImages(productId);
      await productAPI.deleteProduct(productId);
    },
    onMutate: async () => {
      const previousProduct: InfiniteData<IProduct[]> | undefined =
        queryClient.getQueryData(["singleProduct", productId]);
      if (previousProduct) {
        await queryClient.cancelQueries({
          queryKey: ["singleProduct", productId],
        });
        queryClient.setQueryData(["singleProduct", productId], undefined);
      }

      return { previousProduct };
    },
    onSuccess: () => {
      setIsLoading && setIsLoading(false);
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ["singleProduct", productId],
        context?.previousProduct
      );
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["productsBySellerId", sellerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["singleProduct", productId],
      });
    },
  });

  const updateProductQunatityMutation = useMutation({
    mutationFn: async ({
      orderItem,
      type,
    }: {
      orderItem: ICartItem;
      type: "increase" | "decrease";
    }) => {
      if (type === "increase") {
        productAPI.updateProductQunatity(
          orderItem.product.id,
          orderItem.qunatity
        );
      } else if (type === "decrease") {
        productAPI.updateProductQunatity(
          orderItem.product.id,
          -orderItem.qunatity
        );
      }
      return orderItem;
    },
    onMutate: async (value) => {
      const previousProducts: IProduct[] | undefined = queryClient.getQueryData(
        ["productsBySellerId", value.orderItem.product.sellerId]
      );
      if (previousProducts) {
        await queryClient.cancelQueries({
          queryKey: ["productsBySellerId", value.orderItem.product.sellerId],
        });
        if (value.type === "decrease") {
          queryClient.setQueryData(
            ["productsBySellerId", value.orderItem.product.sellerId],
            previousProducts.map((item) => {
              if (item.sellerId === value.orderItem.product.sellerId) {
                return {
                  ...previousProducts,
                  productQunatity: -value.orderItem.qunatity,
                };
              } else return;
            })
          );
        } else {
          queryClient.setQueryData(
            ["productsBySellerId", value.orderItem.product.sellerId],
            previousProducts.map((item) => {
              if (item.sellerId === value.orderItem.product.sellerId) {
                return {
                  ...previousProducts,
                  productQunatity: +value.orderItem.qunatity,
                };
              } else return;
            })
          );
        }
      }

      return { previousProducts };
    },

    onError: (error, value, context) => {
      queryClient.setQueryData(
        ["productsBySellerId", value.orderItem.product.sellerId],
        context?.previousProducts
      );
      console.log(error);
    },
    onSettled: (value) => {
      queryClient.invalidateQueries({
        queryKey: ["productsBySellerId", value?.product.sellerId],
      });
    },
  });

  return {
    addProductMutation,
    updateProductMutation,
    deleteProductMutation,
    updateProductQunatityMutation,
  };
};

export default useProductMutations;
