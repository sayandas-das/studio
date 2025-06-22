import type { Student } from '@/types/student';

const students: Student[] = [
  { id: 'S001', name: 'Alice Johnson', major: 'Computer Science', year: 3, gpa: 3.8, avatar: 'avatar1' },
  { id: 'S002', name: 'Bob Williams', major: 'Physics', year: 4, gpa: 3.5, avatar: 'avatar2' },
  { id: 'S003', name: 'Charlie Brown', major: 'Business Administration', year: 2, gpa: 3.2, avatar: 'avatar3' },
  { id: 'S004', name: 'Diana Miller', major: 'Computer Science', year: 4, gpa: 3.9, avatar: 'avatar4' },
  { id: 'S005', name: 'Ethan Davis', major: 'Mechanical Engineering', year: 3, gpa: 3.6, avatar: 'avatar5' },
  { id: 'S006', name: 'Fiona Garcia', major: 'Biology', year: 2, gpa: 3.7, avatar: 'avatar6' },
  { id: 'S007', name: 'George Rodriguez', major: 'Physics', year: 4, gpa: 3.3, avatar: 'avatar7' },
  { id: 'S008', name: 'Hannah Wilson', major: 'Business Administration', year: 1, gpa: 3.9, avatar: 'avatar8' },
  { id: 'S009', name: 'Ian Martinez', major: 'Computer Science', year: 2, gpa: 3.4, avatar: 'avatar9' },
  { id: 'S010', name: 'Jane Anderson', major: 'Mechanical Engineering', year: 4, gpa: 4.0, avatar: 'avatar10' },
  { id: 'S011', name: 'Kevin Thomas', major: 'Biology', year: 3, gpa: 2.9, avatar: 'avatar11' },
  { id: 'S012', name: 'Laura Taylor', major: 'Computer Science', year: 1, gpa: 3.85, avatar: 'avatar12' },
  { id: 'S013', name: 'Mason Hernandez', major: 'Physics', year: 2, gpa: 3.1, avatar: 'avatar13' },
  { id: 'S014', name: 'Nora Moore', major: 'Business Administration', year: 3, gpa: 3.75, avatar: 'avatar14' },
  { id: 'S015', name: 'Oscar Lee', major: 'Mechanical Engineering', year: 1, gpa: 3.95, avatar: 'avatar15' },
  { id: 'S016', name: 'Penelope White', major: 'Biology', year: 4, gpa: 3.65, avatar: 'avatar16' },
];

// In a real app, this would be an async call to Firestore
// e.g., using getDocs(collection(db, "students"))
export const getStudents = async (): Promise<Student[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return students;
};
