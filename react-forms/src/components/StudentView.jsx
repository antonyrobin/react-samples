import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentById } from '../services/studentService';

const StudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    setStudent(getStudentById(id));
  }, [id]);

  if (!student) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card form-container">
        <div className="header">
          <h2>Student Details</h2>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div className="detail-row">
            <span className="detail-label">ID</span>
            <span className="detail-value">{student.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{student.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Course</span>
            <span className="detail-value">{student.course}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{student.gender}</span>
          </div>
        </div>

        <Link to="/" className="btn btn-secondary">Back to List</Link>
      </div>
    </div>
  );
};

export default StudentView;