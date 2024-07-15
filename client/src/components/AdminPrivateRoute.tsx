import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminPrivateRoute;
