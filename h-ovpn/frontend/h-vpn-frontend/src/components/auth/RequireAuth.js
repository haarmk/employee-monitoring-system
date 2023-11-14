import { useLocation, Outlet, useNavigate, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsLogedIn } from "../../features/auth/authSlice"

const RequireAuth = () => {
    const isLogedIn = useSelector(selectIsLogedIn) || localStorage.getItem("isLoggedIn")
    const location = useLocation()
    const navigate = useNavigate()
    return (
        isLogedIn
            ? <Outlet />
            : <Navigate to="/auth/login" state={{ from: location }} replace /> 
            // : navigate("/login", {state:{from: location }})
    )
}
export default RequireAuth