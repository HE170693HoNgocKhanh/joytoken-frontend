import LoginPage from "../pages/Auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductList from "../pages/ProductsPage/ProductsList";
import HomePage from "./../pages/HomePage/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import ChatPage from "../pages/ChatPage/ChatPage";
import RegisterPage from "../pages/Auth/RegisterPage";

// Admin Pages
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import UserManagement from "../pages/Admin/UserManagement/UserManagement";
import ProductManagement from "../pages/Admin/ProductManagement/ProductManagement";
import CategoryManagement from "../pages/Admin/CategoryManagement/CategoryManagement";
import InventoryManagement from "../pages/Admin/InventoryManagement/InventoryManagement";
import ExchangeManagement from "../pages/Admin/ExchangeManagement/ExchangeManagement";
import OrderManagement from "../pages/Admin/OrderManagement/OrderManagement";
import OrderSuccess from "../pages/Order-Success/Order-Success";
import OrderFailure from "../pages/OrderFailure/Order-Failure";
import OrderHistory from "../pages/OrderHistory/OrderHistory";
import ProfilePage from "../pages/Profile/ProfilePage";
import ExchangePaymentSuccess from "../pages/ExchangePaymentSuccess/ExchangePaymentSuccess";
import ExchangePaymentFailure from "../pages/ExchangePaymentFailure/ExchangePaymentFailure";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/register",
    page: RegisterPage,
    isShowHeader: false,
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
    isShowHeader: false,
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
    path: "/exchange-payment-success",
    page: ExchangePaymentSuccess,
    isShowHeader: true,
  },
  {
    path: "/exchange-payment-failure",
    page: ExchangePaymentFailure,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: ProfilePage,
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
    isStaffRoute: true,
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
    path: "/admin/orders",
    page: OrderManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },
  {
    path: "/admin/exchanges",
    page: ExchangeManagement,
    isShowHeader: false,
    isAdminRoute: true,
  },

  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: true,
  },
];
