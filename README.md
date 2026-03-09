# react-samples

Here is a complete, well-structured React application that fulfills all your requirements. To keep the code clean and maintainable, I have separated it into proper layers: a Service layer for handling localStorage operations, and a Component layer for the UI, stitched together with React Router.

## Create a React Application
Run this command to create a React application named my-react-app:

```npm create vite@latest my-react-app -- --template react```

## Prerequisites
Before creating these files, ensure you have a React project set up and install react-router-dom for navigation:


```npm install react-router-dom```

### Layer 1: Data Service (```src/services/studentService.js```)
This file acts as our "database" layer. It isolates all localStorage logic so our components stay clean.

```
const STORAGE_KEY = 'student_data';

// Generate a random ID for new students
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const getStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStudentById = (id) => {
  const students = getStudents();
  return students.find(student => student.id === id);
};

export const addStudent = (student) => {
  const students = getStudents();
  const newStudent = { ...student, id: generateId() };
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const updateStudent = (updatedStudent) => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === updatedStudent.id);
  if (index !== -1) {
    students[index] = updatedStudent;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }
};

export const deleteStudent = (id) => {
  const students = getStudents();
  const filteredStudents = students.filter(student => student.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStudents));
};
```

### Layer 2: Components
1. Home / Table View (```src/components/Home.jsx```)
Displays the table, handles the delete action, and provides navigation links.

```
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../services/studentService';

const Home = () => {
  const [students, setStudents] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(getStudents());
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
      loadStudents(); // Reload table data after deletion
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student List</h2>
      <Link to="/add">
        <button style={{ marginBottom: '15px' }}>New Student Registration</button>
      </Link>

      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.course}</td>
                <td>{student.gender}</td>
                <td>
                  <Link to={`/view/${student.id}`}><button>View</button></Link>{' '}
                  <Link to={`/edit/${student.id}`}><button>Edit</button></Link>{' '}
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
```

2. Add / Edit Form (```src/components/StudentForm.jsx```)
This component acts as both the "Add" and "Edit" form depending on whether an ID is present in the URL.

```
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addStudent, getStudentById, updateStudent } from '../services/studentService';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If ID exists, we are in Edit Mode
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    gender: 'Male',
  });

  useEffect(() => {
    if (isEditMode) {
      const existingStudent = getStudentById(id);
      if (existingStudent) {
        setFormData(existingStudent);
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateStudent(formData);
    } else {
      addStudent(formData);
    }
    navigate('/'); // Navigate back to home
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isEditMode ? 'Edit Student' : 'New Student Registration'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
        
        <label>Name:</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />

        <label>Course:</label>
        <input 
          type="text" 
          name="course" 
          value={formData.course} 
          onChange={handleChange} 
          required 
        />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <div style={{ marginTop: '15px' }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
```

3. View Student Details (```src/components/StudentView.jsx```)
Displays the data as read-only labels.

```
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentById } from '../services/studentService';

const StudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = getStudentById(id);
    setStudent(data);
  }, [id]);

  if (!student) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Details</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <div><strong>ID:</strong> <label>{student.id}</label></div>
        <div><strong>Name:</strong> <label>{student.name}</label></div>
        <div><strong>Course:</strong> <label>{student.course}</label></div>
        <div><strong>Gender:</strong> <label>{student.gender}</label></div>
      </div>
      <br />
      <Link to="/"><button>Back to Home</button></Link>
    </div>
  );
};

export default StudentView;
```

### Layer 3: Routing & App Entry (```src/App.js```)
Finally, we tie it all together using React Router in your main App.js file.

```
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
```