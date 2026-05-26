import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll ke atas saat halaman dibuka
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = () => {
    navigate("/#projects");
    setTimeout(() => {
      const section = document.getElementById("projects");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0715] via-[#120a26] to-[#0b0715] text-gray-100 overflow-x-hidden">

      {/* Tombol Kembali */}
<button
  onClick={handleBack}
  className="fixed top-6 left-6 flex items-center gap-2 px-6 py-2 rounded-full
             bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
             text-white border border-purple-500 shadow-lg
             hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
             transition-all duration-200 cursor-pointer font-medium z-50"
>
  ⬅ Projects
</button>



      {/* Hero Video */}
      <div className="relative w-full h-[60vh] sm:h-[75vh] overflow-hidden">
        <motion.video
          src="assets/videos/aurora_thumbnail.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0715] via-transparent to-transparent" />
        <h1 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-4xl sm:text-5xl font-bold text-white-200 drop-shadow-[0_0_20px_rgba(178,132,255,0.7)]">
          Aurora Portfolio
        </h1>
      </div>

      {/* 2. Project Overview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Overview</h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          Aurora Portfolio is a personal web experience blending motion, light,
          and interactivity. The goal was to create a digital space that feels
          alive — featuring an animated aurora, reflective lake, and dynamic
          scene composition, all built using React and canvas rendering.
        </p>
      </section>

      {/* 3. Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Tech Stack & Tools</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><b>React</b> — for component-based structure and reactivity.</li>
          <li><b>Framer Motion</b> — for smooth entrance animations and transitions.</li>
          <li><b>Canvas API</b> — to render the aurora and lake reflection effects.</li>
          <li><b>Tailwind CSS</b> — for consistent design and responsive layout.</li>
        </ul>
      </section>

      {/* 4. Gallery / Screenshots */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-8 text-center">Visual Showcase</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <img src="/images/aurora-1.png" alt="Aurora screenshot 1" className="rounded-lg shadow-md" />
          <img src="/images/aurora-2.png" alt="Aurora screenshot 2" className="rounded-lg shadow-md" />
          <img src="/images/aurora-3.png" alt="Aurora screenshot 3" className="rounded-lg shadow-md" />
        </div>
      </section>

      {/* 5. Key Features */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Key Features</h2>
        <ul className="space-y-3 text-gray-300">
          <li>✨ Real-time aurora animation using gradient blending.</li>
          <li>🌊 Dynamic reflection with smooth canvas rendering.</li>
          <li>🎨 Fully responsive layout with adaptive motion effects.</li>
          <li>⚡ Lazy-loaded assets for faster performance.</li>
        </ul>
      </section>

      {/* 6. Reflection / Challenges */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Challenges & Learnings</h2>
        <p className="text-gray-300 leading-relaxed">
          One of the biggest challenges was making the aurora animation look
          natural without using heavy shaders. I learned a lot about layering
          transparency, timing easing functions, and optimizing canvas rendering
          for performance across devices.
        </p>
      </section>

      {/* 7. Footer Call-to-Action */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-300 text-lg mb-6">Want to collaborate? Let’s create something beautiful together.</p>
        <a
          href="mailto:your-email@example.com"
          className="inline-block bg-gradient-to-r from-purple-600/80 via-indigo-500/70 to-cyan-400/60 px-8 py-3 rounded-full text-white font-medium hover:scale-[1.03] transition-transform shadow-lg"
        >
          Contact Me
        </a>
      </section>

      {/* Padding bawah */}
      <div className="h-12" />
    </div>
  );
}
