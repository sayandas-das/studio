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

export const getStudents = async (): Promise<Student[]> => {
  const studentsCol = collection(db, 'students');
  const studentSnapshot = await getDocs(studentsCol);
  
  if (studentSnapshot.empty) {
    console.log("No students found.");
    return [];
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
