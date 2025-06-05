import { registerUser } from "../api/api";
import { useUserStore } from "../store/userStore";

export async function registerUserMiddleware(username: string, password: string, navigate: (path: string) => void) {
    const setError = useUserStore.getState().setError;
    const setSuccess = useUserStore.getState().setSuccess;

    try {
        registerUser(username, password);
        setSuccess('Registration successful! Redirecting to login...');
        setError('');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    } catch (error) {
        const err = error as Error;
        setError(err.message || 'Registration failed. Please try again.');
    }
}