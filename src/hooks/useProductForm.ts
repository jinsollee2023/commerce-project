import { productFormSchema } from "@/shared/form/formValidation";
import { IProduct } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import useProductMutations from "./queries/product/useProductMutations";
import { getKoreaTimeDate } from "@/shared/common";
import imageCompression from "browser-image-compression";
import { storageAPI } from "@/lib/api/storageAPI";

interface useProductFormProps {
  userId: string;
  updateProduct?: IProduct;
}

const useProductForm = ({ userId, updateProduct }: useProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDataSet, setIsLoadingDataSet] = useState(false);
  const [isResizingImage, setIsResizingImage] = useState(false);
  const dataTransfer = new DataTransfer();
  const [allImage, setAllImage] = useState({});
  const [showImages, setShowImages] = useState<string[]>([]);

  const { addProductMutation, updateProductMutation } = useProductMutations({
    sellerId: userId as string,
    productId: updateProduct?.id as string,
    setIsLoading,
  });

  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
  });

  useEffect(() => {
    const setFormValues = async () => {
      setIsLoadingDataSet(true);
      if (updateProduct && Array.isArray(updateProduct.productImage)) {
        const imageURLs = updateProduct.productImage;
        setShowImages(imageURLs as string[]);
        const {
          productName,
          productCategory,
          productPrice,
          productQunatity,
          productDescription,
        } = updateProduct;
        try {
          const downloadedImages = await storageAPI.downloadProductImages(
            imageURLs as string[]
          );
          downloadedImages.forEach((image) => dataTransfer.items.add(image));
          setAllImage(dataTransfer.files);

          productForm.setValue("images", dataTransfer.files);
          productForm.setValue("title", productName);
          productForm.setValue("description", productDescription);
          productForm.setValue("category", productCategory);
          productForm.setValue(
            "price",
            String(productPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          productForm.setValue(
            "qunatity",
            String(productQunatity).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        } catch (error) {
          console.error("Error downloading images:", error);
        } finally {
          setIsLoadingDataSet(false);
        }
      }
    };
    updateProduct && setFormValues();
  }, []);

  const onSubmitAddProduct = async (
    values: z.infer<typeof productFormSchema>
  ) => {
    setIsLoading(true);
    const { title, description, price, category, qunatity, images } = values;
    const newProduct: IProduct = {
      id: uuidv4(),
      sellerId: userId as string,
      productName: title,
      productPrice: Number(price.replace(/,/g, "")),
      productQunatity: Number(qunatity.replace(/,/g, "")),
      productCategory: category,
      productDescription: description,
      productImage: images,
      createdAt: getKoreaTimeDate(),
      updatedAt: getKoreaTimeDate(),
    };
    addProductMutation.mutate(newProduct);
  };

  const onSubmitUpdateProduct = async (
    values: z.infer<typeof productFormSchema>
  ) => {
    setIsLoading(true);
    const { title, description, price, category, qunatity, images } = values;
    const updateProductData: IProduct = {
      id: updateProduct!.id,
      sellerId: updateProduct!.sellerId,
      productName: title,
      productPrice: Number(price.replace(/,/g, "")),
      productQunatity: Number(qunatity.replace(/,/g, "")),
      productCategory: category,
      productDescription: description,
      productImage: images,
      createdAt: updateProduct!.createdAt,
      updatedAt: getKoreaTimeDate(),
    };
    updateProductMutation.mutate(updateProductData);
  };

  const formatNumberOnChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const inputValue = event.target.value;
    const exceptString = inputValue.replace(/[^\d,]/g, "");
    const formattedValue = exceptString
      .replace(/,/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    onChange(formattedValue);
  };

  const handleImageCompress = async (image: File) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
    };
    try {
      const compressedFile = await imageCompression(image, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  };

  const addImageOnChangeHandler = async (
    images: FileList,
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList) => void
  ) => {
    setIsResizingImage(true);
    try {
      if (images) {
        await Promise.all(
          Array.from(images).map(async (image) => {
            const resizingBlob = await handleImageCompress(image);
            const resizingFile = new File([resizingBlob!], image.name, {
              type: image.type,
            });
            dataTransfer.items.add(resizingFile);
          })
        );
      }

      await Promise.all(
        Array.from(event.target.files!).map(async (image) => {
          const resizingBlob = await handleImageCompress(image);
          const resizingFile = new File([resizingBlob!], image.name, {
            type: image.type,
          });
          dataTransfer.items.add(resizingFile);
        })
      );
      const newFiles = dataTransfer.files;
      const newFilesURL = Array.from(newFiles).map((file) =>
        URL.createObjectURL(file)
      );
      setShowImages(newFilesURL);
      setAllImage(newFiles);
      onChange(newFiles);
      setIsResizingImage(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteImage = (id: number) => {
    setShowImages(showImages.filter((_, index) => index !== id));

    const newFiles = Object.values(allImage).filter((_, index) => index !== id);
    newFiles.forEach((file) => {
      dataTransfer.items.add(file as File);
    });
    productForm.setValue("images", dataTransfer.files);
    setAllImage(dataTransfer.files);
  };

  return {
    productForm,
    onSubmitAddProduct,
    onSubmitUpdateProduct,
    isLoading,
    isLoadingDataSet,
    formatNumberOnChangeHandler,
    allImage,
    showImages,
    addImageOnChangeHandler,
    handleDeleteImage,
    isResizingImage,
  };
};

export default useProductForm;
