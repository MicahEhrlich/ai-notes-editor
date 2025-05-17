import React, { useState } from 'react';

interface RegisterProps {
    onRegister?: (username: string, password: string) => void;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordRegex.test(password)) {
            setError(
                'Password must be at least 8 characters, include uppercase, lowercase, and a number.'
            );
            return;
        }
        setError('');
        if (onRegister) {
            onRegister(username, password);
        }
        // Reset form
        setUsername('');
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>Register</h2>
            <div>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        required
                        onChange={e => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                </label>
            </div>
            <div style={{ marginTop: 12 }}>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </label>
            </div>
            {error && (
                <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
            )}
            <button type="submit" style={{ marginTop: 16 }}>
                Register
            </button>
        </form>
    );
};

export default Register;