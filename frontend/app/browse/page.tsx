"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Moon, Sun, MapPin, Clock, Filter } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

// Enhanced mock data with domain categorization
const mockProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "San Francisco, CA, USA",
    skillsOffered: ["React", "TypeScript", "UI/UX Design", "Next.js"],
    skillsWanted: ["Python", "Machine Learning", "Data Science"],
    rating: 4.8,
    reviewCount: 24,
    availability: "Weekends",
    isOnline: true,
    completedSwaps: 12,
    joinedDate: "2023-01-15",
    domains: ["Web & App Development", "Design & Creativity"],
  },
  {
    id: 2,
    name: "Marcus Johnson",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "New York, NY, USA",
    skillsOffered: ["Python", "Data Science", "SQL", "Machine Learning"],
    skillsWanted: ["React", "Frontend Development", "UI/UX Design"],
    rating: 4.9,
    reviewCount: 31,
    availability: "Evenings",
    isOnline: false,
    completedSwaps: 18,
    joinedDate: "2023-02-20",
    domains: ["Data Science & Analytics", "Machine Learning & AI"],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Barcelona, Spain",
    skillsOffered: ["Graphic Design", "Figma", "Branding", "Adobe Creative Suite"],
    skillsWanted: ["Web Development", "JavaScript", "React"],
    rating: 4.7,
    reviewCount: 19,
    availability: "Weekends",
    isOnline: true,
    completedSwaps: 8,
    joinedDate: "2023-03-10",
    domains: ["Design & Creativity", "Marketing & SEO"],
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Seoul, South Korea",
    skillsOffered: ["Node.js", "MongoDB", "DevOps", "AWS"],
    skillsWanted: ["Mobile Development", "Flutter", "React Native"],
    rating: 4.6,
    reviewCount: 15,
    availability: "Evenings",
    isOnline: true,
    completedSwaps: 6,
    joinedDate: "2023-04-05",
    domains: ["Web & App Development", "Cybersecurity & Cloud"],
  },
  {
    id: 5,
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Toronto, Canada",
    skillsOffered: ["Flutter", "Mobile Development", "Dart", "iOS Development"],
    skillsWanted: ["Backend Development", "AWS", "Docker"],
    rating: 4.8,
    reviewCount: 22,
    availability: "Flexible",
    isOnline: true,
    completedSwaps: 14,
    joinedDate: "2023-01-28",
    domains: ["Web & App Development"],
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Dubai, UAE",
    skillsOffered: ["AWS", "Cloud Architecture", "Docker", "Kubernetes"],
    skillsWanted: ["Frontend Frameworks", "Vue.js", "React"],
    rating: 4.9,
    reviewCount: 27,
    availability: "Weekdays",
    isOnline: false,
    completedSwaps: 20,
    joinedDate: "2022-12-15",
    domains: ["Cybersecurity & Cloud", "Web & App Development"],
  },
  {
    id: 7,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Mumbai, India",
    skillsOffered: ["Digital Marketing", "SEO", "Content Strategy", "Social Media"],
    skillsWanted: ["Web Analytics", "Python", "Data Analysis"],
    rating: 4.7,
    reviewCount: 18,
    availability: "Evenings",
    isOnline: true,
    completedSwaps: 9,
    joinedDate: "2023-05-12",
    domains: ["Marketing & SEO", "Content Creation"],
  },
  {
    id: 8,
    name: "Carlos Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Mexico City, Mexico",
    skillsOffered: ["Mechanical Engineering", "CAD Design", "3D Modeling", "AutoCAD"],
    skillsWanted: ["Programming", "Arduino", "IoT Development"],
    rating: 4.5,
    reviewCount: 12,
    availability: "Weekends",
    isOnline: false,
    completedSwaps: 5,
    joinedDate: "2023-06-08",
    domains: ["Engineering", "Robotics & IoT"],
  },
  {
    id: 9,
    name: "Emma Thompson",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "London, UK",
    skillsOffered: ["Content Writing", "Copywriting", "Blog Writing", "Technical Writing"],
    skillsWanted: ["Video Editing", "Graphic Design", "Social Media Marketing"],
    rating: 4.8,
    reviewCount: 25,
    availability: "Flexible",
    isOnline: true,
    completedSwaps: 16,
    joinedDate: "2023-02-14",
    domains: ["Content Creation", "Marketing & SEO"],
  },
  {
    id: 10,
    name: "Raj Patel",
    avatar: "/placeholder.svg?height=60&width=60",
    location: "Bangalore, India",
    skillsOffered: ["Blockchain Development", "Solidity", "Smart Contracts", "Web3"],
    skillsWanted: ["Mobile Development", "React Native", "UI/UX Design"],
    rating: 4.6,
    reviewCount: 14,
    availability: "Evenings",
    isOnline: true,
    completedSwaps: 7,
    joinedDate: "2023-07-20",
    domains: ["Blockchain & Web3", "Web & App Development"],
  },
]

