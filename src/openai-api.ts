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
    if (typeof data.summary === 'string') {
      const idx = data.summary.indexOf(':');
      if (idx !== -1) {
        data.summary = data.summary.slice(idx + 1).trim();
      }
    }
    return data.summary;
  };
  