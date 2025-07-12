"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock data
const currentUser = {
  skillsOffered: ["React", "TypeScript", "UI/UX Design", "Node.js"],
}

const targetUser = {
  id: 1,
  name: "Sarah Chen",
  avatar: "/placeholder.svg?height=60&width=60",
  skillsWanted: ["Python", "Machine Learning", "Data Science", "AWS"],
}

export default function SwapRequestPage() {
  const [selectedMySkill, setSelectedMySkill] = useState("")
  const [selectedTheirSkill, setSelectedTheirSkill] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const params = useParams()
  const router = useRouter()
  const userId = params.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMySkill || !selectedTheirSkill) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/requests")
    }, 1000)
  }

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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href={`/profile/${userId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Request Skill Swap</h1>
          <p className="text-muted-foreground">Send a skill swap request to connect and learn together</p>
        </div>

        {/* Target User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Requesting swap with</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={targetUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {targetUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{targetUser.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {targetUser.skillsWanted.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {targetUser.skillsWanted.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{targetUser.skillsWanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swap Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Exchange Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Skill */}
              <div className="space-y-2">
                <Label htmlFor="my-skill">Choose one of your skills to offer</Label>
                <Select value={selectedMySkill} onValueChange={setSelectedMySkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill you can teach" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser.skillsOffered.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Their Skill */}
              <div className="space-y-2">
                <Label htmlFor="their-skill">Choose one of their skills you want to learn</Label>
                <Select value={selectedTheirSkill} onValueChange={setSelectedTheirSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill you want to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetUser.skillsWanted.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and explain what you'd like to learn or teach..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  A personalized message increases your chances of getting a positive response
                </p>
              </div>

              {/* Preview */}
              {selectedMySkill && selectedTheirSkill && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">Swap Summary</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">You'll teach:</span>{" "}
                      <Badge variant="secondary" className="ml-1">
                        {selectedMySkill}
                      </Badge>
                    </p>
                    <p>
                      <span className="text-muted-foreground">You'll learn:</span>{" "}
                      <Badge variant="outline" className="ml-1">
                        {selectedTheirSkill}
                      </Badge>
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!selectedMySkill || !selectedTheirSkill || isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
                <Link href={`/profile/${userId}`}>
                  <Button variant="outline" className="px-8 bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
