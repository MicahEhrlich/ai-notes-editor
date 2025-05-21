import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note } from '../types/types';


interface UserState {
    token: string | null;
    username: string;
    notes: Note[];
    userId: number;
    setToken: (token: string) => void;
    setUsername: (username: string) => void;
    setUserId: (userId: number) => void;
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    removeNote: (id: number) => void;
    clearUser: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            token: '',
            username: '',
            userId: 0,
            notes: [],
            loading: false,
            setToken: (token) => set({ token }),
            setUsername: (username) => set({ username }),
            setUserId: (userId) => set({ userId }),
            setNotes: (notes) => set({ notes }),
            addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
            removeNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
            clearUser: () => set({ token: '', username: '', notes: [] }),
            setLoading: (loading) => set(() => ({ loading }))
        }),
        {
            name: 'user-store', // name of the item in storage
            partialize: (state) => ({
                token: state.token,
                username: state.username,
                userId: state.userId,
                notes: state.notes
            }),
        }
    )
);
