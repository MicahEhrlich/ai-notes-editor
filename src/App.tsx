import './App.css'
import { Navbar } from './components/Navbar'
import { NoteEditor } from './components/NoteEditor'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Register from './components/Register';

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />} >
            <Route path="/notes" element={
              <NoteEditor />
            } />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
