import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import { useUserStore } from "../../store/userStore";
import { Loading } from "../navigation/Loading";


const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const setToken = useUserStore(state => state.setToken);
    const setUser = useUserStore(state => state.setUsername);
    const setUserId = useUserStore(state => state.setUserId);
    const loading = useUserStore(state => state.loading);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        login(username, password)
            .then(data => {
                setToken(data.access_token);
                setUser(data.username);
                setUserId(data.user_id);
                navigate('/notes');
            })
            .catch(err => {
                console.error('Login failed:', err);
                setError('Invalid username or password.');
            })
        setError('');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Username</label>
                        <input
                            disabled={loading}
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            disabled={loading}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
                    >
                        Login
                    </button>
                </form>
                {loading && (
                    <Loading />
                )}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;