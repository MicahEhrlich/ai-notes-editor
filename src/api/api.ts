import axios from "axios";
import instance from "./axios";
import type { Note, NoteToSave } from "../types/types";
import { parseNotes } from "../utils";

// Vite exposes env variables on import.meta.env
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface LoginResponse extends AuthResponse {
    access_token: string;
    token_type: string;
    username: string;
    user_id: number;
}

export interface RegisterResponse {
    message: string;
}


export async function login(username: string, password: string): Promise<LoginResponse> {
    try {
        const response = await instance.post(`${baseUrl}/login`, {
            username,
            password,
        });
        if (!response.data) {
            throw new Error('Failed to authenticate');
        } else if (response.data.detail) {
            throw new Error(response.data.detail);
        }
        const data: LoginResponse = response.data;
        if (!data.access_token) {
            throw new Error('No token received');
        }
        return { access_token: data.access_token, token_type: data.token_type, username: data.username, user_id: data.user_id };
    } catch (error) {
        throw new Error(`API error: ${error instanceof Error ? error.message : String(error)}`);
    }
}


export async function registerUser(username: string, password: string): Promise<RegisterResponse> {
    try {
        const response = await instance.post(`${baseUrl}/register`, {
            username,
            password,
        });
        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error('Registration failed');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.detail);
            } else {
                throw new Error('Registration failed');
            }
        }
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}


export async function saveNote(note: NoteToSave): Promise<Note> {
    try {
        const response = await instance.post(
            `${baseUrl}/notes`,
            {
                content: note.content,
                owner_id: note.owner_id,
            },
        );
        if (response.status !== 201) {
            throw new Error('Failed to save note');
        }
        return response.data as Note;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}


export async function updateNote(noteId: number, note: NoteToSave, user_id: number): Promise<Note> {
    try {
        const tags = note.tags ? JSON.stringify(note.tags) : '[]';
        const parsedTags = JSON.parse(tags);
        const response = await instance.put(
            `${baseUrl}/notes/${noteId}`,
            {
                content: note.content,
                tags: parsedTags,
                owner_id: user_id,
            },
        );
        if (response.status !== 200) {
            throw new Error('Failed to update note');
        }
        return response.data as Note;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}


export async function getNotesByUser(userId: number): Promise<Note[]> {
    try {
        const response = await instance.get(`${baseUrl}/notes`, {
            params: { owner_id: userId }
        });
        if (response.status !== 200) {
            throw new Error('Failed to fetch notes');
        }
        if (Array.isArray(response.data)) {
            response.data = parseNotes(response);
        }
        return response.data as Note[];
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}


export async function deleteNote(noteId: number): Promise<void> {
    try {
        const response = await instance.delete(`${baseUrl}/notes/${noteId}`);
        if (response.status !== 204) {
            throw new Error('Failed to delete note');
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}


export async function deleteAllNotes(): Promise<void> {
    try {
        const response = await instance.delete(`${baseUrl}/notes`);
        if (response.status !== 204) {
            throw new Error('Failed to delete note');
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}