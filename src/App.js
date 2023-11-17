import React from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import ListNotes from './components/ListNotesLayout';
import AddNote from './components/AddNote';
import Login from "./components/Login";
import Register from './components/Register';
import Header from './components/Header';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes> 
            <Route path="/" element={<ListNotes />} />
            <Route path="/notes" element={<ListNotes />} />
            <Route path="/add" element={<AddNote />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        {/*<Footer />*/}
      </BrowserRouter>
    </div>
  );
}

export default App;
