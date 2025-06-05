import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { NoteItem } from "./NoteItem";
import { useUserStore } from "../../../store/userStore";
import { ConfirmDialog } from "../../dialogs/ConfirmDialog";
import type { Note } from "../../../types/types";
import { addNewNoteMiddleware, deleteAllNotesMiddleware, deleteNoteMiddleware, generateTagsMiddleware, getNotesByUserMiddleware, summarizeNoteContentMiddleware, updateNoteMiddleware } from "../../../service/notes";
import { useMemo } from "react";

export const NoteEditor = () => {
    const [list, setList] = useState<Note[]>([]);
    const [, setFilteredList] = useState<Note[]>([]);
    const [search, setSearch] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const userId = useUserStore(state => state.userId);

    const memoizedFilteredList = useMemo(() => {
        console.log("Memoized filtering notes with search:", search);
        return search.length
            ? list.filter(item => item.content.toLowerCase().includes(search.toLowerCase()))
            : list;
    }, [search, list]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                addNewNote();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const fetchNotes = () => {
            getNotesByUserMiddleware(userId, setList)
        };
        fetchNotes();
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        console.log("Setting filtered list based on memoizedFilteredList:", memoizedFilteredList);
    }, [memoizedFilteredList]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }

    const handleTagClick = (tag: string) => {
        const filtered = list.filter(item => item.tags && item.tags.includes(tag));
        setFilteredList(filtered);
    }

    const handleGenerateTags = (content: string, index: number) => {
        generateTagsMiddleware(content, index, list, setList);
    }

    const handleSummaryChange =
        (content: string, index: number) => {
            summarizeNoteContentMiddleware(index, content, list, setList)
        }

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleNoteContentChange = (content: string, tags: string[], index: number) => {
        updateNoteMiddleware(index, content, tags, userId, setList, list);
    }

    const handleDeleteNote = (index: number) => {
        deleteNoteMiddleware(index, list, setList).then(() => {
            setContent('');
        })
    }

    const handleDeleteAllNotes = async () => {
        deleteAllNotesMiddleware(setShowDialog, setList);
    }

    const addNewNote = async () => {
        addNewNoteMiddleware(userId, content, list, setList).then(() => {
            setContent('');
        })
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
                        value={content}
                        onChange={handleChange}
                        placeholder="Write a new note..."
                        maxLength={300}
                        minLength={10}
                    />
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                        disabled={!content.length}
                        onClick={addNewNote}
                        title="Add note"
                    >
                        Add
                    </button>
                </div>
                <div className="w-full text-right text-xs text-gray-400 mt-1">{content.length}/300</div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full mb-2">
                <div className="flex flex-1 items-center gap-2 w-full">
                    <input
                        type="search"
                        className="flex-1 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm bg-white text-gray-900"
                        value={search}
                        onChange={handleChangeSearch}
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
                        onClick={() => setShowDialog(true)}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition w-full md:w-auto shadow border-2 border-red-700"
                        title="Delete all notes"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                        Delete All Notes
                    </button>
                )}
            </div>
            {showDialog && (
                <ConfirmDialog
                    onClose={() => setShowDialog(false)}
                    onConfirm={handleDeleteAllNotes}
                    title="Confirm Delete All Notes"
                    message="Are you sure you want to delete all notes? This action cannot be undone."
                />
            )}
            {
                memoizedFilteredList.map((item, index) =>
                (
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
                )
            }
        </div>)
}