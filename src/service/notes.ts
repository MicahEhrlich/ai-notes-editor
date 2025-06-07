import { deleteAllNotes, deleteNote, getNotesByUser, saveNote, updateNote } from "../api/api";
import { generateTags, summarizeNote } from "../openai-api";
import { useUserStore } from "../store/userStore";
import type { Note, NoteToSave } from "../types/types";

const setError = useUserStore.getState().setError;
const setSuccess = useUserStore.getState().setSuccess;

const clearMessages = () => {
    setSuccess('');
    setError('');
}

export async function addNewNoteMiddleware(userId: number, content: string, list: Note[], setList: (notes: Note[]) => void) {
    try {
        clearMessages();
        const noteToAdd: NoteToSave = {
            owner_id: userId,
            content,
        };
        const newNote = await saveNote(noteToAdd)
        if (newNote.tags && newNote.tags.length > 0) {
            newNote.tags = JSON.parse(String(newNote.tags)).map((tag: string) => tag.trim());
        }
        setList([...list, newNote]);
        setSuccess("Note added successfully");
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error saving note: ${error}`);
    }
}

export async function deleteNoteMiddleware(index: number, list: Note[], setList: (notes: Note[]) => void) {
    try {
        clearMessages();
        await deleteNote(list[index].id)
        const updatedList = [...list];
        updatedList.splice(index, 1);
        setList(updatedList);
        setSuccess("Note deleted successfully");
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error saving note: ${error}`);
    }
}

export async function deleteAllNotesMiddleware(setShowDialog: (show: boolean) => void, setList: (notes: Note[]) => void) {
    try {
        clearMessages();
        setShowDialog(false);
        await deleteAllNotes().then(() => {
            setSuccess("All notes deleted successfully");
            setList([]);
        }).catch((error) => {
            setError(`Error deleting all notes: ${error}`);
        });
        setSuccess("All notes deleted successfully");
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error deleting all notes: ${error}`);
    }
}

export async function generateTagsMiddleware(content: string, index: number, list: Note[], setList: (notes: Note[]) => void) {
    try {
        clearMessages();
        const tags = await generateTags(content)
        if (!tags || tags.length === 0) {
            throw Error("No tags generated from the content");
        }
        const updatedList = [...list];
        const generatedTags = tags.split(',').map(tag => tag.trim());
        const updatedNote: Note = {
            content: updatedList[index].content,
            id: updatedList[index].id,
            owner_id: updatedList[index].owner_id,
            tags: generatedTags,
            created_at: updatedList[index].created_at,
        };
        updatedList[index] = updatedNote;
        setList(updatedList);
        setSuccess("Tags generated successfully");
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error generating tags: ${error}`);
    }
}

export async function summarizeNoteContentMiddleware(index: number, content: string, list: Note[], setList: (notes: Note[]) => void) {
    try {
        clearMessages();
        const updatedList = [...list];
        const summarizedContent = await summarizeNote(content);
        const updatedNote: Note = {
            content: summarizedContent,
            id: updatedList[index].id,
            owner_id: updatedList[index].owner_id,
            tags: updatedList[index].tags || [],
            created_at: updatedList[index].created_at,
        };
        updatedList[index] = updatedNote;
        setList(updatedList);
        setSuccess("Note content summarized successfully");
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error updating note content: ${error}`);
    }
}

export async function updateNoteMiddleware(index: number, content: string, tags: string[], userId: number, setList: (notes: Note[]) => void, list: Note[]) {
    try {
        clearMessages();
        const updatedList = [...list];
        updatedList[index].content = content;
        updatedList[index].tags = tags;
        setList(updatedList);
        const noteToUpdate: NoteToSave = {
            owner_id: userId,
            content,
        };
        if (tags && tags.length > 0) {
            noteToUpdate.tags = tags;
        }
        await updateNote(updatedList[index].id, noteToUpdate, userId);
        setSuccess("Note updated successfully");
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error updating note: ${error}`);
    }
}

export async function getNotesByUserMiddleware(userId: number, setList: (notes: Note[]) => void) {
    try {
        clearMessages();
        const notes = await getNotesByUser(userId);
        setList(notes);
    } catch (error) {
        const err = error as Error;
        setError(err.message || `Error fetching notes: ${error}`);
    }
}