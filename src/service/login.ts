import { login } from '../api/api';
import { useUserStore } from '../store/userStore';

export async function loginMiddleware(
    username: string,
    password: string,
    navigate: (path: string) => void
) {
    const setToken = useUserStore.getState().setToken;
    const setUsername = useUserStore.getState().setUsername;
    const setUserId = useUserStore.getState().setUserId;
    const setError = useUserStore.getState().setError;
    
    try {
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        const data = await login(username, password);
        setToken(data.access_token);
        setUsername(data.username);
        setUserId(data.user_id);
        setError('');
        navigate('/notes');
    } catch (err) {
        console.error('Login failed:', err);
        setError('Invalid username or password.');
    }
}