export const summarizeNote = async (content: string): Promise<string> => {
    const res = await fetch('https://ai-notes-editor.vercel.app/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  
    const data = await res.json();
    return data.summary;
  };

  export const generateTags = async (content: string): Promise<string> => {
    const res = await fetch('https://ai-notes-editor.vercel.app/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  
    const data = await res.json();
    return data.summary;
  };
  