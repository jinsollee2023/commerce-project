import { IInpiniteProduct } from "@/types/types";
import React from "react";
import { useNavigate } from "react-router-dom";
import { categoryTitle } from "@/shared/common";
import { Button } from "../ui/button";
import ProductCard from "./ProductCard";

interface MainCategorySectionProps {
  category: string;
  products: IInpiniteProduct;
}

const MainCategorySection = ({
  category,
  products,
}: MainCategorySectionProps) => {
  const navigate = useNavigate();
  const readMoreButtonHandler = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="space-y-6 my-20">
      <div className="flex justify-center">
        <p
          className="text-2xl font-bold cursor-pointer"
          onClick={() => readMoreButtonHandler(category)}
        >
          {categoryTitle(category)}
        </p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.pages.map((group, idx) => {
          const mainProduct = group.sortedProductsArray.slice(0, 4);
          return (
            idx === 0 && (
              <React.Fragment key={idx}>
                {mainProduct.length > 0 ? (
                  mainProduct.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="h-[200px] flex items-center">
                    <p className="w-full text-center">
                      등록된 상품이 없습니다.
                    </p>
                  </div>
                )}
              </React.Fragment>
            )
          );
        })}
      </div>
      <div className="flex justify-center">
        <Button size="lg" onClick={() => readMoreButtonHandler(category)}>
          VIEW MORE
        </Button>
      </div>
    </div>
  );
};

export default MainCategorySection;
