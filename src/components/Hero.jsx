import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Ganti teks ini sesuai bio kamu ──
const DIALOGUE_TEXT =
  "Hi, I'm Rico! A Frontend Developer based in Jakarta who's passionate about crafting modern interfaces where design, animation, and technology come together to create fascinating visuals and memorable user experiences. Let's build something great together.";

const WORDS = DIALOGUE_TEXT.split(" ");
const WORD_DELAY_MS = 85;

export default function Hero() {
  const [showDialogue, setShowDialogue] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | photo | name | divider | text | done
  const [visibleWords, setVisibleWords] = useState(0);
  const [dims, setDims] = useState({
    W: window.innerWidth,
    H: window.innerHeight,
  });

  const wordTimerRef = useRef(null);

  // ── Resize listener ──
  useEffect(() => {
    const handleResize = () =>
      setDims({ W: window.innerWidth, H: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Auto-close saat hero scroll keluar viewport ──
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      if (hero.getBoundingClientRect().bottom < 500) handleClose();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Sequence orchestrator ──
  // photo → name → divider → text
  useEffect(() => {
    if (!showDialogue) return;
    setPhase("photo");
    const nameTimer   = setTimeout(() => setPhase("name"),    600);
    const divTimer    = setTimeout(() => setPhase("divider"), 1050);
    const textTimer   = setTimeout(() => {
      setPhase("text");
      setVisibleWords(0);
    }, 1400);
    return () => {
      clearTimeout(nameTimer);
      clearTimeout(divTimer);
      clearTimeout(textTimer);
    };
  }, [showDialogue]);

  // ── Word-by-word ticker ──
  useEffect(() => {
    if (phase !== "text") return;
    if (visibleWords >= WORDS.length) {
      setPhase("done");
      return;
    }
    wordTimerRef.current = setTimeout(
      () => setVisibleWords((v) => v + 1),
      WORD_DELAY_MS
    );
    return () => clearTimeout(wordTimerRef.current);
  }, [phase, visibleWords]);

  // ── Skip: klik saat teks ngetik → langsung selesai ──
  const handleSkip = () => {
    if (phase === "text") {
      clearTimeout(wordTimerRef.current);
      setVisibleWords(WORDS.length);
      setPhase("done");
    }
  };

  const handleOpen = () => {
    setShowDialogue(true);
    setPhase("idle");
    setVisibleWords(0);
  };

  const handleClose = () => {
    setShowDialogue(false);
    setPhase("idle");
    setVisibleWords(0);
    clearTimeout(wordTimerRef.current);
  };

  // ── Posisi tombol ! (sama seperti aslinya) ──
  const personH = dims.H * 0.48;
  const personW = personH * 0.5;
  const px = dims.W * 0.76;
  const py = dims.H * 0.91;

  const HEAD_OFFSET_X = -0.11;
  const HEAD_OFFSET_Y = 0.04;
  const headX = px + personW * HEAD_OFFSET_X;
  const headY = py - personH + personH * HEAD_OFFSET_Y;

  const btnSize = 40;
  const btnLeft = headX - btnSize / 2;
  const btnTop = headY - btnSize - 8;

  const isActive = phase !== "idle";

  // ── Foto tinggi lebih besar ──
  const imgH = Math.min(dims.H * 0.72, 560);

  // ── Fase check helpers ──
  const showName    = ["name","divider","text","done"].includes(phase);
  const showDivider = ["divider","text","done"].includes(phase);
  const showText    = ["text","done"].includes(phase);

  return (
    <section id="home" className="relative h-screen w-full text-white z-10">

      {/* ── Tombol ! — hanya tampil saat dialogue TUTUP ── */}
      {!showDialogue && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 18 }}
          onClick={handleOpen}
          style={{
            position: "fixed",
            left: btnLeft,
            top: btnTop,
            width: btnSize,
            height: btnSize,
            zIndex: 50,
            backgroundColor: "#dc2626",
            borderRadius: "50%",
            border: "2px solid rgb(255,255,255)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            outline: "none",
          }}
          aria-label="Bicara dengan Rico"
        >
          <span
            style={{
              fontSize: 30,
              lineHeight: 1,
              marginTop: -1,
              color: "#facc15",
              fontWeight: 900,
              userSelect: "none",
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            !
          </span>
        </motion.button>
      )}

      {/* ── Dark overlay ── */}
      <AnimatePresence>
        {showDialogue && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 35,
              background: "rgba(0,0,0,0.60)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── NPC Scene ── */}
      <AnimatePresence>
        {showDialogue && (
          <motion.div
            key="npc-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {/* ── Row: foto kiri | teks kanan ── */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 48,
                width: "100%",
                maxWidth: 1040,
                padding: "0 40px 56px",
                pointerEvents: "auto",
              }}
            >
              {/* ── Foto Rico ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key="npc-photo"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    style={{ flexShrink: 0, alignSelf: "flex-end" }}
                  >
                    <img
                      src="/rico.png"
                      alt="Rico Putra Buana"
                      style={{
                        height: imgH,
                        width: "auto",
                        objectFit: "contain",
                        objectPosition: "bottom center",
                        display: "block",
                        filter: "drop-shadow(0 10px 36px rgba(0,0,0,0.65))",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Kolom kanan: nama fixed di atas, lalu divider, lalu teks mengalir ke bawah ── */}
              <div
                style={{
                  flexShrink: 1,
                  flexGrow: 1,
                  flexBasis: 0,
                  minWidth: 0,
                  width: 0,
                  // Tingginya sejajar dengan tinggi foto, top-aligned
                  alignSelf: "flex-end",
                  height: imgH,
                  display: "flex",
                  flexDirection: "column",
                  // Nama muncul lebih ke bawah & geser kiri
                  paddingTop: imgH * 0.42,
                  paddingBottom: 24,
                  gap: 0,
                  marginLeft: -48,
                }}
              >
                {/* ── Nama + tombol × sejajar ── */}
                <AnimatePresence>
                  {showName && (
                    <motion.div
                      key="npc-name"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          color: "#e8d5a0",
                          fontWeight: 800,
                          fontSize: "clamp(22px, 2.6vw, 34px)",
                          lineHeight: 1.1,
                          margin: 0,
                          letterSpacing: "-0.01em",
                          textShadow: "0 2px 18px rgba(0,0,0,0.75)",
                        }}
                      >
                        Rico Putra Buana
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                        style={{
                          flexShrink: 0,
                          width: 36,
                          height: 36,
                          backgroundColor: "#dc2626",
                          borderRadius: "50%",
                          border: "2px solid rgb(255,255,255)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          outline: "none",
                          marginLeft: 12,
                        }}
                        aria-label="Tutup"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "block" }}
                        >
                          <line x1="1" y1="1" x2="13" y2="13" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round"/>
                          <line x1="13" y1="1" x2="1" y2="13" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Divider — grows in setelah nama ── */}
                <AnimatePresence>
                  {showDivider && (
                    <motion.div
                      key="npc-divider"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{
                        marginTop: 14,
                        marginBottom: 18,
                        height: 1.5,
                        background:
                          "linear-gradient(90deg, #c8a84b 0%, rgba(200,168,75,0.25) 100%)",
                        borderRadius: 2,
                        transformOrigin: "left center",
                        width: "100%",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* ── Deskripsi word-by-word, mengalir ke bawah ── */}
                {showText && (
                  <div
                    style={{
                      color: "#d4cdb8",
                      fontSize: "clamp(13px, 1.15vw, 16px)",
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      cursor: phase === "text" ? "pointer" : "default",
                      textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                      textAlign: "justify",
                      textAlignLast: "left",
                    }}
                  >
                    {WORDS.slice(0, visibleWords).join(" ")}
                    {phase === "text" && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 2,
                          height: "1em",
                          background: "#c8a84b",
                          marginLeft: 2,
                          verticalAlign: "middle",
                          animation: "blink 0.7s step-end infinite",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Blink keyframe ── */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
