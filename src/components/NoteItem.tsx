import type { Note } from "../types/types";

type NoteProps = {
    note: Note;
    index: number;
    handleGenerateTags: (content: string, index: number) => void;
    handleSummaryChange: (content: string, index: number) => void;
    handleDeleteNote: (index: number) => void;
};

export const NoteItem = ({ note, index, handleGenerateTags, handleSummaryChange, handleDeleteNote }: NoteProps) => {
    return (
        <div className="w-full md:w-auto flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-gray-700 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200" key={note.id}>
            <div className="flex flex-row flex-wrap items-start gap-4" key={index}>
                <p className="text-xs text-gray-500 min-w-[8rem]">{note.createdAt.toLocaleString()}</p>
                <h2 className="flex-1 text-base text-white-800 text-lg font-medium">{note.content}</h2>
                <div className="flex flex-row gap-2 shrink-0">
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" onClick={() => handleSummaryChange(note.content, index)}>Summarize</button>
                    <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition" onClick={() => handleDeleteNote(index)}>Delete</button>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {
                    note.tags && note.tags.length > 0 ? (
                        note.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-sm bg-sky-200 text-sky-800 px-3 py-1 rounded-full hover:bg-sky-300 transition">{tag}</span>
                        ))
                    ) : null
                }
                <button className="ml-auto text-sm text-sky-700 hover:underline" onClick={() => handleGenerateTags(note.content, index)}>Generate Tags</button>
            </div>
        </div>
    );
}