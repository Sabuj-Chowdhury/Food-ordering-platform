import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Restaurants from "../pages/Restaurant/Restaurants";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../layouts/Dashboard";
import DashboardHome from "../components/DashboardHome/DashboardHome";
import Profile from "../components/Profile/Profile";
import ManageUsers from "../pages/Admin/ManageUsers/ManageUsers";
import RequestPage from "../pages/Users/RequestPage/RequestPage";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import SellerRoute from "./SellerRoute";
import AddRestaurant from "../pages/Seller/AddRestaurant/AddRestaurant";
import AddMenu from "../pages/Seller/AddMenu/AddMenu";
import ManageMenu from "../pages/Seller/ManageMenu/ManageMenu";
import ManageOrders from "../pages/Seller/ManageOrders/ManageOrders";
import MyRestaurant from "../pages/Seller/MyRestaurant/MyRestaurant";
import UpdateMenu from "../pages/Seller/UpdateMenu/UpdateMenu";
import Menu from "../pages/Menu/Menu";
import Checkout from "../pages/Checkout/Checkout";
import MyOrders from "../pages/Users/MyOrders/MyOrders";
import PaymentHistory from "../pages/Users/Payments/PaymentHistory";
import PaymentSuccess from "../pages/Payments/PaymentSuccess";
import PaymentFail from "../pages/Payments/PaymentFail";
import PaymentCancel from "../pages/Payments/PaymentCancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/restaurants",
        element: <Restaurants />,
      },
      {
        path: "/restaurant/:id",
        element: <Menu />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/payment/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment/fail",
        element: <PaymentFail />,
      },
      {
        path: "/payment/cancel",
        element: <PaymentCancel />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },

      // Admin Routes
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },

      // USER Routes
      {
        path: "request",
        element: (
          <PrivateRoute>
            <UserRoute>
              <RequestPage />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      {
        path: "my-orders",
        element: (
          <PrivateRoute>
            <UserRoute>
              <MyOrders />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      {
        path: "payment-history",
        element: (
          <PrivateRoute>
            <UserRoute>
              <PaymentHistory />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      // Seller Routes
      {
        path: "add-restaurant",
        element: (
          <PrivateRoute>
            <SellerRoute>
              <AddRestaurant />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "add-menu/:id",
        element: (
          <PrivateRoute>
            <SellerRoute>
              <AddMenu />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-menu",
        element: (
          <PrivateRoute>
            <SellerRoute>
              <ManageMenu />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "update-menu/:id",
        element: (
          <PrivateRoute>
            <SellerRoute>
              <UpdateMenu />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-orders",
        element: (
          <PrivateRoute>
            <SellerRoute>
              <ManageOrders />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "my-restaurant",
        element: (
          <PrivateRoute>
            <SellerRoute>
              <MyRestaurant />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
