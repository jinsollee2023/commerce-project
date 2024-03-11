import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { IProduct } from "@/types/types";

export const storageAPI = {
  downloadProductImages: async (imageURLs: string[]): Promise<File[]> => {
    const storage = getStorage();
    const downloadPromises: Promise<File | undefined>[] = imageURLs.map(
      async (url) => {
        const httpsReference = storageRef(storage, url);
        try {
          const downloadURL = await getDownloadURL(httpsReference);
          const response = await fetch(downloadURL);
          const blob = await response.blob();
          const file = new File([blob], "image", {
            type: response.headers.get("content-type") || "image/jpeg",
          });
          return file;
        } catch (error) {
          console.error("Error downloading image:", error);
        }
      }
    );
    try {
      const downloadedImages = await Promise.all(downloadPromises);
      return downloadedImages as File[];
    } catch (error) {
      console.error("Error downloading images:", error);
      throw error;
    }
  },

  uploadProductImages: async (newProduct: IProduct) => {
    const { productImage, id, productName } = newProduct;
    const storage = getStorage();
    const childStorageRef = storageRef(storage, "product-images");
    const uploadImagePromises: Promise<string>[] = [];

    for (let i = 0; i < productImage.length; i++) {
      const image = productImage[i];
      if (image instanceof File) {
        const fileName = `${productName}-${i}`;
        const imageRef = storageRef(childStorageRef, `${id}/${fileName}`);
        const snapshot = await uploadBytes(imageRef, image);
        const imageDownloadURLPromise = getDownloadURL(snapshot.ref);
        uploadImagePromises.push(imageDownloadURLPromise);
      }
    }

    const imageDownloadURLs = await Promise.all(uploadImagePromises);
    return imageDownloadURLs;
  },

  deleteProductImages: async (productId: string) => {
    const storage = getStorage();
    const productImagesRef = storageRef(storage, `product-images/${productId}`);
    try {
      const result = await listAll(productImagesRef);
      await Promise.all(result.items.map((item) => deleteObject(item)));
    } catch (error) {
      console.error("An error occurred while deleting the file:", error);
    }
  },
};
