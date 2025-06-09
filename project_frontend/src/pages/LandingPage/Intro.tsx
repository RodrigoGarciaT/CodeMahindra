import { useEffect, useRef, useState } from "react";
import LandingPage from "./Page";
import { motion } from "framer-motion";

export default function Intro() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showLanding, setShowLanding] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFadeToBlack(true);
    }, 4600); // fade justo antes del final del video

    const showTimeout = setTimeout(() => {
      setShowLanding(true);
    }, 5600); // entrada de la landing

    if (videoRef.current) {
      videoRef.current.play().catch((err) =>
        console.error("Error playing video:", err)
      );
    }

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(showTimeout);
    };
  }, []);

  return (
    <div className="w-full h-full">
      {!showLanding ? (
        <div className="relative w-screen h-screen overflow-hidden">
          {/* Video animado */}
          <motion.video
            ref={videoRef}
            src="/intro2.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.07 }}
            transition={{ duration: 6, ease: "easeInOut" }}
          />

          {/* Oscurecimiento progresivo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeToBlack ? 1 : 0 }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
            className="absolute inset-0 bg-black z-20"
            style={{
              backdropFilter: fadeToBlack ? "blur(2px)" : "none",
            }}
          />
        </div>
      ) : (
        // Entrada épica de la landing
        <motion.div
          className="w-full h-full"
          initial={{
            opacity: 0,
            scale: 1.05,
            filter: "brightness(0) blur(12px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "brightness(1) blur(0px)",
          }}
          transition={{
            duration: 2.8,
            ease: [0.2, 0.8, 0.2, 1], // ease-in-out fuerte
          }}
        >
          <LandingPage />
        </motion.div>
      )}
    </div>
  );
}
