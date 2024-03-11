import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AnyRoute,
  PrivateRoute,
  PublicRoute,
  SellerRoute,
} from "./PrivateRoute";
import { Suspense, lazy } from "react";

const Layout = lazy(() => import("@/components/layout/Layout"));
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const Mypage = lazy(() => import("@/pages/Mypage"));
const ProductRegistration = lazy(
  () => import("@/pages/product/ProductRegistration")
);
const Category = lazy(() => import("@/pages/product/Category"));
const ProductDetail = lazy(() => import("@/pages/product/ProductDetail"));
const Search = lazy(() => import("@/pages/product/Search"));
const Order = lazy(() => import("@/pages/Order"));

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/order" element={<Order />} />
            </Route>
            <Route element={<SellerRoute />}>
              <Route
                path="/product-registration"
                element={<ProductRegistration />}
              />
            </Route>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>
            <Route element={<AnyRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/:category" element={<Category />} />
              <Route path="/:category/:id" element={<ProductDetail />} />
              <Route path="/search" element={<Search />} />
            </Route>
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
