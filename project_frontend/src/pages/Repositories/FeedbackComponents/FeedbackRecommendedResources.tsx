"use client"

import { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow, Autoplay } from "swiper/modules"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExternalLink,
//  BookOpen,
  Star,
  Zap,
//  ChevronLeft,
//  ChevronRight,
  Sparkles,
  Eye,
  Heart,
  Award,
  Target,
} from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import defaultImg from "@/images/resource.png"

type Resource = {
  title: string
  image: string
  link?: string
  category?: string
  rating?: number
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
}

type Props = {
  resources: Resource[]
}

const difficultyConfig = {
  Beginner: {
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    icon: <Target className="w-3 h-3" />,
  },
  Intermediate: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    icon: <Zap className="w-3 h-3" />,
  },
  Advanced: {
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    icon: <Award className="w-3 h-3" />,
  },
}

export default function FeedbackRecommendedResources({ resources }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<any>(null)

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex)
  }

  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1, duration: 0.3 }}
      >
        <Star className={`w-3 h-3 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
      </motion.div>
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/3 to-red-500/5 rounded-3xl blur-xl"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Header */}
      {/*
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative flex items-center justify-between mb-8 px-6"
      >
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-gray-400 hover:text-white hover:border-red-500/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-gray-400 hover:text-white hover:border-red-500/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
      */}

      {/* Swiper Container */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={30}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 150,
            modifier: 1.5,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSlideChange={handleSlideChange}
          className="w-full max-w-6xl mx-auto"
        >
          {resources.map((resource, idx) => {
            const isHovered = hoveredIndex === idx
            const isActive = activeIndex === idx
            const difficulty = resource.difficulty || "Intermediate"
            const diffConfig = difficultyConfig[difficulty]

            return (
              <SwiperSlide key={idx} className="!w-80 !h-auto">
                <motion.div
                  className={`
                    relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 
                    rounded-3xl border shadow-2xl overflow-hidden transition-all duration-500
                    ${isActive ? "border-red-500/50 shadow-red-500/20" : "border-red-500/20"}
                  `}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{
                    y: -10,
                    rotateY: 5,
                    rotateX: 5,
                    scale: 1.02,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.05)_75px,rgba(255,255,255,0.05)_76px,transparent_77px),linear-gradient(rgba(255,255,255,0.05)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.05)_27px,rgba(255,255,255,0.05)_74px,transparent_75px,transparent_76px,rgba(255,255,255,0.05)_77px)] bg-[length:30px_30px]" />
                  </div>

                  {/* Glow effect */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 rounded-3xl"
                      />
                    )}
                  </AnimatePresence>

                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={defaultImg}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                    {/* Category badge */}
                    {resource.category && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs text-red-300 border border-red-500/30"
                      >
                        {resource.category}
                      </motion.div>
                    )}

                    {/* Difficulty badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute top-4 right-4 px-2 py-1 ${diffConfig.bgColor} backdrop-blur-sm rounded-full text-xs ${diffConfig.color} border ${diffConfig.borderColor} flex items-center gap-1`}
                    >
                      {diffConfig.icon}
                      <span>{difficulty}</span>
                    </motion.div>

                    {/* Hover overlay */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-transparent to-transparent flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                          >
                            <Eye className="w-6 h-6 text-white" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 space-y-4">
                    {/* Title */}
                    <motion.h3
                      className="text-lg font-bold text-white leading-tight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {resource.title}
                    </motion.h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">{renderStars(resource.rating)}</div>
                      <span className="text-xs text-gray-400">({resource.rating || 5}.0)</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>Popular</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Recommended</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.a
                      href={resource.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />

                      <span className="relative z-10">Explore Resource</span>
                      <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>

                  {/* Floating particles */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-red-400 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Connection indicator */}
                  <div className="absolute left-0 top-1/2 w-1 h-12 bg-gradient-to-b from-red-500 to-orange-500 rounded-full transform -translate-y-1/2" />
                </motion.div>
              </SwiperSlide>
            )
          })}
        </Swiper>

        {/* Custom Pagination Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {resources.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => swiperRef.current?.slideTo(idx)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${
                  idx === activeIndex
                    ? "bg-gradient-to-r from-red-500 to-orange-500 scale-125"
                    : "bg-slate-600 hover:bg-slate-500"
                }
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet-custom {
          width: 12px !important;
          height: 12px !important;
          background: #64748b !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: linear-gradient(45deg, #ef4444, #f97316) !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        
        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          background: linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(249, 115, 22, 0.1)) !important;
        }
      `}</style>
    </motion.div>
  )
}
