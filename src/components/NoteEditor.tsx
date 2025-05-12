import { useState } from "react";

type Note = {
    id: string;
    content: string;
    summary?: string;
    tags?: string[];
    createdAt: Date;
  };

export const NoteEditor = () => {
    const [list, setList] = useState<Note[]>([]);
    const [note, setNote] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
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

    return (<div>
        <h1>Note Editor</h1>
        <input type="text" value={note} onChange={handleChange} placeholder="Note Content" />
        <button onClick={addNote}>Add Note</button>
        {
            list.map((item, index) => {
                return (
                    <div key={index}>
                        <h3>{item.content}</h3>
                    </div>
                )
            })
        }
    </div>)
}