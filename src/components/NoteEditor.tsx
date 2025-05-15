import { useState } from "react";
import { generateTags, summarizeNote } from "../openai-api";
import type { Note } from "../types/types";
import { NoteItem } from "./NoteItem";


export const NoteEditor = () => {
    const [list, setList] = useState<Note[]>([]);
    const [note, setNote] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    }

    const handleGenerateTags = (content: string, index: number) => {
        generateTags(content).then((tags) => {
            const updatedList = [...list];
            const generatedTags = tags.split(',').map(tag => tag.trim());
            updatedList[index].tags = generatedTags;
            setList(updatedList);
        }).catch((error) => {
            console.error("Error generating tags:", error);
        });
    }

    const handleSummaryChange = (content: string, index: number) => {
        summarizeNote(content).then((content) => {
            const updatedList = [...list];
            updatedList[index].content = content;
            setList(updatedList);
        }).catch((error) => {
            console.error("Error summarizing note:", error);
        });
    }

    const handleDeleteNote = (index: number) => {
        const updatedList = [...list];
        updatedList.splice(index, 1);
        setList(updatedList);
    }

    const addNote = () => {
        const newNote: Note = {
            id: Math.random().toString(36).substring(2, 15),
            content: note,
            createdAt: new Date(),
        };
        setList([...list, newNote]);
        setNote('');
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1>Note Editor</h1>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={note} onChange={handleChange} placeholder="Write a note" />
            <div className="flex flex-row gap-2">
                <button disabled={!note.length} onClick={addNote}>Add Note</button>
                <button onClick={() => setList([])}>Clear Notes</button>
            </div>
            {
                list.map((item, index) => {
                    return (
                        <NoteItem
                            note={item}
                            index={index}
                            handleGenerateTags={handleGenerateTags}
                            handleSummaryChange={handleSummaryChange}
                            handleDeleteNote={handleDeleteNote}
                        />
                    )
                })
            }
        </div>)
}