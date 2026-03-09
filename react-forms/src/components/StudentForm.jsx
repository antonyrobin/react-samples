import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addStudent, getStudentById, updateStudent } from '../services/studentService';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ name: '', course: '', gender: 'Male' });

  useEffect(() => {
    if (isEditMode) {
      const existingStudent = getStudentById(id);
      if (existingStudent) setFormData(existingStudent);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEditMode ? updateStudent(formData) : addStudent(formData);
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card form-container">
        <div className="header">
          <h2>{isEditMode ? 'Edit Student' : 'New Registration'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input type="text" name="course" className="form-control" value={formData.course} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="btn-group" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">Save Student</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;