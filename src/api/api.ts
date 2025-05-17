import instance from "./axios";

// Vite exposes env variables on import.meta.env
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

export interface AuthResponse {
    access_token: string;
}

export async function getBearerToken(username: string, password: string): Promise<string> {
    try {
        const response = await instance.post(`${baseUrl}/token`, {
            username,
            password,
        });
        if (!response.data) {
            throw new Error('Failed to authenticate');
        } else if (response.data.detail) {
            throw new Error(response.data.detail);
        }
        const data: AuthResponse = response.data;
        if (!data.access_token) {
            throw new Error('No token received');
        }
        return data.access_token;
    } catch (error) {
        throw new Error(`API error: ${error instanceof Error ? error.message : String(error)}`);
    }
}


export async function registerUser(username: string, password: string): Promise<void> {
    try {
        const response = await instance.post(`${baseUrl}/register`, {
            username,
            password,
        });
        if (response.status !== 201) {
            throw new Error('Registration failed');
        } else if (response.data.detail) {
            throw new Error(response.data.detail);
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
