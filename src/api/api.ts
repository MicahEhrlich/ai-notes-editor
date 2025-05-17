export interface AuthResponse {
    token: string;
}

export async function getBearerToken(username: string, password: string): Promise<string> {
    const response = await fetch('https://ai-notes-server.onrender.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to authenticate');
    }

    const data: AuthResponse = await response.json();
    return data.token;
}