import './App.css'
import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { NoteEditor } from './components/pages/Notes/NoteEditor'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UnprotectedRoute } from './components/routing/UnprotectedRoute';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import Login from './components/pages/Login';
import PageNotFound from './components/pages/PageNotFound';
import Register from './components/pages/Register';
import { Loading } from './components/layout/Loading';
import { Layout } from './components/layout/Layout';


function App() {
  return (
    <>
      <BrowserRouter>
        <React.Suspense fallback={<Loading />}>
          <Navbar />
          <Layout>
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
          </Layout>
        </React.Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
