import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("token"); // Check if user is logged in
    const location = useLocation(); 

    if (!isAuthenticated) {
        // Redirect to login with 'from' param to go back after login
        return <Navigate to={`/Loggin?redirect=${location.pathname}`} />;
    }

    return children;
};

export default PrivateRoute;