"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Check, X, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"

// Mock data for swap requests
const mockRequests = [
  {
    id: 1,
    type: "received",
    user: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    skillOffered: "Python",
    skillWanted: "React",
    status: "pending",
    message:
      "Hi! I'd love to learn React from you. I have 3 years of Python experience and can help you with data science projects.",
    date: "2 hours ago",
  },
  {
    id: 2,
    type: "sent",
    user: {
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    skillOffered: "UI/UX Design",
    skillWanted: "Figma",
    status: "accepted",
    message: "Looking forward to learning Figma from you!",
    date: "1 day ago",
  },
  {
    id: 3,
    type: "received",
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    skillOffered: "Node.js",
    skillWanted: "TypeScript",
    status: "rejected",
    message: "I can help you with backend development using Node.js.",
    date: "3 days ago",
  },
  {
    id: 4,
    type: "sent",
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    skillOffered: "React",
    skillWanted: "Machine Learning",
    status: "pending",
    message: "Hi Sarah! I'd love to learn ML basics from you.",
    date: "5 days ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted":
      return <Check className="h-3 w-3" />
    case "rejected":
      return <X className="h-3 w-3" />
    case "pending":
      return <Clock className="h-3 w-3" />
    default:
      return null
  }
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const handleAccept = (requestId: number) => {
    console.log("Accepting request:", requestId)
  }

  const handleReject = (requestId: number) => {
    console.log("Rejecting request:", requestId)
  }

  const filteredRequests = mockRequests.filter((request) => {
    if (activeTab === "all") return true
    if (activeTab === "received") return request.type === "received"
    if (activeTab === "sent") return request.type === "sent"
    return true
  })

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
              <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swap Requests</h1>
          <p className="text-muted-foreground">Manage your skill exchange requests</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                  <p className="text-muted-foreground text-center">
                    {activeTab === "received"
                      ? "You haven't received any swap requests yet."
                      : activeTab === "sent"
                        ? "You haven't sent any swap requests yet."
                        : "You don't have any swap requests yet."}
                  </p>
                  <Link href="/" className="mt-4">
                    <Button>Browse Profiles</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {filteredRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {request.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{request.user.name}</h3>
                            <p className="text-sm text-muted-foreground">{request.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`${getStatusColor(request.status)} border-0`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                          {request.type === "received" && (
                            <Badge variant="outline" className="text-xs">
                              Received
                            </Badge>
                          )}
                          {request.type === "sent" && (
                            <Badge variant="outline" className="text-xs">
                              Sent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Skill Exchange Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">
                            {request.type === "received" ? "They offer" : "You offer"}
                          </p>
                          <Badge variant="secondary">{request.skillOffered}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            {request.type === "received" ? "They want" : "You want"}
                          </p>
                          <Badge variant="outline">{request.skillWanted}</Badge>
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm">{request.message}</p>
                        </div>
                      )}

                      {/* Actions */}
                      {request.type === "received" && request.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={() => handleAccept(request.id)} className="flex-1">
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request.id)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}

                      {request.status === "accepted" && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Start Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
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
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
