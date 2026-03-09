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