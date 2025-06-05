import { useCallback, useEffect, useState } from "react";
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
    const [search, setSearch] = useState<string>('');
    const [tagSearchList, setTagSearchList] = useState<string[]>([]);
    const [content, setContent] = useState<string>('');
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const userId = useUserStore(state => state.userId);

    const memoizedFilteredList = useMemo(() => {
        if (tagSearchList.length) {
            return list.filter(item =>
                item.tags &&
                tagSearchList.every((tag: string) => item.tags && item.tags.includes(tag))
            );
        } else {
            return search.length
                ? list.filter(item => item.content.toLowerCase().includes(search.toLowerCase()))
                : list;
        }
    }, [search, list, tagSearchList]);

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

    const handleClearSearch = useCallback(() => {
        setSearch('');
        setTagSearchList([]);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }, []);

    const handleTagClick = useCallback((tag: string) => {
        if (!tagSearchList.includes(tag)) {
            const currentTags = tagSearchList;
            setTagSearchList([...currentTags, tag]);
        }
    }, [tagSearchList]);

    const handleTagSearchClick = useCallback((tag: string) => {
        const currentTags = tagSearchList.filter(t => t !== tag);
        setTagSearchList(currentTags);
    }, [tagSearchList]);

    const handleGenerateTags = useCallback((content: string, index: number) => {
        generateTagsMiddleware(content, index, list, setList);
    }, [list]);

    const handleSummaryChange = useCallback((content: string, index: number) => {
        summarizeNoteContentMiddleware(index, content, list, setList)
    }, [list]);

    const handleChangeSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTagSearchList(['']);
        setSearch(e.target.value);
    }, []);

    const handleNoteContentChange = useCallback((content: string, tags: string[], index: number) => {
        updateNoteMiddleware(index, content, tags, userId, setList, list);
    }, [userId, list, setList]);

    const handleDeleteNote = useCallback((index: number) => {
        deleteNoteMiddleware(index, list, setList).then(() => {
            setContent('');
        })
    }, [list]);

    const handleDeleteAllNotes = useCallback(async () => {
        deleteAllNotesMiddleware(setShowDialog, setList);
    }, []);

    const addNewNote = useCallback(async () => {
        addNewNoteMiddleware(userId, content, list, setList).then(() => {
            setContent('');
        })
    }, [userId, content, list]);

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
            <div className="flex md:flex-col items-center gap-3 w-full mb-2">
                <div className="flex flex-row flex-1 items-center gap-2 w-full">
                    <input
                        type="search"
                        className="flex-1 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm bg-white text-gray-900"
                        value={search}
                        onChange={handleChangeSearch}
                        placeholder="Search notes..."
                    />
                    <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium transition"
                    >
                        Clear
                    </button>
                </div>
                <div className="flex flex-row items-center gap-2">
                    {tagSearchList && tagSearchList.length > 0 && (
                        tagSearchList.map((tag, tagIndex) => (
                            <span
                                onClick={() => handleTagSearchClick(tag)}
                                key={`${tagIndex}-${tag}`}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 cursor-pointer transition font-medium"
                            >
                                {tag}
                            </span>
                        ))
                    )}
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
                        handleDeleteNote={handleDeleteNote}
                        handleTagClick={handleTagClick}
                    />
                )
                )
            }
        </div>)
}