import PropTypes from "prop-types";
import React from "react";

import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import useRole from "../hooks/useRole";

const SellerRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  //   const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (role === "seller") {
    return children;
  }
  return (
    <Navigate to="/dashboard" state={{ from: location }} replace></Navigate>
  );
};

export default SellerRoute;

SellerRoute.propTypes = {
  children: PropTypes.node,
};
