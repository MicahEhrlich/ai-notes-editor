import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/api';
import { useUserStore } from '../../store/userStore';
import { Loading } from '../navigation/Loading';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [userRegistered, setUserRegistered] = useState(false);
    const loading = useUserStore(state => state.loading);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters, include uppercase, lowercase, and a number.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        else {
            setError('');
            registerUser(username, password)
                .then(() => {
                    setUserRegistered(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                })
                .catch((err) => {
                    setError(err?.message || 'Registration failed. Please try again.');
                })
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Username</label>
                        <input
                            disabled={loading}
                            type="text"
                            value={username}
                            required
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                            className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            disabled={loading}
                            type="password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                            className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                        <input
                            disabled={loading}
                            type="password"
                            value={confirmPassword}
                            required
                            onChange={e => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            className="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
                    >
                        Register
                    </button>
                </form>
                {loading && (
                    <Loading />
                )}
                {userRegistered && <div className="mt-6 text-center">
                    <p className="text-gray-600">User registered successfully</p>
                </div>}
            </div>
        </div>
    );
};

export default Register;