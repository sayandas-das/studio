"use client"

import { useEffect, useMemo, useState } from "react"
import { getStudents, addStudent, deleteStudent } from "@/lib/firebase"
import type { Student } from "@/types/student"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StudentCard, StudentCardSkeleton } from "@/components/student-card"
import { Icons } from "@/components/icons"
import { Search } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [newName, setNewName] = useState("")
  const [newClass, setNewClass] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const studentData = await getStudents()
        setStudents(studentData)
      } catch (error) {
        console.error("Failed to fetch students:", error)
        toast({
            title: "Error",
            description: "Failed to fetch students.",
            variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [toast])

  const filteredStudents = useMemo(() => {
    return students
      .filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.class && student.class.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  }, [students, searchQuery])

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newName.trim() || !newClass.trim()) {
        toast({
            title: "Missing Information",
            description: "Please provide both a name and a class for the student.",
            variant: "destructive"
        })
        return
    }

    setIsAdding(true)
    try {
        const newStudent = await addStudent({ name: newName, class: newClass })
        setStudents(prevStudents => [newStudent, ...prevStudents].sort((a,b) => a.name.localeCompare(b.name)))
        setNewName("")
        setNewClass("")
        toast({
            title: "Success!",
            description: `Student "${newName}" was added successfully.`
        })
    } catch (error) {
        console.error("Failed to add student:", error)
        toast({
            title: "Error",
            description: "Could not add student. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsAdding(false)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;

    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));

    try {
      await deleteStudent(id);
      toast({
        title: "Success!",
        description: `Student "${studentToDelete.name}" was deleted.`
      });
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast({
        title: "Error",
        description: `Could not delete ${studentToDelete.name}. Please try again.`,
        variant: "destructive"
      });
      setStudents(students);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Icons.Logo className="h-8 w-8 text-primary" />
          <h1 className="ml-4 text-2xl font-bold font-headline tracking-tight">Student Showcase</h1>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm sticky top-16 z-10">
            <div className="space-y-4">
                <form onSubmit={handleAddStudent} className="space-y-4">
                    <h2 className="text-lg font-medium">Add New Student</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            placeholder="Student Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            disabled={isAdding}
                            className="flex-1"
                            aria-label="New student name"
                        />
                        <Input
                            placeholder="Class"
                            value={newClass}
                            onChange={(e) => setNewClass(e.target.value)}
                            disabled={isAdding}
                            className="flex-1"
                            aria-label="New student class"
                        />
                        <Button type="submit" disabled={isAdding}>
                            {isAdding ? 'Adding...' : 'Add Student'}
                        </Button>
                    </div>
                </form>
                <Separator />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, or class..."
                      className="pl-10 h-10 w-full"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      aria-label="Search students"
                    />
                </div>
            </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <StudentCardSkeleton key={i} />)}
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-50 duration-500">
            {filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No students found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}