import { useState } from "react";
import { generateTags, summarizeNote } from "../openai-api";

type Note = {
    id: string;
    content: string;
    tags?: string[];
    createdAt: Date;
};

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
                        <div className="flex flex-col gap-2 hover:bg-sky-700 p-2 rounded-md" key={item.id}>
                            <div className="flex flex-row items-baseline gap-4" key={index}>
                                <p className="w-32 flex-auto text-xs">{item.createdAt.toLocaleString()}</p>
                                <h2 className="w-128 flex-auto text-xl text-left">{item.content}</h2>
                                <div className="w-64 flex flex-row items-baseline gap-2">
                                    <button onClick={() => handleSummaryChange(item.content, index)}>Summarize</button>
                                    <button onClick={() => handleDeleteNote(index)}>Delete</button>
                                </div>
                            </div>
                            <div className="flex flex-auto items-baseline gap-2">
                                <p className="w-180 flex flex-row items-baseline justify-center text-sm">{item.tags}</p>
                                <button className="w-40 text-sm" onClick={() => handleGenerateTags(item.content, index)}>Generate Tags</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>)
}