import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import type { Student } from '@/types/student';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let db: Firestore;

function getDb() {
  if (!db) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  }
  return db;
}

export const getStudents = async (): Promise<Student[]> => {
  const db = getDb();
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
  const db = getDb();
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

export const deleteStudent = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, "students", id));
};
