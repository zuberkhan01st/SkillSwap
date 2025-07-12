"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Star, Moon, Sun, Menu } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for user profiles
const mockProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["React", "TypeScript", "UI/UX Design"],
    skillsWanted: ["Python", "Machine Learning"],
    rating: 4.8,
    availability: "Weekends",
    isPublic: true,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["Python", "Data Science", "SQL"],
    skillsWanted: ["React", "Frontend Development"],
    rating: 4.9,
    availability: "Evenings",
    isPublic: true,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["Graphic Design", "Figma", "Branding"],
    skillsWanted: ["Web Development", "JavaScript"],
    rating: 4.7,
    availability: "Weekends",
    isPublic: true,
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["Node.js", "MongoDB", "DevOps"],
    skillsWanted: ["Mobile Development", "Flutter"],
    rating: 4.6,
    availability: "Evenings",
    isPublic: true,
  },
  {
    id: 5,
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["Flutter", "Mobile Development", "Dart"],
    skillsWanted: ["Backend Development", "AWS"],
    rating: 4.8,
    availability: "Flexible",
    isPublic: true,
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["AWS", "Cloud Architecture", "Docker"],
    skillsWanted: ["Frontend Frameworks", "Vue.js"],
    rating: 4.9,
    availability: "Weekdays",
    isPublic: true,
  },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sortBy, setSortBy] = useState("rating")
  const [filterBy, setFilterBy] = useState("all")
  const { theme, setTheme } = useTheme()

  const filteredProfiles = mockProfiles.filter(
    (profile) =>
      profile.skillsOffered.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.skillsWanted.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const Navigation = () => (
    <nav className="flex items-center gap-4">
      <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
        Home
      </Link>
      <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
        Profile
      </Link>
      <Link href="/requests" className="text-sm font-medium hover:text-primary transition-colors">
        Requests
      </Link>
    </nav>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                SkillSwap
              </Link>
              <div className="hidden md:block">
                <Navigation />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Actions */}
              {isLoggedIn ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    <Navigation />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Skills & Connect</h1>
          <p className="text-muted-foreground">Discover talented individuals ready to share their knowledge</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by skill or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="recent">Recently Joined</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProfiles.length} of {mockProfiles.length} profiles
          </p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{profile.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{profile.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Skills Offered</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsOffered.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Skills Wanted</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">{profile.availability}</span>
                  <Link href={`/profile/${profile.id}`}>
                    <Button size="sm" disabled={!isLoggedIn} className="disabled:opacity-50">
                      {isLoggedIn ? "Connect" : "Login to Connect"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setCurrentPage(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </div>
  )
}
