import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import type { Student } from '@/types/student';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCrHTP46mpp3sKK8d67mv0hcUjuftsqlXI",
  authDomain: "test-6f5b7.firebaseapp.com",
  projectId: "test-6f5b7",
  storageBucket: "test-6f5b7.firebasestorage.app",
  messagingSenderId: "296078221097",
  appId: "1:296078221097:web:06394da521064a12676138",
  measurementId: "G-6HKDFDE8Z8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seed database if it's empty
const seedDatabase = async (): Promise<Student[]> => {
  const studentsToSeed: Student[] = [
    { id: 'S001', name: 'Alice Johnson', class: 'Grade 12', avatar: 'avatar1' },
    { id: 'S002', name: 'Bob Williams', class: 'Grade 11', avatar: 'avatar2' },
    { id: 'S003', name: 'Charlie Brown', class: 'Grade 10', avatar: 'avatar3' },
    { id: 'S004', name: 'Diana Miller', class: 'Grade 12', avatar: 'avatar4' },
    { id: 'S005', name: 'Ethan Davis', class: 'Grade 9', avatar: 'avatar5' },
    { id: 'S006', name: 'Fiona Garcia', class: 'Grade 11', avatar: 'avatar6' },
    { id: 'S007', name: 'George Rodriguez', class: 'Grade 10', avatar: 'avatar7' },
    { id: 'S008', name: 'Hannah Wilson', class: 'Grade 12', avatar: 'avatar8' },
    { id: 'S009', name: 'Ian Martinez', class: 'Grade 9', avatar: 'avatar9' },
    { id: 'S010', name: 'Jane Anderson', class: 'Grade 11', avatar: 'avatar10' },
    { id: 'S011', name: 'Kevin Thomas', class: 'Grade 10', avatar: 'avatar11' },
    { id: 'S012', name: 'Laura Taylor', class: 'Grade 12', avatar: 'avatar12' },
    { id: 'S013', name: 'Mason Hernandez', class: 'Grade 9', avatar: 'avatar13' },
    { id: 'S014', name: 'Nora Moore', class: 'Grade 11', avatar: 'avatar14' },
    { id: 'S015', name: 'Oscar Lee', class: 'Grade 10', avatar: 'avatar15' },
    { id: 'S016', name: 'Penelope White', class: 'Grade 12', avatar: 'avatar16' },
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
      class: data.class,
      avatar: data.avatar,
    } as Student;
  });

  return studentList;
};

export const addStudent = async (student: { name: string; class: string }): Promise<Student> => {
  const studentData = {
    ...student,
    avatar: `avatar${Math.floor(Math.random() * 16) + 1}`,
  };
  const docRef = await addDoc(collection(db, 'students'), studentData);
  return {
    id: docRef.id,
    ...studentData,
  };
};
