import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Student } from "@/types/student"
import { BookOpen, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface StudentCardProps {
  student: Student
  onDelete: (id: string) => void;
}

export function StudentCard({ student, onDelete }: StudentCardProps) {
  return (
    <Card className="hover:shadow-accent/20 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 relative">
        <Avatar className="h-16 w-16 border-2 border-primary/50">
          <Image src="https://placehold.co/128x128.png" alt={student.name} width={128} height={128} data-ai-hint="student avatar"/>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl font-headline">{student.name}</CardTitle>
          <CardDescription>{student.id}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(student.id)}
          aria-label={`Delete student ${student.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm flex-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span className="text-foreground">{student.class}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function StudentCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 flex-1">
        <Skeleton className="h-5 w-5/6 rounded-md" />
      </CardContent>
    </Card>
  )
}