"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Users,
  Zap,
  Shield,
  Clock,
  Moon,
  Sun,
  Star,
  Play,
  ChevronRight,
  Menu,
  X,
  Code,
  Palette,
  BarChart3,
  Briefcase,
  Globe,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-black dark:bg-white rounded-full opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// 3D Card component
const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    setRotateX((y - centerY) / 10)
    setRotateY((centerX - x) / 10)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`transform-gpu ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Bento Grid Item
const BentoItem = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Animated Counter
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const navigationItems = [
    { name: "Browse", href: "/browse" },
    { name: "Requests", href: "/requests" },
    { name: "Profile", href: "/profile" },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Learned Python from an amazing mentor. The skill swap was incredibly valuable and changed my career path.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Data Scientist",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Teaching React while learning ML has been an amazing experience. The community here is exceptional.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Found the perfect coding mentor through SkillSwap. The platform makes connections so easy and meaningful.",
      rating: 5,
    },
  ]

  const skillCategories = [
    { name: "Web Development", count: "2.5K+", icon: Code, description: "Frontend, Backend, Full-stack" },
    { name: "Design", count: "1.8K+", icon: Palette, description: "UI/UX, Graphics, Branding" },
    { name: "Data Science", count: "1.2K+", icon: BarChart3, description: "Analytics, ML, Statistics" },
    { name: "Business", count: "900+", icon: Briefcase, description: "Strategy, Finance, Marketing" },
    { name: "Languages", count: "750+", icon: Globe, description: "English, Spanish, Mandarin" },
    { name: "Education", count: "650+", icon: BookOpen, description: "Teaching, Tutoring, Training" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden font-mono">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-white dark:bg-black" />
        <FloatingParticles />
        <motion.div className="absolute inset-0 opacity-5" style={{ y }}>
          <div className="absolute top-20 left-20 w-96 h-96 bg-black dark:bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-black dark:bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-40 w-96 h-96 bg-black dark:bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </motion.div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="text-2xl font-bold tracking-tight">
                SKILLSWAP
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  >
                    {item.name.toUpperCase()}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </motion.div>

              {isLoggedIn ? (
                <div className="hidden lg:flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link href="/browse">
                      <Button variant="ghost" className="font-mono text-sm tracking-wide">
                        BROWSE
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Link href="/profile">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/login">
                      <Button variant="ghost" className="font-mono text-sm tracking-wide">
                        SIGN IN
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup">
                      <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-mono text-sm tracking-wide">
                        GET STARTED
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            className={`lg:hidden overflow-hidden ${mobileMenuOpen ? "max-h-96" : "max-h-0"}`}
            initial={false}
            animate={{ height: mobileMenuOpen ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 space-y-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm font-medium tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full font-mono text-sm tracking-wide">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-mono text-sm tracking-wide">
                    GET STARTED
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <motion.div className="max-w-6xl mx-auto text-center" style={{ opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-full px-6 py-3 mb-8 border border-gray-200 dark:border-gray-800"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium tracking-wide">JOIN 10,000+ SKILL SWAPPERS WORLDWIDE</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tighter">
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                TRADE SKILLS,
              </motion.span>
              <motion.span
                className="block text-gray-500 dark:text-gray-500"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                NOT MONEY
              </motion.span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Offer what you know. Learn what you want. Connect with people who have complementary skills in our global
              community of knowledge exchange.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-mono tracking-wide"
                  >
                    START SWAPPING SKILLS
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 border-black dark:border-white font-mono tracking-wide bg-transparent"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    WATCH DEMO
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {[
              { label: "ACTIVE USERS", value: 10000, suffix: "+" },
              { label: "SKILLS", value: 500, suffix: "+" },
              { label: "SWAPS", value: 25000, suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-bold tracking-tight">
                  <AnimatedCounter end={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-500 tracking-wide font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">EXPLORE SKILLS BY CATEGORY</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wide">
              DISCOVER THOUSANDS OF SKILLS ACROSS DIVERSE DOMAINS
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <BentoItem key={category.name} delay={index * 0.1}>
                <Card3D className="h-full">
                  <Card className="h-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300">
                    <CardContent className="p-8 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-16 h-16 border-2 border-black dark:border-white rounded-lg flex items-center justify-center mb-6">
                          <category.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 tracking-tight">{category.name.toUpperCase()}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 tracking-wide">
                          {category.description.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold tracking-tight">{category.count}</span>
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              </BentoItem>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">HOW IT WORKS</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wide">
              START YOUR SKILL-SWAPPING JOURNEY IN FOUR SIMPLE STEPS
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "LIST YOUR SKILLS",
                description: "What can you teach? What do you want to learn?",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "FIND MATCHES",
                description: "Browse people with complementary skills",
                icon: Users,
              },
              {
                step: "03",
                title: "CONNECT & SCHEDULE",
                description: "Send requests and schedule your skill swap",
                icon: Clock,
              },
              {
                step: "04",
                title: "LEARN & TEACH",
                description: "Exchange knowledge and grow together",
                icon: Zap,
              },
            ].map((item, index) => (
              <BentoItem key={item.step} delay={index * 0.2}>
                <Card3D>
                  <div className="text-center p-8 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-black dark:hover:border-white transition-all duration-300 h-full">
                    <div className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4 tracking-tighter">
                      {item.step}
                    </div>
                    <motion.div
                      className="w-16 h-16 border-2 border-black dark:border-white rounded-lg flex items-center justify-center mx-auto mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-wide">
                      {item.description.toUpperCase()}
                    </p>
                  </div>
                </Card3D>
              </BentoItem>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Bento Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">WHAT OUR COMMUNITY SAYS</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wide">
              REAL STORIES FROM SKILL SWAPPERS AROUND THE WORLD
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <BentoItem key={testimonial.name} delay={index * 0.1}>
                <Card3D>
                  <Card className="h-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-800">
                          <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="font-bold">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold tracking-tight">{testimonial.name.toUpperCase()}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                            {testimonial.role.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-black dark:fill-white" />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                </Card3D>
              </BentoItem>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative z-10 py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter">WHY CHOOSE SKILLSWAP?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 tracking-wide">
              THE MOST TRUSTED PLATFORM FOR SKILL EXCHANGE
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "100% FREE",
                description: "No payments, just skill exchanges",
              },
              {
                icon: Users,
                title: "GLOBAL COMMUNITY",
                description: "Connect with learners worldwide",
              },
              {
                icon: Shield,
                title: "VERIFIED PROFILES",
                description: "Ratings and reviews for trust",
              },
              {
                icon: Clock,
                title: "FLEXIBLE SCHEDULE",
                description: "Learn on your own time",
              },
            ].map((feature, index) => (
              <BentoItem key={feature.title} delay={index * 0.1}>
                <Card3D>
                  <div className="text-center p-8 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-black dark:hover:border-white transition-all duration-300 h-full">
                    <motion.div
                      className="w-16 h-16 border-2 border-black dark:border-white rounded-lg flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-wide">
                      {feature.description.toUpperCase()}
                    </p>
                  </div>
                </Card3D>
              </BentoItem>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-black dark:bg-white text-white dark:text-black">
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            READY TO START LEARNING?
          </motion.h2>
          <motion.p
            className="text-xl mb-12 opacity-80 tracking-wide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            JOIN THOUSANDS WHO ARE ALREADY TRADING SKILLS AND GROWING TOGETHER.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-mono tracking-wide"
              >
                CREATE YOUR PROFILE
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h4 className="font-bold mb-4 tracking-wide">PLATFORM</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/browse"
                  className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors tracking-wide"
                >
                  BROWSE SKILLS
                </Link>
                <Link
                  href="/how-it-works"
                  className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors tracking-wide"
                >
                  HOW IT WORKS
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 tracking-wide">SUPPORT</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/help"
                  className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors tracking-wide"
                >
                  HELP CENTER
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors tracking-wide"
                >
                  CONTACT
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 tracking-wide">LEGAL</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/privacy"
                  className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors tracking-wide"
                >
                  PRIVACY
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors tracking-wide"
                >
                  TERMS
                </Link>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-4 tracking-tight">SKILLSWAP</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">TRADE SKILLS, NOT MONEY.</p>
            </div>
          </motion.div>
          <motion.div
            className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="tracking-wide">&copy; 2024 SKILLSWAP. ALL RIGHTS RESERVED.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
