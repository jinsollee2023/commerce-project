import OrderManagement from "@/components/order/OrderManagement";
import AllProduct from "@/components/products/seller/AllProductBySeller";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const isSeller = localStorage.getItem("isSeller") === "true" ? true : false;
  const [tab, setTab] = useState<"상품 관리" | "판매 관리">("상품 관리");
  const navigate = useNavigate();

  return (
    <div className="mt-28 mx-auto px-[5%] md:px-[15%]">
      {isSeller && (
        <div>
          <div className="flex items-center justify-between pt-2 pb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setTab("상품 관리")}
                className={`text-2xl font-semibold ${
                  tab === "판매 관리" && "text-gray-400"
                }`}
              >
                상품 관리
              </button>
              <button
                onClick={() => setTab("판매 관리")}
                className={`text-2xl font-semibold ${
                  tab === "상품 관리" && "text-gray-400"
                }`}
                data-cy="sale-management-tab-button"
              >
                {isSeller ? "판매 관리" : "판매 관리"}
              </button>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/product-registration")}
              className={tab === "판매 관리" ? "hidden" : ""}
              data-cy="product-registration-button"
            >
              <IoMdAdd />
            </Button>
          </div>
          {tab === "상품 관리" && <AllProduct />}
          {tab === "판매 관리" && <OrderManagement />}
        </div>
      )}
      {!isSeller && (
        <div>
          <p className="text-2xl font-semibold">구매 관리</p>
          <OrderManagement />
        </div>
      )}
    </div>
  );
};

export default Mypage;
