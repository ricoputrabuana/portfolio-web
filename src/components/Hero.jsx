import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center h-screen text-center text-white z-10 px-6"
    >
      {/* HEADLINE */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-tight text-glow"
      >
        Welcome to my world
      </motion.h1>

      {/* SUBTEXT */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed"
      >
        A journey beneath the{" "}
        <span className="text-purple-200">purple sky</span> — where{" "}
        <span className="text-purple-300">imagination</span> meets{" "}
        <span className="text-purple-300">creation</span>.
      </motion.p>

      {/* CALL TO ACTION */}
      <motion.a
        href="#projects"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-10 inline-block px-8 py-3 rounded-full 
                   bg-gradient-to-r from-purple-600/80 via-indigo-500/70 to-cyan-400/60 
                   hover:from-purple-500 hover:to-cyan-300 
                   shadow-[0_0_15px_rgba(180,120,255,0.3)] 
                   hover:shadow-[0_0_25px_rgba(180,120,255,0.6)] 
                   text-white font-medium transition-all duration-500"
      >
        Explore My Work
      </motion.a>
    </section>
  );
}
