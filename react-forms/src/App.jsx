import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StudentForm from './components/StudentForm';
import StudentView from './components/StudentView';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<StudentForm />} />
          <Route path="/edit/:id" element={<StudentForm />} />
          <Route path="/view/:id" element={<StudentView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;