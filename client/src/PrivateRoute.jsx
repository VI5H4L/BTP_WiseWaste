import { Navigate } from "react-router-dom";
function PrivateRoute({ children, roles }) {
    const role = localStorage.getItem("role");
  
    if (!roles.includes(role)) {
      // If the user's role is not allowed, redirect to the login page
      return <Navigate to="/login" />;
    }
  
    // If the user's role is allowed, render the children
    return children;

}
export default PrivateRoute;