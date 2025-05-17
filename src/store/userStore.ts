import { create } from 'zustand';

export interface Note {
    id: string;
    title: string;
    content: string;
    // Add other note fields as needed
}

interface UserState {
    token: string | null;
    username: string;
    notes: Note[];
    setToken: (token: string) => void;
    setUsername: (username: string) => void;
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    removeNote: (id: string) => void;
    clearUser: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    token: '',
    username: '',
    notes: [],
    setToken: (token) => set({ token }),
    setUsername: (username) => set({ username }),
    setNotes: (notes) => set({ notes }),
    addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
    removeNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
    clearUser: () => set({ token: '', username: '', notes: [] }),
    loading: false,
    setLoading: (loading) => set(() => ({ loading:
        loading}))
}));
