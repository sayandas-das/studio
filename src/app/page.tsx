"use client"

import { useEffect, useMemo, useState } from "react"
import { getStudents } from "@/lib/firebase"
import type { Student } from "@/types/student"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentCard, StudentCardSkeleton } from "@/components/student-card"
import { Icons } from "@/components/icons"
import { Search, Filter, SortAsc } from 'lucide-react'

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

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

  const uniqueMajors = useMemo(() => {
    const majors = new Set(students.map(s => s.major))
    return ["all", ...Array.from(majors).sort()]
  }, [students])

  const uniqueYears = useMemo(() => {
    const years = new Set(students.map(s => s.year))
    return ["all", ...Array.from(years).sort((a,b) => a-b).map(String)]
  }, [students])

  const filteredAndSortedStudents = useMemo(() => {
    let result = students
      .filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(student => majorFilter === "all" || student.major === majorFilter)
      .filter(student => yearFilter === "all" || student.year === parseInt(yearFilter))

    const [sortKey, sortDirection] = sortBy.split('-') as [keyof Student | 'name' | 'gpa' | 'year', 'asc' | 'desc'];

    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      let comparison = 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result
  }, [students, searchQuery, majorFilter, yearFilter, sortBy])

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-10 h-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search students"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
              <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger aria-label="Filter by major" className="h-10">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
                  <SelectValue placeholder="Filter by Major" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueMajors.map(major => (
                    <SelectItem key={major} value={major}>
                      {major === 'all' ? 'All Majors' : major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger aria-label="Filter by year" className="h-10">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
                  <SelectValue placeholder="Filter by Year" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year === 'all' ? 'All Years' : `Year ${year}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="lg:col-span-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger aria-label="Sort by" className="h-10">
                  <SortAsc className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="gpa-desc">GPA (High to Low)</SelectItem>
                  <SelectItem value="gpa-asc">GPA (Low to High)</SelectItem>
                  <SelectItem value="year-desc">Year (Senior to Freshman)</SelectItem>
                  <SelectItem value="year-asc">Year (Freshman to Senior)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <StudentCardSkeleton key={i} />)}
          </div>
        ) : filteredAndSortedStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-50 duration-500">
            {filteredAndSortedStudents.map(student => (
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
