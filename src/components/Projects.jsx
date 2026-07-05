import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "Aurora Portfolio",
    slug: "aurora-portfolio",
    desc:
      "Immersive portfolio site blending motion, canvas art and subtle interactivity — a living background that frames each project like a constellation.",
    tags: ["React", "Canvas", "Framer Motion"],
    link: "#",
    type: "video",
    src: "/videos/aurora_thumbnail.webm",
  },
  {
    title: "AI Image Enhancer",
    desc:
      "Hugging Face app that auto-detects faces and enhances images using a GFPGAN + Real-ESRGAN pipeline — built for speed and quality.",
    tags: ["Python", "Hugging Face", "AI"],
    link: "https://image-enhancer-frontend-green.vercel.app/",
    type: "image",
    src: "/image-enhancer.jpg",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function ProjectCard({ p, onOpen }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      onClick={() => onOpen(p)} // klik di mana pun dalam card
      className="relative cursor-pointer p-0 bg-white/6 backdrop-blur-md rounded-2xl border border-white/6 hover:bg-white/12 hover:shadow-[0_0_25px_rgba(160,100,255,0.18)] transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full h-40 overflow-hidden">
        {p.type === "video" ? (
          <video
            src={p.src}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
          />
        ) : p.type === "iframe" ? (
          <iframe
            src={p.src}
            title={p.title}
            className="w-full h-40 border-none pointer-events-none"
            style={{
              transform: "scale(0.6)",
              transformOrigin: "top left",
              width: "166%",
              height: "166%",
            }}
          />
        ) : (
          <img
            src={p.src}
            alt={p.title}
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2 text-purple-200 text-center">
          {p.title}
        </h3>
        <p
          className="text-gray-300 text-sm leading-relaxed text-center"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "92px",
          }}
        >
          {p.desc}
        </p>

        <div style={{ marginTop: "24px" }} className="text-left">
          <p className="font-bold text-white-400/60 mb-2" style={{ fontSize: "13px", letterSpacing: "0.2em" }}>
            ✦ Crafting Material :
          </p>
          <div className="flex flex-wrap gap-2" style={{ paddingLeft: "1.1em" }}>
            {p.tags.map((tag, i) => (
              <span
                key={i}
                className="text-purple-200"
                style={{
                  fontSize: "12px",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  background: "linear-gradient(#1a0f2d, #1a0f2d) padding-box, linear-gradient(to right, #a855f7, #6366f1, #22d3ee) border-box",
                  border: "1px solid transparent",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "24px" }} className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(p);
            }}
            className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600/80 via-indigo-500/70 to-cyan-400/60 shadow-[0_6px_18px_rgba(100,60,200,0.12)] hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
          >
            View Project
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  // 🔒 Kunci scroll halaman saat modal terbuka
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a0f2d]/95 p-8 rounded-2xl max-w-lg w-full border border-white/10 relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-purple-300 hover:text-white text-lg"
            >
              ✕
            </button>

            {project.type === "video" ? (
              <video
                src={project.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-48 object-cover rounded-xl mb-5"
              />
            ) : project.type === "iframe" ? (
              <iframe
                src={project.src}
                title={project.title}
                className="w-full h-48 rounded-xl mb-5 border-none"
                style={{
                  transform: "scale(0.65)",
                  transformOrigin: "top left",
                  width: "154%",
                  height: "154%",
                }}
              />
            ) : (
              <img
                src={project.src}
                alt={project.title}
                className="w-full h-48 object-cover rounded-xl mb-5"
              />
            )}

            <h3 className="text-2xl font-semibold text-purple-200 mb-3 text-center">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm mb-6 text-center">{project.desc}</p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/80 via-indigo-500/70 to-cyan-400/60 font-medium hover:scale-[1.02] transition-transform duration-200"
          >
            Visit Project
          </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="projects"
      className="relative bg-[#1a0f2d]/90 text-white py-24 px-6 z-10"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 text-purple-300 text-center">Projects</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 italic text-center">
          Each creation glows beneath the same sky — fragments of imagination
          turned into light.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((p, i) => (
            <ProjectCard key={i} p={p} onOpen={setSelectedProject} />
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-transparent to-transparent text-sm font-medium text-purple-200/90 hover:text-white border border-purple-400/10 shadow-sm"
          >
            Interested in collaborating? Let’s talk →
          </a>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
