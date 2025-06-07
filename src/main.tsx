import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LogRocket from 'logrocket';

LogRocket.init('unzgky/ai-note-editor');

createRoot(document.getElementById('root')!).render(
    <App />
)
