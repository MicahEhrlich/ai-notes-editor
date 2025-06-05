import { useEffect, useState } from "react";
import type { Note } from "../../../types/types";
import { useUserStore } from "../../../store/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import React from "react";

type NoteProps = {
    note: Note;
    index: number;
    handleGenerateTags: (content: string, index: number) => void;
    handleSummaryChange: (content: string, index: number) => void;
    handleNoteContentChange: (content: string, tags: string[], index: number) => void;
    handleDeleteNote: (index: number) => void;
    handleTagClick: (tag: string) => void;
};

const NoteItemComponent = ({ note, index, handleGenerateTags, handleSummaryChange, handleNoteContentChange, handleDeleteNote, handleTagClick }: NoteProps) => {
    console.log("Rendering NoteItemComponent for note:", note.id, note.content);
    const [content, setContent] = useState(note.content);
    const [canEdit, setCanEdit] = useState(false);
    const loading = useUserStore(state => state.loading);

    const toggleEdit = () => {
        setCanEdit(!canEdit);
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    useEffect(() => {
        setContent(note.content);
    }, [note.content]);

    return (
        <div className="w-full max-w-full md:w-[720px] flex flex-col gap-4 p-4 md:p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] shadow transition-all duration-200" key={note.id}>
            <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex flex-row md:flex-col min-w-0 md:min-w-[8rem] w-full md:w-auto justify-between md:justify-start">
                    <span className="text-xs text-gray-400">{note.created_at.toLocaleString()}</span>
                </div>
                <div className="flex-1 w-full">
                    <div
                        className={`border border-gray-300 rounded-xl px-3 py-2 md:px-3 md:py-3 ${!canEdit ? "bg-gray-100" : "bg-white/80"
                            }`}
                    >
                        <textarea
                            rows={7}
                            cols={38}
                            placeholder="Note content"
                            disabled={!canEdit}
                            className="resize-none text-base text-gray-900 font-semibold whitespace-pre-line break-words bg-transparent"
                            onChange={handleContentChange}
                            value={content}
                        />
                    </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 shrink-0 mt-2 md:mt-0">
                    <button
                        className={`flex-1 md:flex-none px-3 py-1.5 text-sm rounded-lg transition font-medium ${canEdit
                            ? "bg-gray-400 hover:bg-gray-500 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        onClick={toggleEdit}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        <span className="hidden md:inline ml-2">Edit</span>
                    </button>
                    <button
                        className="flex-1 md:flex-none px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        onClick={() => handleSummaryChange(content, index)}
                    >
                        Summarize
                    </button>
                    <button
                        className="flex-1 md:flex-none px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        onClick={() => handleNoteContentChange(content, note.tags ?? [], index)}
                        disabled={canEdit || loading}
                    >
                        <FontAwesomeIcon icon={faSave} />
                        <span className="hidden md:inline ml-2">Save</span>
                    </button>
                    <button
                        className="flex-1 md:flex-none px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                        onClick={() => handleDeleteNote(index)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="hidden md:inline ml-2">Delete</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap md:items-center gap-2">
                {note.tags && note.tags.length > 0 && (
                    note.tags.map((tag, tagIndex) => (
                        <span
                            onClick={() => handleTagClick(tag)}
                            key={tagIndex}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 cursor-pointer transition font-medium"
                        >
                            {tag}
                        </span>
                    ))
                )}
                <button
                    className="ml-auto px-3 py-1 text-sm bg-gray-100 text-blue-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    onClick={() => handleGenerateTags(note.content, index)}
                >
                    Generate Tags
                </button>
            </div>
        </div>
    );
}

export const NoteItem = React.memo(NoteItemComponent);