import './App.css'
import React from 'react';
import { Navbar } from './components/navigation/Navbar';
import { NoteEditor } from './components/pages/Notes/NoteEditor'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UnprotectedRoute } from './components/navigation/UnprotectedRoute';
import { ProtectedRoute } from './components/navigation/ProtectedRoute';
import Login from './components/pages/Login';
import PageNotFound from './components/pages/PageNotFound';
import Register from './components/pages/Register';
import { Loading } from './components/navigation/Loading';


function App() {
  return (
    <>
      <BrowserRouter>
        <React.Suspense fallback={<Loading />}>
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
