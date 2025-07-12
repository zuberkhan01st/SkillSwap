"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock user data
const mockUser = {
  id: 1,
  name: "Sarah Chen",
  location: "New York, NY",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Full-stack developer with 5 years of experience. Passionate about creating beautiful and functional web applications. Always eager to learn new technologies and share knowledge with others.",
  skillsOffered: ["React", "TypeScript", "UI/UX Design", "Node.js", "GraphQL"],
  skillsWanted: ["Python", "Machine Learning", "Data Science", "AWS"],
  rating: 4.8,
  totalReviews: 24,
  availability: "Weekends",
  joinedDate: "January 2023",
  completedSwaps: 12,
}

const reviews = [
  {
    id: 1,
    reviewer: "Marcus Johnson",
    rating: 5,
    comment: "Sarah is an excellent teacher! She helped me understand React concepts very clearly.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    reviewer: "Elena Rodriguez",
    rating: 5,
    comment: "Great experience learning TypeScript from Sarah. Very patient and knowledgeable.",
    date: "1 month ago",
  },
  {
    id: 3,
    reviewer: "David Kim",
    rating: 4,
    comment: "Learned a lot about UI/UX principles. Sarah has great design insights.",
    date: "2 months ago",
  },
]

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              SkillSwap
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/requests" className="text-sm font-medium hover:text-primary transition-colors">
                Requests
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profiles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {mockUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{mockUser.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockUser.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {mockUser.availability}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mockUser.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({mockUser.totalReviews} reviews)</span>
                      <span className="text-sm text-muted-foreground">• {mockUser.completedSwaps} swaps completed</span>
                    </div>
                    <p className="text-muted-foreground">{mockUser.bio}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Offered */}
                <div>
                  <h3 className="font-semibold mb-3">Skills Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUser.skillsOffered.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h3 className="font-semibold mb-3">Skills Wanted</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUser.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Reviews & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.reviewer}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Swap Card */}
            <Card>
              <CardHeader>
                <CardTitle>Request a Skill Swap</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/request/${userId}`}>
                  <Button className="w-full">Send Swap Request</Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Choose skills to exchange and send a personalized message
                </p>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm font-medium">{mockUser.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed swaps</span>
                  <span className="text-sm font-medium">{mockUser.completedSwaps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average rating</span>
                  <span className="text-sm font-medium">{mockUser.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Response rate</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
