import LoginPage from "../pages/Login/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductList from "../pages/ProductsPage/ProductsList";
import HomePage from "./../pages/HomePage/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../pages/CartPage/CartPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true
  },
  {
    path: "/products",
    page: ProductList,
    isShowHeader: true
  },
   {
    path: "*",
    page: NotFoundPage,
    isShowHeader : true
  },
  
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: true
  },
  {
    path: "/product/:id",
    page: ProductDetailPage,
    isShowHeader: true
  },
   {
    path: "/cart",
    page: CartPage,
    isShowHeader: true
  },
];
