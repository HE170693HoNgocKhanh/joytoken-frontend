import LoginPage from "../pages/Login/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductList from "../pages/ProductsPage/ProductsList";
import HomePage from "./../pages/HomePage/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import ChatPage from "../pages/ChatPage/ChatPage";

// Admin Pages
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import UserManagement from "../pages/Admin/UserManagement/UserManagement";
import ProductManagement from "../pages/Admin/ProductManagement/ProductManagement";
import CategoryManagement from "../pages/Admin/CategoryManagement/CategoryManagement";
import InventoryManagement from "../pages/Admin/InventoryManagement/InventoryManagement";
import OrderSuccess from "../pages/Order-Success/Order-Success";
import OrderFailure from "../pages/OrderFailure/Order-Failure";
import OrderHistory from "../pages/OrderHistory/OrderHistory";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/products",
    page: ProductList,
    isShowHeader: true,
  },
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: true,
  },
  {
    path: "/product/:id",
    page: ProductDetailPage,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
  },
  {
    path: "/order-success",
    page: OrderSuccess,
    isShowHeader: true,
  },
  {
    path: "/order-failure",
    page: OrderFailure,
    isShowHeader: true,
  },
  {
    path: "/order-history",
    page: OrderHistory,
    isShowHeader: true,
  },
  {
    path: "/chat",
    page: ChatPage,
  },
  {
    path: "/chat/:id",
    page: ChatPage,
  },
  // Admin Routes

  {
    path: "/admin/dashboard",
    page: Dashboard,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/users",
    page: UserManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/products",
    page: ProductManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/categories",
    page: CategoryManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/inventory",
    page: InventoryManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },

  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: true,
  },
  // Admin Routes

  {
    path: "/admin/dashboard",
    page: Dashboard,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/users",
    page: UserManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/products",
    page: ProductManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/categories",
    page: CategoryManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/inventory",
    page: InventoryManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: true,
  },
];
