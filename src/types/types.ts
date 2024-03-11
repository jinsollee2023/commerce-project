export interface IUser {
  id: string;
  email: string;
  isSeller: boolean;
  nickname: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  sellerId: string;
  productName: string;
  productPrice: number;
  productQunatity: number;
  productDescription: string;
  productCategory: string;
  productImage: string[] | FileList;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: IProduct;
  qunatity: number;
}

export interface IInpiniteProductPages {
  sortedProductsArray: IProduct[];
  nextPageParam: number | null;
}

export interface IInpiniteProduct {
  pageParams: number[];
  pages: IInpiniteProductPages[];
}

export type objectType = {
  [key: string]: any;
};

export type IResolveParams = {
  provider: string;
  data?: objectType;
};

export interface IGoogleUser {
  email: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface IOrder {
  id: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  productQunatity: number;
  status: "주문 완료" | "발송 대기" | "발송 시작" | "주문 취소";
  createdAt: Date;
  updatedAt: Date;
}
