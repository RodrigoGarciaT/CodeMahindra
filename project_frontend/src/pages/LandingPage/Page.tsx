import type React from "react"

import { Link } from "react-router-dom"
import { ArrowRight, ChevronLeft, ChevronRight, LogIn } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const getImage = (name: string) =>
  new URL(`../../images/${name}`, import.meta.url).href;

// Custom hook for scroll animations
function useElementOnScreen(options: IntersectionObserverInit) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      setIsVisible(entry.isIntersecting)
    }, options)

    const currentRef = containerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options])

  return [containerRef, isVisible] as const
}

export default function LandingPage() {
  // Refs for scroll animations
  const [sobreRef, sobreVisible] = useElementOnScreen({ threshold: 0.2 })
  const [beneficiosRef, beneficiosVisible] = useElementOnScreen({ threshold: 0.2 })
  const [funcionaRef, funcionaVisible] = useElementOnScreen({ threshold: 0.2 })
  const [caracteristicasRef, caracteristicasVisible] = useElementOnScreen({ threshold: 0.2 })

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle hash links on page load (for direct URLs with hash)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [])

  // Image carousel state and functions
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayedImageIndex, setDisplayedImageIndex] = useState(0)

  // Array of images for the carousel
  const carouselImages = [
      "laptop.png",
      "Laptop2.png",
      "Laptop3.png",
      "fondo.jpg"
  ]

  const goToNextImage = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    // First fade out current image
    setTimeout(() => {
      // After fade out, update the target index
      setCurrentImageIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))

      // Wait a bit before starting fade in
      setTimeout(() => {
        // Update displayed image to match target
        setDisplayedImageIndex(currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1)
        // Allow fade in
        setIsTransitioning(false)
      }, 50)
    }, 300) // This should match half the transition duration
  }

  const goToPrevImage = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    // First fade out current image
    setTimeout(() => {
      // After fade out, update the target index
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1))

      // Wait a bit before starting fade in
      setTimeout(() => {
        // Update displayed image to match target
        setDisplayedImageIndex(currentImageIndex === 0 ? carouselImages.length - 1 : currentImageIndex - 1)
        // Allow fade in
        setIsTransitioning(false)
      }, 50)
    }, 300) // This should match half the transition duration
  }

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return
    setIsTransitioning(true)

    // First fade out current image
    setTimeout(() => {
      // After fade out, update the target index
      setCurrentImageIndex(index)

      // Wait a bit before starting fade in
      setTimeout(() => {
        // Update displayed image to match target
        setDisplayedImageIndex(index)
        // Allow fade in
        setIsTransitioning(false)
      }, 50)
    }, 300) // This should match half the transition duration
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo + Texto */}
          <Link to="/" className="flex items-center space-x-2 h-full">
            <img
              src="/logo-codemahindra.png"
              alt="Logo"
              className="h-full w-auto object-contain"
            />
            <span className="text-xl font-bold text-gray-900">
              <span className="text-gray-700">Code</span>
              <span className="text-red-600">Mahindra</span>
            </span>
          </Link>
          {/* Menú de navegación */}
          <nav className="hidden md:flex space-x-6">
            {[
              { href: "#about", label: "📘 About" },
              { href: "#benefits", label: "🎯 Benefits" },
              { href: "#how-it-works", label: "⚙️ How it works" },
              { href: "#features", label: "💡 Features" }
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                onClick={scrollToSection(href.replace("#", ""))}
                className="text-gray-700 hover:text-red-600 transition relative group font-medium"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          <Link
            to="/login"
            className="ml-4 px-4 py-1.5 rounded-full text-sm font-semibold text-red-600 hover:text-white hover:bg-red-600 transition border border-red-600 inline-flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* Hero Section */ }
        <section className="relative w-full h-full md:h-[80vh] text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('/fondo.jpg')] bg-cover bg-center bg-fixed"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 z-0"
            style={{
              background: `radial-gradient(
                circle at 85% center,
                rgba(0, 0, 0, 0.9) 0%,
                rgba(0, 0, 0, 0.8) 30%,
                rgba(30, 30, 30, 0.7) 60%,
                rgba(42, 42, 42, 0.6) 100%
              )`,
            }}
          />

          <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between h-full max-w-6xl mx-auto px-6">
  
            <motion.img
              src={getImage("CodeBox.png")}
              alt="Ilustración de programación"
              initial={{ y: 0 }}
              animate={{ y: -12 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
              className="max-w-xs md:max-w-sm drop-shadow-lg"
            />

            <div className="w-full h-full flex flex-col justify-center items-center text-center px-4 mt-10 md:mt-0">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg mb-6">
                A new era for <span className="text-yellow-400">developers</span> has begun
              </h1>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                CodeMahindra turns every line of code into progress: solve real challenges, analyze your commits with AI, get automated feedback, complete tasks, earn rewards, and level up in a fully gamified experience.
              </p>
              <motion.a
                href="/login"
                className="inline-flex items-center gap-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg shadow-red-500/50"
                whileHover={{
                  scale: 1.07,
                  rotateX: -3,
                  rotateY: 3,
                  boxShadow: "0px 10px 25px rgba(255, 193, 7, 0.35)",
                  transition: { type: "spring", stiffness: 150, damping: 12 },
                }}
                whileTap={{
                  scale: 0.95,
                  rotateX: 0,
                  rotateY: 0,
                  boxShadow: "0px 6px 12px rgba(255, 193, 7, 0.2)",
                }}
              >
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.a>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 w-full h-3 bg-red-500"
            style={{
              transform: "skewY(8deg)",
              transformOrigin: "top right",
            }}
          />
        </section>

        {/* Fill Section*/}
        <section className="relative w-full bg-white">
          <div
            className="absolute top-0 left-0 w-full h-80 bg-white z-0"
            style={{
              transform: "skewY(8deg)",
              transformOrigin: "bottom right",
            }}
          />
        </section>

        {/* About Section */}
        <div className="overflow-hidden">
          <section id="about" className="py-20 bg-white overflow-hidden md:px-52" ref={sobreRef}>
            <div
              className={`container mx-auto px-4 transition-all duration-1000 transform ${sobreVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h2 className="text-4xl md:text-2xl font-extrabold text-gray-800 text-center">
                        📘 About
                      </h2>
                    </div>
                    <div className="w-24 h-1 bg-red-600 mx-auto rounded mb-12" />
                    <p className="text-gray-700 max-w-lg text-center mx-auto leading-relaxed">
                      CodeMahindra is a full-stack platform designed to accelerate your growth as a developer.  
                      It analyzes your contributions using AI, delivers line-by-line feedback, recommends tailored resources like videos, articles, and websites, and guides your progress through a technical roadmap.  
                      All within a gamified experience featuring real-world rewards, an active community, and integrations with tools like GitHub and Jira.
                    </p>
                  </div>
                <div className="md:w-1/2 flex md:justify-end justify-center">
                  <div className="relative w-[60%] h-auto animate-float animation-delay-300">
                    <img
                      src={getImage("gamification.png")}
                      alt="Programming illustration"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="relative w-full overflow-hidden py-20" ref={beneficiosRef}>
            <div
              className="absolute inset-0 bg-[#fff5f5] z-0"
              style={{
                transform: "skewY(-8deg)",
                transformOrigin: "top right",
              }}
            />
            <div
              className={`relative z-10 container mx-auto px-4 md:px-32 transition-all duration-1000 transform ${beneficiosVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 flex justify-start mb-8 md:mb-0">
                  <div className="relative w-[60%] h-auto animate-float animation-delay-300">
                    <img
                      src={getImage("benefits.png")}
                      alt="Benefits illustration"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-4xl md:text-2xl font-extrabold text-gray-800 text-center">
                      🎯 Benefits
                    </h2>
                  </div>
                  <div className="w-24 h-1 bg-red-600 mx-auto rounded mb-12" />
                  <p className="text-gray-700 max-w-lg text-center mx-auto leading-relaxed">
                    CodeMahindra helps you grow as a developer through automated feedback on every commit and pull request, tailored learning resources, and progress tracking via interactive dashboards. Earn experience, unlock badges, complete Jira-linked tasks, collaborate with teams, and exchange your progress for real-world rewards—all within a gamified, AI-powered environment built for serious growth.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section id="how-it-works" className="py-20 bg-white overflow-hidden md:px-52" ref={funcionaRef}>
            <div
              className={`container mx-auto px-4 transition-all duration-1000 transform ${funcionaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-4xl md:text-2xl font-extrabold text-gray-800 text-center">
                    ⚙️ How it works
                  </h2>
                </div>
                <div className="w-24 h-1 bg-red-600 mx-auto rounded mb-12" />
                <p className="text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
                  In CodeMahindra, every action has purpose. Developers enhance their skills by solving real-world coding challenges, receiving automated line-by-line feedback powered by AI, and getting personalized recommendations based on their performance. As users interact—through pull requests, commits, Jira-linked tasks, or problem-solving—they earn XP, unlock achievements, and climb levels.
                  <br /><br />
                  All progress is reflected in interactive dashboards, where users can track their evolution, view detailed metrics, and visualize technical growth over time. Experience can be redeemed for real rewards or used to customize bots—virtual companions that represent your journey.
                  <br /><br />
                  Whether you’re collaborating with a team, competing in weekly rankings, exploring the learning roadmap for algorithms and data structures, or participating in community discussions, everything is designed to keep you learning, building, and growing—faster and smarter.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="relative bg-[#fff5f5] overflow-hidden py-20 md:px-52"
            ref={caracteristicasRef}
          >
            <div
              className={`container mx-auto px-6 transition-all duration-1000 transform ${
                caracteristicasVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-4xl md:text-2xl font-extrabold text-gray-800 text-center mb-2">
                💡 Features
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto rounded mb-12" />

              {/* Laptop + Carrusel */}
              <div className="flex flex-col md:flex-row items-start gap-12 justify-center">
                <div className="w-full md:w-[60%] relative">
                  {/* Laptop Fija */}
                  <div className="w-full relative">
                    <img
                      src={getImage("laptop.png")}
                      alt="Laptop"
                      className="w-full h-auto z-10 relative pointer-events-none drop-shadow-xl"
                    />

                    {/* Carrusel dentro de la pantalla */}
                    <div className="absolute top-[5.5%] left-[11%] w-[78%] h-[60%] z-0 overflow-hidden rounded-md shadow-inner">
                      <img
                        src={getImage(carouselImages[displayedImageIndex])}
                        alt={`Pantalla ${displayedImageIndex + 1}`}
                        className={`w-full h-full object-cover transition-opacity duration-700 ${
                          isTransitioning ? "opacity-0" : "opacity-100"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Controles del carrusel */}
                  <div className="flex items-center justify-center mt-3 gap-2">
                    <button
                      onClick={goToPrevImage}
                      aria-label="Anterior"
                      className="p-1.5 rounded-full border border-gray-400 hover:bg-gray-200 transition hover:scale-105 bg-white"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-700" />
                    </button>

                    <div className="flex gap-1">
                      {carouselImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? "bg-red-600 scale-125" : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={goToNextImage}
                      aria-label="Siguiente"
                      className="p-1.5 rounded-full border border-gray-400 hover:bg-gray-200 transition hover:scale-105 bg-white"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Lista de características */}
                <div className="md:w-[40%] w-full md:pl-8 mt-10 md:mt-0">
                  <ul className="space-y-4 text-gray-700 text-lg">
                    {[
                      "AI-powered feedback, commit analysis, and auto-grading",
                      "Gamification: XP, levels, badges, and real-world rewards",
                      "Learning roadmap with coding challenges and progress tracking",
                      "Custom profiles, virtual bots, and performance dashboards",
                      "Team collaboration, Jira integration, and task-based XP",
                      "Community forums, rankings, and curated learning resources"
                    ].map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start transform transition-all duration-300 hover:translate-x-1"
                      >
                        <span className="mt-1 mr-3 w-3 h-3 bg-red-600 rounded-full shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer CTA */}
      <footer className="bg-[#1a1a1a] text-white py-16 relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-2 bg-red-500 shadow-[0_4px_0_rgba(255,255,255,0.1)]" />

        <div className="container mx-auto px-6 text-center z-10 relative">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 max-w-2xl mx-auto leading-relaxed text-white">
            Ready to level up your skills? <span className="text-yellow-400">Join now</span> and start coding smarter, faster, and with real rewards.
          </h3>
          <motion.a
            href="/login"
            className="inline-flex items-center gap-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg shadow-red-500/50"
            whileHover={{
              scale: 1.07,
              rotateX: -3,
              rotateY: 3,
              boxShadow: "0px 10px 25px rgba(255, 193, 7, 0.35)",
              transition: { type: "spring", stiffness: 150, damping: 12 },
            }}
            whileTap={{
              scale: 0.95,
              rotateX: 0,
              rotateY: 0,
              boxShadow: "0px 6px 12px rgba(255, 193, 7, 0.2)",
            }}
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2"
            >
              Join Now
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.a>
        </div>
      </footer>
    </div>
  )
}