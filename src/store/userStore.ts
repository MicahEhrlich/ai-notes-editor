import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    token: string | null;
    username: string;
    userId: number; 
    loading: boolean;
    success: string;
    error: string;
    setToken: (token: string) => void;
    setUsername: (username: string) => void;
    setUserId: (userId: number) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setSuccess: (success: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            token: '',
            username: '',
            userId: 0,
            notes: [],
            loading: false,
            success: '',
            error: '',
            setSuccess: (success: string) => set({ success }),
            setError: (error: string) => set({ error }),
            setToken: (token) => set({ token }),
            setUsername: (username) => set({ username }),
            setUserId: (userId) => set({ userId }),
            clearUser: () => set({ token: '', username: '', userId: 0, loading: false, success: '', error: '' }),
            setLoading: (loading) => set(() => ({ loading }))
        }),
        {
            name: 'user-store', // name of the item in storage
            partialize: (state) => ({
                token: state.token,
                username: state.username,
                userId: state.userId,
            }),
        }
    )
);
