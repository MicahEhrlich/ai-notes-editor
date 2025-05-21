import './App.css'
import { Navbar } from './components/Navbar'
import { NoteEditor } from './components/NoteEditor'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Register from './components/Register';
import { UnprotectedRoute } from './components/UnprotectedRoute';
import React from 'react';

function App() {
  return (
    <>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <Routes>
            <Route element={<UnprotectedRoute />} >
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />} >
              <Route path="/notes" element={
                <NoteEditor />
              } />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
