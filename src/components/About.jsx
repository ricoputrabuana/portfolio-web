import { useState } from "react";

export default function About() {
  const [selectedClass, setSelectedClass] = useState("webdev");
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const classOptions = [
    { key: "webdev",    label: "Full Stack Web Dev" },
    { key: "mobiledev", label: "Full Stack Mobile App Dev" },
  ];

  // Icon per slot, per class. src disiapkan kosong — isi path-nya sendiri.
  const equipmentByClass = {
    webdev: {
      helmet: { label: "PHP",     src: "/icons/php.png" },
      armor:  { label: "VS Code", src: "/icons/vscode.png" },
      weapon: { label: "React",   src: "/icons/react.png" },
    },
    mobiledev: {
      helmet: { label: "Firebase",       src: "/icons/firebase.png" },
      armor:  { label: "Android Studio", src: "/icons/androidstudio.png" },
      weapon: { label: "Java",           src: "/icons/java.png" },
    },
  };

  const currentEquipment = equipmentByClass[selectedClass];

  const equipmentSlots = [
    { key: "helmet", label: "Helmet", icon: "👑", style: { top: -30,  left: "50%", transform: "translateX(-50%)" } },
    { key: "armor",  label: "Armor",  icon: "🛡", style: { top: 100, left: 20 } },
    { key: "cape",   label: "Cape",   icon: "🧣", style: { top: 100, right: 20 } },
    { key: "weapon", label: "Weapon", icon: "⚔️", style: { top: 240, left: 20 } },
    { key: "boots",  label: "Boots",  icon: "👢", style: { top: 240, right: 20 } },
  ];

  return (
    <section
      id="about"
      className="relative bg-[#12091e]/70 text-white py-12 px-6 backdrop-blur-sm z-10"
    >
      {/* Responsive overrides for smaller screens — desktop visual untouched */}
      <style>{`
        @media (max-width: 860px) {
          .tools-header { flex-direction: column !important; }
          .tools-header-left {
            flex: 0 0 auto !important;
            width: 100% !important;
            box-sizing: border-box !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(180,140,60,0.3) !important;
          }
          .tools-header-right { display: none !important; }

          .tools-mobile-charinfo-header { display: flex !important; }

          .tools-body { flex-direction: column !important; min-height: auto !important; }

          .tools-left {
            width: 100% !important;
            box-sizing: border-box !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 56px 16px 24px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(180,140,60,0.35) !important;
          }

          .tools-char-box { margin: 0 auto !important; }

          .tools-side-col {
            width: 100% !important;
            max-width: 300px !important;
            margin: 16px auto 0 !important;
            align-self: center !important;
          }

          .tools-right-col { width: 100% !important; box-sizing: border-box !important; }

          .tools-info-grid { grid-template-columns: 1fr !important; }

          .tools-background-text { text-align: left !important; }
        }
      `}</style>

      {/* Section title */}
      <div className="text-center" style={{ marginBottom: 28 }}>
        <h2
          className="text-2xl font-bold"
          style={{ color: "#c8a84b", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          ✦ Tools ✦
        </h2>
      </div>

      {/* Inventory Card */}
      <div
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={{
          maxWidth: 1150,
          background: "linear-gradient(160deg, #2d1f4e 0%, #1e1340 60%, #251848 100%)",
          border: "1.5px solid rgba(180,140,60,0.55)",
          boxShadow: "0 0 0 1px rgba(100,60,200,0.25), 0 12px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,220,100,0.08)",
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center tools-header"
          style={{
            background: "linear-gradient(90deg, rgba(6,182,212,0.4) 0%, rgba(60,30,120,0.5) 40%, rgba(120,60,200,0.7) 100%)",
            borderBottom: "1px solid rgba(180,140,60,0.3)",
          }}
        >
          {/* Equipment Inventory label */}
          <div
            className="tools-header-left"
            style={{
              flex: "0 0 505px",
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid rgba(180,140,60,0.35)",
            }}
          >
            <span
              className="text-sm font-black tracking-widest uppercase"
              style={{ color: "#c8a84b", letterSpacing: "0.18em" }}
            >
              ✦  Equipment Inventory  ✦
            </span>
          </div>

          {/* Character Info label */}
          <div
            className="tools-header-right"
            style={{
              flex: 1,
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              className="text-sm font-black tracking-widest uppercase"
              style={{ color: "#c8a84b", letterSpacing: "0.18em" }}
            >
              ✦  Character Info  ✦
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex tools-body" style={{ padding: 0, gap: 0, minHeight: 446 }}>

          {/* LEFT: Character + Equipment Slots */}
          <div
            className="flex items-start justify-start tools-left"
            style={{
              width: 505,
              boxSizing: "border-box",
              paddingRight: 16,
              paddingLeft: 0,
              paddingTop: 50,
              paddingBottom: 16,
              gap: 16,
              borderRight: "1px solid rgba(180,140,60,0.35)",
              overflow: "visible",
              position: "relative",
            }}
          >
            <div className="tools-char-box" style={{ position: "relative", width: 300, height: 380, flexShrink: 0 }}>

              {/* Character image */}
              <img
                src="/character.png"
                alt="Character"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 320,
                  height: 460,
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />

              {/* Equipment slots */}
              {equipmentSlots.map((slot) => {
                const equipped = currentEquipment[slot.key];
                return (
                  <div
                    key={slot.key}
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      ...slot.style,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        border: "1px solid rgba(180,140,60,0.55)",
                        borderRadius: 7,
                        background: "rgba(120,80,200,0.2)",
                        boxShadow: "inset 0 0 10px rgba(180,140,60,0.12), 0 0 6px rgba(180,140,60,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {equipped ? (
                        <img
                          src={equipped.src}
                          alt={equipped.label}
                          style={{ width: 32, height: 32, objectFit: "contain" }}
                        />
                      ) : (
                        <span style={{ fontSize: 20, opacity: 0.35 }}>
                          {slot.icon}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 8,
                        color: equipped ? "rgba(200,168,75,0.9)" : "rgba(180,140,60,0.6)",
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        fontFamily: "sans-serif",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {slot.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right column: Current Class + Active Buffs + Equipment Icons */}
            <div
              className="tools-side-col"
              style={{
                width: 185,
                marginTop: -30,
                marginLeft: -15,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignSelf: "flex-start",
              }}
            >
              {/* Current Class box */}
              <div
                style={{
                  background: "linear-gradient(160deg, #1a0e30 0%, #130b28 100%)",
                  border: "1px solid rgba(200,168,75,0.35)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  boxShadow: "inset 0 0 20px rgba(120,60,200,0.12), 0 4px 24px rgba(0,0,0,0.5)",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Corner accents */}
                <span style={{ position: "absolute", top: 4, left: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>
                <span style={{ position: "absolute", top: 4, right: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>
                <span style={{ position: "absolute", bottom: 4, left: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>
                <span style={{ position: "absolute", bottom: 4, right: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>

                {/* Arrow button - posisi tengah kanan kotak Current Class */}
                <button
                  onClick={() => setShowClassDropdown(prev => !prev)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 10,
                    transform: "translateY(-50%)",
                    background: "rgba(200,168,75,0.15)",
                    border: "1px solid rgba(200,168,75,0.4)",
                    borderRadius: 4,
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0,
                    transition: "background 0.2s",
                    zIndex: 10,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(200,168,75,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(200,168,75,0.15)"}
                >
                  <span style={{ fontSize: 8, color: "#c8a84b", lineHeight: 1 }}>
                    ▶
                  </span>
                </button>

                {/* Label + rank icon row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Rank badge */}
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    background: "radial-gradient(circle, rgba(120,60,220,0.6) 0%, rgba(60,20,100,0.8) 100%)",
                    border: "1.5px solid rgba(160,100,255,0.6)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 10px rgba(120,60,220,0.5), inset 0 0 6px rgba(200,160,255,0.15)",
                    fontSize: 14,
                  }}>
                    💎
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 7, color: "rgba(200,168,75,0.65)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 2 }}>
                      Current Class
                    </div>
                    {/* Class name + arrow button */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          color: "#ffffff",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          lineHeight: 1.7,
                          paddingRight: 22,
                        }}
                      >
                        {classOptions.find(c => c.key === selectedClass)?.label}
                      </div>

                      {/* Dropdown kotak pilih class */}
                      {showClassDropdown && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 6px)",
                            left: 0,
                            zIndex: 100,
                            background: "linear-gradient(160deg, #1a0e30 0%, #130b28 100%)",
                            border: "1px solid rgba(200,168,75,0.5)",
                            borderRadius: 8,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(120,60,200,0.2)",
                            minWidth: 170,
                            overflow: "hidden",
                          }}
                        >
                          {classOptions.map((option, idx) => (
                            <button
                              key={option.key}
                              onClick={() => {
                                setSelectedClass(option.key);
                                setShowClassDropdown(false);
                              }}
                              style={{
                                width: "100%",
                                padding: "9px 12px",
                                background: selectedClass === option.key
                                  ? "rgba(200,168,75,0.15)"
                                  : "transparent",
                                border: "none",
                                borderBottom: idx < classOptions.length - 1
                                  ? "1px solid rgba(200,168,75,0.15)"
                                  : "none",
                                color: selectedClass === option.key ? "#c8a84b" : "rgba(200,185,168,0.85)",
                                fontSize: 10,
                                fontWeight: selectedClass === option.key ? 900 : 600,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                textAlign: "left",
                                cursor: "pointer",
                                transition: "background 0.15s, color 0.15s",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                              onMouseEnter={e => {
                                if (selectedClass !== option.key) {
                                  e.currentTarget.style.background = "rgba(200,168,75,0.08)";
                                  e.currentTarget.style.color = "#ffffff";
                                }
                              }}
                              onMouseLeave={e => {
                                if (selectedClass !== option.key) {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = "rgba(200,185,168,0.85)";
                                }
                              }}
                            >
                              <span style={{ fontSize: 8, opacity: 0.6 }}>
                                {selectedClass === option.key ? "◆" : "◇"}
                              </span>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Buffs box */}
              <div
                style={{
                  background: "linear-gradient(160deg, #1a0e30 0%, #130b28 100%)",
                  border: "1px solid rgba(200,168,75,0.35)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  boxShadow: "inset 0 0 20px rgba(120,60,200,0.12), 0 4px 24px rgba(0,0,0,0.5)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner accents */}
                <span style={{ position: "absolute", top: 4, left: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>
                <span style={{ position: "absolute", top: 4, right: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>
                <span style={{ position: "absolute", bottom: 4, left: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>
                <span style={{ position: "absolute", bottom: 4, right: 4, color: "rgba(200,168,75,0.4)", fontSize: 8, lineHeight: 1 }}>◆</span>

                {/* Header */}
                <div style={{ fontSize: 9, color: "rgba(200,168,75,0.65)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
                  ⚡ Active Buffs
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(200,168,75,0.2)", marginBottom: 8 }} />

                {/* Buff list */}
                {[
                  { stat: "+INT", label: "Clean Code",      color: "#a78bfa" },
                  { stat: "+AGI", label: "Fast Learner",    color: "#34d399" },
                  { stat: "+STR", label: "Problem Solver",  color: "#f87171" },
                  { stat: "+WIS", label: "Team Player",     color: "#60a5fa" },
                  { stat: "+DEX", label: "Detail Oriented", color: "#fbbf24" },
                ].map((buff) => (
                  <div
                    key={buff.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: buff.color,
                      letterSpacing: "0.08em",
                      minWidth: 28,
                      flexShrink: 0,
                      textShadow: `0 0 6px ${buff.color}80`,
                    }}>
                      {buff.stat}
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: "rgba(200,185,168,0.85)",
                      letterSpacing: "0.04em",
                    }}>
                      {buff.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Character Info */}
          <div
            className="flex flex-col tools-right-col"
            style={{ flex: 1, padding: 24, gap: 14, justifyContent: "flex-start", overflowY: "auto" }}
          >
            {/* Mobile-only: Character Info header, shown right above the profile cards */}
            <div
              className="tools-mobile-charinfo-header"
              style={{
                display: "none",
                alignItems: "center",
                background: "linear-gradient(90deg, rgba(6,182,212,0.4) 0%, rgba(60,30,120,0.5) 40%, rgba(120,60,200,0.7) 100%)",
                borderTop: "1px solid rgba(180,140,60,0.3)",
                borderBottom: "1px solid rgba(180,140,60,0.3)",
                padding: "8px 24px",
                margin: "0 -24px 4px",
              }}
            >
              <span
                className="text-sm font-black tracking-widest uppercase"
                style={{ color: "#c8a84b", letterSpacing: "0.18em" }}
              >
                ✦  Character Info  ✦
              </span>
            </div>

            {/* Row 1: Identitas + Spesialisasi */}
            <div className="tools-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Identitas */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(200,168,75,0.2)",
                borderRadius: 10,
                padding: "12px 14px",
                position: "relative",
              }}>
                <img
                  src="/logo-profile.png"
                  alt="Profile"
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 60,
                    height: 60,
                    objectFit: "contain",
                  }}
                />
                <div style={{ paddingLeft: 68 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, minHeight: 24 }}>
                    <span style={{ color: "#c8a84b", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Profile</span>
                  </div>
                  <p
                    lang="en"
                    style={{
                      color: "#c8bfa8",
                      fontSize: 13,
                      lineHeight: 1.6,
                      margin: 0,
                      textAlign: "left",
                      hyphens: "auto",
                      WebkitHyphens: "auto",
                      MozHyphens: "auto",
                    }}
                  >
                    Informatics Engineering graduate from Universitas Gunadarma (2020–2024). Certified Junior Web Programmer (BNSP) with experience building web and Android applications, as well as deep learning models.
                  </p>
                </div>
              </div>

              {/* Spesialisasi */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(200,168,75,0.2)",
                borderRadius: 10,
                padding: "12px 14px",
                position: "relative",
              }}>
                <img
                  src="/logo-spesialisasi.png"
                  alt="Specialization"
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 60,
                    height: 60,
                    objectFit: "contain",
                  }}
                />
                <div style={{ paddingLeft: 68 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, minHeight: 24 }}>
                    <span style={{ color: "#c8a84b", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Specialization</span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                    {[
                      "Web: HTML, CSS, JavaScript, PHP",
                      "Android: Java, Android Studio, Firebase",
                      "Machine Learning: Generative Adversarial Network (GAN)",
                      "Tools: Microsoft Office, Troubleshooting, Computer Networking",
                    ].map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ color: "#9b6fff", fontSize: 10, marginTop: 3, flexShrink: 0 }}>◆</span>
                        <span style={{ color: "#c8bfa8", fontSize: 12, lineHeight: 1.4, textAlign: "left" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Row 2: Latar Belakang — full width */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,168,75,0.2)",
              borderRadius: 10,
              padding: "12px 14px",
              position: "relative",
            }}>
              <img
                src="/logo-background.png"
                alt="Background"
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  width: 60,
                  height: 60,
                  objectFit: "contain",
                }}
              />
              <div style={{ paddingLeft: 68 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, minHeight: 24 }}>
                  <span style={{ color: "#c8a84b", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Background</span>
                </div>
                <p
                  lang="en"
                  className="tools-background-text"
                  style={{
                    color: "#c8bfa8",
                    fontSize: 13,
                    lineHeight: 1.6,
                    margin: 0,
                    textAlign: "justify",
                    hyphens: "auto",
                    WebkitHyphens: "auto",
                    MozHyphens: "auto",
                  }}
                >
                  Passionate developer with a strong interest in web development, Android app development, and machine learning. Experienced in building a GAN-based deep learning model for facial image processing, as well as a Mobile E-Health application using Android Studio and Firebase. Has a solid foundation in troubleshooting and computer networking.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Corner ornaments */}
        <span style={{ position: "absolute", top: 44, left: 8, color: "rgba(200,168,75,0.35)", fontSize: 10, pointerEvents: "none", userSelect: "none" }}>◆</span>
        <span style={{ position: "absolute", top: 44, right: 8, color: "rgba(200,168,75,0.35)", fontSize: 10, pointerEvents: "none", userSelect: "none" }}>◆</span>
        <span style={{ position: "absolute", bottom: 8, left: 8, color: "rgba(200,168,75,0.35)", fontSize: 10, pointerEvents: "none", userSelect: "none" }}>◆</span>
        <span style={{ position: "absolute", bottom: 8, right: 8, color: "rgba(200,168,75,0.35)", fontSize: 10, pointerEvents: "none", userSelect: "none" }}>◆</span>
      </div>
    </section>
  );
}
