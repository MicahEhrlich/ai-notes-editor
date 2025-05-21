export type Note = {
    id: number;
    owner_id: string;
    content: string;
    tags?: string[];
    createdAt: Date;
};

export type NoteToSave = {
    content: string;
    tags?: string[];
    owner_id: number;
};