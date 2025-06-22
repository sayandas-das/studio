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
    { id: 'S001', name: 'Alice Johnson', major: 'Computer Science', avatar: 'avatar1' },
    { id: 'S002', name: 'Bob Williams', major: 'Physics', avatar: 'avatar2' },
    { id: 'S003', name: 'Charlie Brown', major: 'Business Administration', avatar: 'avatar3' },
    { id: 'S004', name: 'Diana Miller', major: 'Computer Science', avatar: 'avatar4' },
    { id: 'S005', name: 'Ethan Davis', major: 'Mechanical Engineering', avatar: 'avatar5' },
    { id: 'S006', name: 'Fiona Garcia', major: 'Biology', avatar: 'avatar6' },
    { id: 'S007', name: 'George Rodriguez', major: 'Physics', avatar: 'avatar7' },
    { id: 'S008', name: 'Hannah Wilson', major: 'Business Administration', avatar: 'avatar8' },
    { id: 'S009', name: 'Ian Martinez', major: 'Computer Science', avatar: 'avatar9' },
    { id: 'S010', name: 'Jane Anderson', major: 'Mechanical Engineering', avatar: 'avatar10' },
    { id: 'S011', name: 'Kevin Thomas', major: 'Biology', avatar: 'avatar11' },
    { id: 'S012', name: 'Laura Taylor', major: 'Computer Science', avatar: 'avatar12' },
    { id: 'S013', name: 'Mason Hernandez', major: 'Physics', avatar: 'avatar13' },
    { id: 'S014', name: 'Nora Moore', major: 'Business Administration', avatar: 'avatar14' },
    { id: 'S015', name: 'Oscar Lee', major: 'Mechanical Engineering', avatar: 'avatar15' },
    { id: 'S016', name: 'Penelope White', major: 'Biology', avatar: 'avatar16' },
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
      avatar: data.avatar,
    } as Student;
  });

  return studentList;
};
