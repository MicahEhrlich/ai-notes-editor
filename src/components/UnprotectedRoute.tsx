import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/userStore"

export const UnprotectedRoute = () => {
    const token = useUserStore(state => state.token)
    return token ? <Navigate to="/notes" /> : <><Outlet /></>;
}