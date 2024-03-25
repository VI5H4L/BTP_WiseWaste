import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { roleState } from "./Recoil/recoil_state";
function PrivateRoute({ children, roles }) {
    const role = useRecoilValue(roleState);
  
    if (!roles.includes(role)) {
      // If the user's role is not allowed, redirect to the login page
      return <Navigate to="/login" />;
    }
  
    // If the user's role is allowed, render the children
    return children;
}
export default PrivateRoute;