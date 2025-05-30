import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

export const Navbar = () => {
    const token = useUserStore(state => state.token)
    const username = useUserStore(state => state.username);
    const logout = useUserStore(state => state.clearUser);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    }

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="font-bold md:text-xl text-gray-900 dark:text-white">
                AI Notes
            </div>
            <div className="flex items-center space-x-4">
                {token ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 dark:text-gray-200">{username}</span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                ) : null}

                {window.location.pathname === '/register' && (
                    <button onClick={() => navigate("/login")}>Login</button>
                   
                )}
                <button
                    // onClick={() => {
                    //     const current = document.documentElement.getAttribute('data-theme');
                    //     const next = current === 'dark' ? 'light' : 'dark';
                    //     document.documentElement.setAttribute('data-theme', next);
                    // }}
                    className="px-4 py-2 rounded-md border-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium cursor-pointer"
                    aria-label="Toggle dark mode"
                >
                    🌓
                </button>
            </div>
        </nav>
    )
}