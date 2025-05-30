import { useEffect, useState } from "react";
import { generateTags, summarizeNote } from "../../../openai-api";
import { NoteItem } from "./NoteItem";
import { deleteNote, getNotesByUser, saveNote } from "../../../api/api";
import { useUserStore } from "../../../store/userStore";
import type { Note, NoteToSave } from "../../../types/types";
import { Loading } from "../../navigation/Loading";

const CLEAR_TIMEOUT = 5000;

export const NoteEditor = () => {
    const [list, setList] = useState<Note[]>([]);
    const [filterdList, setFilteredList] = useState<Note[]>([]);
    const [search, setSearch] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const loading = useUserStore(state => state.loading);
    const userId = useUserStore(state => state.userId);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                addNote();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const fetchNotes = async () => {
            try {
                const notes = await getNotesByUser(userId);
                setList(notes);
                setFilteredList(notes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
        fetchNotes();
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const filtered = search.length ? list.filter(item => item.content.toLowerCase().includes(search.toLowerCase())) : list;
        setFilteredList(filtered);
    }, [search, list]);

    useEffect(() => {
        if (error || success) {
            setTimeout(() => {
                setError('');
            }, CLEAR_TIMEOUT);
        }
    }, [error, success]);

    const clearMessages = () => {
        setSuccess('');
        setError('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    }

    const handleTagClick = (tag: string) => {
        const filtered = list.filter(item => item.tags && item.tags.includes(tag));
        setFilteredList(filtered);
    }

    const handleGenerateTags = (content: string, index: number) => {
        clearMessages();
        generateTags(content).then((tags) => {
            const updatedList = [...list];
            const generatedTags = tags.split(',').map(tag => tag.trim());
            updatedList[index].tags = generatedTags;
            setList(updatedList);
        }).catch((error) => {
            setError("Error generating tags:" + error);
        });
    }

    const handleSummaryChange = (content: string, index: number) => {
        clearMessages();
        summarizeNote(content).then((content) => {
            const updatedList = [...list];
            updatedList[index].content = content;
            setList(updatedList);
        }).catch((error) => {
            setError("Error summarizing note:" + error);
        });
    }

    const handleNoteContentChange = (content: string, index: number) => {
        clearMessages();
        const updatedList = [...list];
        updatedList[index].content = content;
        setList(updatedList);
        // saveNote(updatedList[index], userId).then(() => {
        //     setSuccess("Note updated successfully");
        // }).catch((error) => {
        //     setError(`Error updating note: ${error}`);
        // });
    }

    const handleDeleteNote = async (index: number) => {
        clearMessages();
        await deleteNote(list[index].id).then(() => {
            setSuccess("Note deleted successfully");
        }).catch((error) => {
            setError(`Error deleting note:" ${error}`);
        }).finally(() => {
            const updatedList = [...list];
            updatedList.splice(index, 1);
            setList(updatedList);
            setNote('');
        })
    }

    const addNote = async () => {
        clearMessages();
        const noteToAdd: NoteToSave = {
            owner_id: userId,
            content: note,
            tags: [],
        };
        await saveNote(noteToAdd, userId).then((newNote) => {
            setList([...list, newNote]);
            setSuccess("Note added successfully");
        }).catch((error) => {
            setError(`Error saving note: ${error}`);
        }).finally(() => {
            setNote('');
        });
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-8 w-full md:h-full m-auto md:max-w-2xl">
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
                        minLength={10}
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
                <div className="text-green-600 font-semibold mt-2 min-h-[1.5em]">
                    {success}
                </div>
                <div className="text-red-600 font-semibold mt-2 min-h-[1.5em]">{error}</div>
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
            {loading && (
                <Loading />
            )}
            {
                filterdList.map((item, index) => {
                    return (
                        <NoteItem
                            key={item.id}
                            note={item}
                            index={index}
                            handleGenerateTags={handleGenerateTags}
                            handleSummaryChange={handleSummaryChange}
                            handleNoteContentChange={handleNoteContentChange}
                            handleDeleteNote={() => handleDeleteNote(index)}
                            handleTagClick={handleTagClick}
                        />
                    )
                })
            }
        </div>)
}