// Domain categories for filtering
const domainCategories = [
  "All Domains",
  "Web & App Development",
  "Machine Learning & AI",
  "Data Science & Analytics",
  "Electronics & Embedded Systems",
  "Engineering",
  "Finance & Business",
  "Design & Creativity",
  "Marketing & SEO",
  "Education & Tutoring",
  "Health & Wellness",
  "Robotics & IoT",
  "Blockchain & Web3",
  "Cybersecurity & Cloud",
  "Content Creation",
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Assuming logged in for demo
  const [sortBy, setSortBy] = useState("rating")
  const [filterBy, setFilterBy] = useState("All Domains")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter profiles based on search query and domain filter
  const filteredProfiles = mockProfiles.filter((profile) => {
    const matchesSearch =
      profile.skillsOffered.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.skillsWanted.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDomain = filterBy === "All Domains" || profile.domains.includes(filterBy)

    return matchesSearch && matchesDomain
  })

  // Sort profiles based on selected criteria
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "swaps":
        return b.completedSwaps - a.completedSwaps
      case "online":
        return b.isOnline === a.isOnline ? 0 : b.isOnline ? -1 : 1
      case "recent":
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              SkillSwap
            </Link>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Link href="/requests">
                <Button variant="ghost">Requests</Button>
              </Link>
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Learning Partner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with {mockProfiles.length} skilled individuals ready to trade knowledge
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by skill, name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="swaps">Most Swaps</SelectItem>
                <SelectItem value="online">Online Now</SelectItem>
                <SelectItem value="recent">Recently Joined</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-64 h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by domain" />
              </SelectTrigger>
              <SelectContent>
                {domainCategories.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {sortedProfiles.length} of {mockProfiles.length} profiles
            {filterBy !== "All Domains" && (
              <span className="ml-2">
                in{" "}
                <Badge variant="outline" className="ml-1">
                  {filterBy}
                </Badge>
              </span>
            )}
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {sortedProfiles.map((profile) => (
            <div
              key={profile.id}
              className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg"
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {profile.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{profile.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">{profile.reviewCount} reviews</div>
                </div>
              </div>

              {/* Domain Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {profile.domains.slice(0, 2).map((domain, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-900">
                      {domain}
                    </Badge>
                  ))}
                  {profile.domains.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-900">
                      +{profile.domains.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Can Teach</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsOffered.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skillsOffered.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{profile.skillsOffered.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Wants to Learn</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsWanted.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skillsWanted.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.skillsWanted.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {profile.availability}
                </div>
                <div>{profile.completedSwaps} swaps completed</div>
              </div>

              {/* Action Button */}
              <Link href={`/profile/${profile.id}`}>
                <Button className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                  View Profile & Connect
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedProfiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search terms or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterBy("All Domains")
              }}
              className="bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedProfiles.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Load More Profiles
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
