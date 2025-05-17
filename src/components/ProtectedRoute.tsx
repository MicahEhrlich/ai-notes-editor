import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/userStore"

export const ProtectedRoute = () => {
    const token = useUserStore(state => state.token)
    return token ? <><Outlet /></> : <Navigate to="/login" />;
}