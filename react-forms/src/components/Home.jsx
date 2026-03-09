import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../services/studentService';

const Home = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => { loadStudents(); }, []);
  const loadStudents = () => { setStudents(getStudents()); };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
      loadStudents();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Student List</h2>
          <Link to="/add" className="btn btn-primary">
            + New Student
          </Link>
        </div>

        <div className="table-responsive">
          <table className="student-table">
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
                      <div className="btn-group">
                        <Link to={`/view/${student.id}`} className="btn btn-secondary">View</Link>
                        <Link to={`/edit/${student.id}`} className="btn btn-primary">Edit</Link>
                        <button onClick={() => handleDelete(student.id)} className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No students found. Add one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;