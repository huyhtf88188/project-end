import { useRoutes } from "react-router-dom";
import LayoutClient from "../layouts/LayoutClient";
import LayoutUser from "../layouts/LayoutUser";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import LayoutAdmin from "../layouts/LayoutAdmin";
import NotfoundPage from "../pages/NotfoundPage";
import ProtectedRoute from "./ProtectedRoute";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import ProductUpdateForm from "../pages/admin/ProductFormUpdate";
import ProductForm from "../pages/admin/ProductFrom";
import ProductTable from "../pages/admin/ProductTable";
import AttributeForm from "../pages/admin/AttributeForm";
import ProductPage from "../pages/ProductPage";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/user/CartPage";
import UserProfilePage from "../pages/user/UserProfilePage";
import OderPage from "../pages/admin/OderPage";
import PaymentPage from "../pages/user/PaymentPage";

const AppRoutes = () => {
  const routes = [
    {
      element: <LayoutClient />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "/products", element: <ProductPage /> },
        { path: "/products/:id", element: <ProductDetail /> },
      ],
    },
    {
      path: "/auth",
      element: <ProtectedRoute allowedRoles={["member"]} />,
      children: [
        {
          path: "",
          element: <LayoutUser />,
          children: [
            { path: "cart", element: <CartPage /> },
            { path: "profile", element: <UserProfilePage /> },
            { path: "payment", element: <PaymentPage /> },
          ],
        },
      ],
    },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/fogot-password", element: <ForgotPasswordPage /> },
    {
      path: "/admin",
      element: <ProtectedRoute allowedRoles={["admin"]} />,
      children: [
        {
          path: "",
          element: <LayoutAdmin />,
          children: [
            { path: "", element: <ProductTable /> },
            { path: "products", element: <ProductTable /> },
            { path: "products/add", element: <ProductForm /> },
            { path: "products/update/:id", element: <ProductUpdateForm /> },
            { path: "attributes", element: <AttributeForm /> },
            { path: "oders", element: <OderPage /> },
          ],
        },
      ],
    },
    { path: "*", element: <NotfoundPage /> },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
