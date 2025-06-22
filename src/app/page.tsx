"use client"

import { useEffect, useMemo, useState } from "react"
import { getStudents } from "@/lib/firebase"
import type { Student } from "@/types/student"
import { Input } from "@/components/ui/input"
import { StudentCard, StudentCardSkeleton } from "@/components/student-card"
import { Icons } from "@/components/icons"
import { Search } from 'lucide-react'

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const studentData = await getStudents()
        setStudents(studentData)
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const filteredStudents = useMemo(() => {
    return students
      .filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [students, searchQuery])

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or ID..."
              className="pl-10 h-10 w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search students"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <StudentCardSkeleton key={i} />)}
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-50 duration-500">
            {filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} />
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
