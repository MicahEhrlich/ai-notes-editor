import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or use your frontend domain instead of '*'
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Missing note content' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: `Give me 3 relevant tags for the following note and write them down split by ',':\n\n${content}` }
            ]
        });

        res.status(200).json({
            summary: completion.choices[0].message.content
        });

    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}
