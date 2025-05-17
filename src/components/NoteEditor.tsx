import { useEffect, useState } from "react";
import { generateTags, summarizeNote } from "../openai-api";
import type { Note } from "../types/types";
import { NoteItem } from "./NoteItem";


export const NoteEditor = () => {
    const [list, setList] = useState<Note[]>([]);
    const [filterdList, setFilteredList] = useState<Note[]>([]);
    const [search, setSearch] = useState<string>('');
    const [note, setNote] = useState<string>('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                addNote();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const storedList = localStorage.getItem('notes');
        if (storedList) {
            setList(JSON.parse(storedList));
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(list));
    }, [list]);

    useEffect(() => {
        const filtered = search.length ? list.filter(item => item.content.toLowerCase().includes(search.toLowerCase())) : list;
        setFilteredList(filtered);
    }, [search, list]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    }

    const handleTagClick = (tag: string) => {
        const filtered = list.filter(item => item.tags && item.tags.includes(tag));
        setFilteredList(filtered);
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
        <div className="flex flex-col items-center justify-center h-screen gap-4 w-full md:h-full m-auto md:max-w-2xl">
            <div className="w-full max-w-xl bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 mb-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 text-blue-800 tracking-tight">
                    Note Editor
                </h1>
                <div className="w-full flex gap-2" style={{ background: "#f5f7fa", borderRadius: "1rem" }}>
                    <input
                        type="text"
                        className="flex-1 px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow transition placeholder-gray-400 bg-white text-gray-900"
                        value={note}
                        onChange={handleChange}
                        placeholder="Write a new note..."
                        maxLength={300}
                    />
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                        disabled={!note.length}
                        onClick={addNote}
                        title="Add note"
                    >
                        Add
                    </button>
                </div>
                <div className="w-full text-right text-xs text-gray-400 mt-1">{note.length}/300</div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full mb-2">
                <div className="flex flex-1 items-center gap-2 w-full">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm bg-white text-gray-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes..."
                    />
                    <button
                        onClick={() => setFilteredList(list)}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium transition"
                    >
                        Clear
                    </button>
                </div>
            </div>
            <div className="flex justify-end w-full mb-2">
                {list.length > 0 && (
                    <button
                        onClick={() => setList([])}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition w-full md:w-auto shadow border-2 border-red-700"
                        title="Delete all notes"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete All Notes
                    </button>
                )}
            </div>
            {
                filterdList.map((item, index) => {
                    return (
                        <NoteItem
                            key={item.id}
                            note={item}
                            index={index}
                            handleGenerateTags={handleGenerateTags}
                            handleSummaryChange={handleSummaryChange}
                            handleDeleteNote={handleDeleteNote}
                            handleTagClick={handleTagClick}
                        />
                    )
                })
            }
        </div>)
}