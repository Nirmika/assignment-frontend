import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Protected({ children }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }

  return children;
}

export default Protected;
