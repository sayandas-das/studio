import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import type { Student } from '@/types/student';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAGjZCPF60rXXyZRVYgveARdycVVuQClO8",
  authDomain: "teacher-student-report.firebaseapp.com",
  projectId: "teacher-student-report",
  storageBucket: "teacher-student-report.appspot.com",
  messagingSenderId: "656795496800",
  appId: "1:656795496800:web:c27f8d1254dfdcf6476e05",
  measurementId: "G-FJ5CJLW874"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seed database if it's empty
const seedDatabase = async (): Promise<Student[]> => {
  const studentsToSeed: Student[] = [
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

  const writePromises = studentsToSeed.map(student => {
    const { id, ...studentData } = student;
    return setDoc(doc(db, "students", id), studentData);
  });
  
  await Promise.all(writePromises);
  
  console.log("Database seeded with student data.");
  return studentsToSeed;
}

export const getStudents = async (): Promise<Student[]> => {
  const studentsCol = collection(db, 'students');
  const studentSnapshot = await getDocs(studentsCol);
  
  if (studentSnapshot.empty) {
    console.log("No students found, seeding database...");
    return seedDatabase();
  }

  const studentList = studentSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      major: data.major,
      year: data.year,
      gpa: data.gpa,
      avatar: data.avatar,
    } as Student;
  });

  return studentList;
};
