"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Star, Moon, Sun, Menu, ArrowRight, Users, BookOpen, MessageCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock data for featured profiles
const featuredProfiles = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["React", "TypeScript", "UI/UX Design"],
    skillsWanted: ["Python", "Machine Learning"],
    rating: 4.8,
    availability: "Weekends",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["Python", "Data Science", "SQL"],
    skillsWanted: ["React", "Frontend Development"],
    rating: 4.9,
    availability: "Evenings",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    skillsOffered: ["Graphic Design", "Figma", "Branding"],
    skillsWanted: ["Web Development", "JavaScript"],
    rating: 4.7,
    availability: "Weekends",
  },
]

const features = [
  {
    icon: Users,
    title: "Connect with Learners",
    description: "Find people who want to learn what you know and can teach what you want to learn.",
  },
  {
    icon: BookOpen,
    title: "Skill Exchange",
    description: "Trade your expertise for new knowledge in a mutually beneficial learning experience.",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Chat directly with potential learning partners to plan your skill exchange sessions.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Verified profiles and rating system ensure quality interactions and learning experiences.",
  },
]

const howItWorks = [
  {
    step: "1",
    title: "Create Your Profile",
    description: "List the skills you can teach and what you want to learn.",
  },
  {
    step: "2",
    title: "Find Learning Partners",
    description: "Browse profiles and find people with complementary skills.",
  },
  {
    step: "3",
    title: "Send Swap Requests",
    description: "Propose skill exchanges with personalized messages.",
  },
  {
    step: "4",
    title: "Start Learning",
    description: "Connect and begin your mutual learning journey.",
  },
]

const stats = [
  { number: "10,000+", label: "Active Learners" },
  { number: "500+", label: "Skills Available" },
  { number: "25,000+", label: "Successful Swaps" },
  { number: "4.8/5", label: "Average Rating" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const Navigation = () => (
    <nav className="flex items-center gap-6">
      <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
        Features
      </Link>
      <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
        How it Works
      </Link>
      <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
        Browse Skills
      </Link>
      <Link href="/requests" className="text-sm font-medium hover:text-primary transition-colors">
        Requests
      </Link>
    </nav>
  )

  if (!mounted) {
    return null
  }

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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* User Actions */}
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      Profile
                    </Button>
                  </Link>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
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

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Learn Skills, Teach Skills, Grow Together
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with a global community of learners and teachers. Exchange your expertise for new knowledge in a
              collaborative learning environment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/browse">
              <Button size="lg" className="text-lg px-8">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SkillSwap?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes skill sharing simple, safe, and rewarding for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SkillSwap Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in just four simple steps and begin your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-6 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Community</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover talented individuals ready to share their knowledge and learn new skills.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProfiles.map((profile) => (
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
                      <Button size="sm" disabled={!isLoggedIn}>
                        {isLoggedIn ? "Connect" : "Sign In to Connect"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Browse All Profiles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners and teachers who are already growing their skills together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Explore Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
                SkillSwap
              </Link>
              <p className="text-muted-foreground">
                Connecting learners and teachers worldwide for collaborative skill development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link href="/browse" className="block text-muted-foreground hover:text-foreground">
                  Browse Skills
                </Link>
                <Link href="/how-it-works" className="block text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="/help" className="block text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
                <Link href="/community" className="block text-muted-foreground hover:text-foreground">
                  Community
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="block text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
