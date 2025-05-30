import type { AxiosResponse } from "axios";
import type { Note } from "./types/types";

export function parseNotes(response: AxiosResponse): Note[] {
    if (!response || !Array.isArray(response.data)) {
        throw new Error("Invalid notes data");
    }
    return response.data.map((note) => ({
        id: note.id,
        owner_id: note.owner_id,
        content: note.content,

        tags: Array.isArray(note.tags)
            ? note.tags.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
            : (typeof note.tags === "string"
                ? note.tags
                    .replace(/^\[|\]$/g, "") // remove leading/trailing brackets
                    .split(",")              // split by comma
                    .map((tag: string) => tag.trim())  // trim whitespace
                    .filter((tag: string | unknown[]) => tag.length > 0)
                : []),
        created_at: new Date(note.created_at),
    }));
}

