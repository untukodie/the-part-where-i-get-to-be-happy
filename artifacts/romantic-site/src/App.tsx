import { useState, useEffect, useRef } from "react";

type Screen = "cover" | "transition" | "slides" | "closing";

const slides = [
  {
    label: "I.",
    heading: "Before You",
    body: "I used to be good at being alone. I had learned to make peace with empty mornings, with quiet nights, with a version of life that asked nothing of me and gave nothing back. I called it freedom. I called it enough.",
  },
  {
    label: "II.",
    heading: "The Part I Didn't Plan",
    body: "Then you walked into the frame — not dramatically, not like a movie — just quietly, like something I had been waiting for without knowing I was waiting. And the air changed. The way I saw things changed. The way I felt when I woke up changed.",
  },
  {
    label: "III.",
    heading: "What Lucky Feels Like",
    body: "I don't say this lightly: I am lucky. Not in the way people throw words around. I mean it in my chest. I mean it in the moments I look at you and feel something settle inside me — like a long exhale. Like finally.",
  },
  {
    label: "IV.",
    heading: "Proud",
    body: "I am proud of you. Quietly, consistently, and completely. Not because of what you achieve — though you achieve more than you give yourself credit for — but because of who you are when no one is watching. That version of you? She is extraordinary.",
  },
  {
    label: "V.",
    heading: "Grateful",
    body: "You chose me. I don't take that for granted. On every ordinary day, in every tired moment, in every conversation that mattered — you were there. You are here. And I am grateful for every single version of that.",
  },
  {
    label: "VI.",
    heading: "What I Want You to Know",
    body: "I will not always say it perfectly. But I will always mean it. I will keep showing up for you — not because I have to, but because there is nothing I want more than to be someone you can count on. Completely. Always.",
  },
  {
    label: "VII.",
    heading: "Happy",
    body: "This is what happy feels like for me. It feels like you. Not a version of you — you, exactly as you are, right now. And I am so glad I get to be here. I am so glad this is my life. I am so glad you are mine.",
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("cover");
  const [slideIndex, setSlideIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [coverVisible, setCoverVisible] = useState(true);
  const [secretInput, setSecretInput] = useState("");
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleOpen = () => {
    startMusic();
    setCoverVisible(false);
    setTimeout(() => {
      setScreen("transition");
    }, 700);
  };

  const handleStartReading = () => {
    setSlideIndex(0);
    fade(() => setScreen("slides"));
  };

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      fade(() => setSlideIndex((i) => i + 1));
    } else {
      fade(() => setScreen("closing"));
    }
  };

  const handleBack = () => {
    if (slideIndex === 0) {
      fade(() => setScreen("transition"));
    } else {
      fade(() => setSlideIndex((i) => i - 1));
    }
  };

  const handleReadAgain = () => {
    fade(() => {
      setSlideIndex(0);
      setScreen("cover");
      setCoverVisible(true);
      setSecretInput("");
      setSecretUnlocked(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });
  };

  const handleClosingBack = () => {
    fade(() => {
      setSlideIndex(slides.length - 1);
      setScreen("slides");
      setSecretInput("");
      setSecretUnlocked(false);
    });
  };

  const fade = (cb: () => void) => {
    setTransitioning(true);
    setTimeout(() => {
      cb();
      setTransitioning(false);
    }, 450);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#0a0908" }}>
      {/* Fixed background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/bg-bw.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%) brightness(0.35) contrast(1.1)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Grain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.055,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px",
        }}
      />

      {/* Global fade overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#0a0908",
          opacity: transitioning ? 1 : 0,
          transition: "opacity 0.45s ease",
          pointerEvents: "none",
        }}
      />

      {/* COVER SCREEN */}
      {screen === "cover" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            opacity: coverVisible ? 1 : 0,
            transform: coverVisible ? "scale(1)" : "scale(0.97)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div
            style={{
              width: "min(100%, 780px)",
              borderRadius: "28px",
              overflow: "hidden",
              background: "rgba(10,9,8,0.4)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 32px 100px rgba(0,0,0,0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              animation: "coverRise 1s ease both",
            }}
          >
            {/* Photo area */}
            <div
              style={{
                position: "relative",
                height: "clamp(480px, 68vh, 640px)",
                backgroundImage: "url(/cover-color.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center top",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                textAlign: "center",
                padding: "32px 24px",
              }}
            >
              {/* Photo overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(6,5,5,0.92) 0%, rgba(6,5,5,0.3) 45%, rgba(6,5,5,0.08) 100%)",
                }}
              />
              {/* Inner border */}
              <div
                style={{
                  position: "absolute",
                  inset: "16px",
                  border: "1px solid rgba(255,255,255,0.13)",
                  borderRadius: "20px",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: "600px" }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11px",
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    color: "rgba(255,249,240,0.6)",
                    marginBottom: "14px",
                  }}
                >
                  an archive of happiness
                </p>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(40px, 7.5vw, 82px)",
                    lineHeight: 0.95,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "#fff9f0",
                    textShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    marginBottom: "18px",
                  }}
                >
                  THE PART WHERE
                  <br />
                  I GET TO BE HAPPY
                </h1>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(20px, 3.6vw, 30px)",
                    color: "rgba(255,249,240,0.82)",
                    marginBottom: "22px",
                  }}
                >
                  with you, because of you, and for us.
                </p>

                <div style={{ width: "120px", height: "1px", background: "rgba(255,255,255,0.22)", margin: "0 auto 20px" }} />

                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(18px, 3.2vw, 26px)",
                    color: "#fff9f0",
                    lineHeight: 1.15,
                  }}
                >
                  <span>Zavier Giordano Nathaniel</span>
                  <br />
                  <span style={{ fontSize: "clamp(14px, 2.2vw, 18px)", color: "rgba(255,249,240,0.5)", fontStyle: "italic" }}>
                    &amp;
                  </span>
                  <br />
                  <span>Alodie Oniria</span>
                </div>
              </div>
            </div>

            {/* Button area */}
            <div
              style={{
                padding: "28px 24px",
                textAlign: "center",
                background: "rgba(6,5,5,0.6)",
              }}
            >
              <button
                onClick={handleOpen}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "15px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#0d0b0a",
                  background: "#f0e6d6",
                  border: "none",
                  borderRadius: "999px",
                  padding: "14px 40px",
                  cursor: "pointer",
                  fontWeight: 600,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
                  transition: "transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.target as HTMLButtonElement).style.background = "#fff8ee";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.target as HTMLButtonElement).style.background = "#f0e6d6";
                }}
              >
                Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSITION SCREEN */}
      {screen === "transition" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "32px 24px",
            animation: "fadeIn 0.9s ease both",
          }}
        >
          {/* Glowing circles */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            {[240, 380, 540, 720].map((size, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "50%",
                  border: "1px solid rgba(240,230,214,0.12)",
                  animation: `bloom ${3.2 + i * 0.5}s ease infinite`,
                  animationDelay: `${i * 0.55}s`,
                  boxShadow: i === 0 ? "0 0 60px rgba(200,170,130,0.08), inset 0 0 60px rgba(200,170,130,0.04)" : "none",
                }}
              />
            ))}
          </div>

          {/* Sparkles */}
          {[
            { top: "16%", left: "18%", delay: "0.1s" },
            { top: "22%", right: "16%", delay: "0.7s" },
            { bottom: "18%", left: "22%", delay: "1.2s" },
            { bottom: "24%", right: "20%", delay: "1.8s" },
            { top: "50%", left: "10%", delay: "2.3s" },
            { top: "55%", right: "10%", delay: "2.9s" },
            { top: "35%", left: "32%", delay: "0.4s" },
            { top: "38%", right: "32%", delay: "1.5s" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(240,230,214,0.85)",
                boxShadow: "0 0 12px rgba(240,230,214,0.7), 0 0 24px rgba(240,230,214,0.3)",
                animation: "sparkle 4.2s ease-in-out infinite",
                animationDelay: pos.delay,
                ...pos,
              }}
            />
          ))}

          {/* Center glow */}
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,170,120,0.12) 0%, transparent 70%)",
              filter: "blur(20px)",
              animation: "centerPulse 4s ease-in-out infinite",
            }}
          />

          <div style={{ position: "relative", zIndex: 5, maxWidth: "700px" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "11px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(240,230,214,0.45)",
                marginBottom: "28px",
              }}
            >
              before we begin
            </p>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(26px, 5vw, 50px)",
                lineHeight: 1.35,
                fontWeight: 400,
                color: "rgba(255,249,240,0.92)",
                fontStyle: "italic",
                animation: "textFloat 3s ease-in-out infinite alternate",
              }}
            >
              <p style={{ margin: 0 }}>before the words begin</p>
              <p style={{ margin: "6px 0" }}>i want you to feel how loved you are.</p>
              <p style={{ margin: "6px 0" }}>not loudly, not perfectly,</p>
              <p style={{ margin: 0 }}>just honestly, gently, and completely.</p>
            </div>

            <div
              style={{
                width: "80px",
                height: "1px",
                background: "rgba(240,230,214,0.25)",
                margin: "36px auto",
              }}
            />

            <button
              onClick={handleStartReading}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "14px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#0d0b0a",
                background: "#f0e6d6",
                border: "none",
                borderRadius: "999px",
                padding: "13px 38px",
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.target as HTMLButtonElement).style.background = "#fff8ee";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.background = "#f0e6d6";
              }}
            >
              Start Reading
            </button>
          </div>
        </div>
      )}

      {/* SLIDES SCREEN */}
      {screen === "slides" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            animation: "fadeIn 0.7s ease both",
          }}
        >
          <div
            style={{
              width: "min(100%, 820px)",
              borderRadius: "28px",
              padding: "clamp(28px, 5vw, 52px)",
              background: "rgba(12,10,9,0.72)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              position: "relative",
            }}
          >
            {/* Inner frame */}
            <div
              style={{
                position: "absolute",
                inset: "14px",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "22px",
                pointerEvents: "none",
              }}
            />

            {/* Progress dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "36px",
              }}
            >
              {slides.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === slideIndex ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: i === slideIndex ? "rgba(240,230,214,0.9)" : "rgba(240,230,214,0.2)",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>

            {/* Slide content */}
            <div
              key={slideIndex}
              style={{
                textAlign: "center",
                minHeight: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: "slideIn 0.5s ease both",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "11px",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: "rgba(240,230,214,0.4)",
                  marginBottom: "20px",
                }}
              >
                {slides[slideIndex].label}
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 5.5vw, 56px)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#fff9f0",
                  marginBottom: "24px",
                }}
              >
                {slides[slideIndex].heading}
              </h2>
              <div
                style={{
                  width: "60px",
                  height: "1px",
                  background: "rgba(240,230,214,0.2)",
                  margin: "0 auto 24px",
                }}
              />
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(22px, 3.8vw, 32px)",
                  lineHeight: 1.48,
                  color: "rgba(255,249,240,0.88)",
                  maxWidth: "640px",
                  margin: "0 auto",
                }}
              >
                {slides[slideIndex].body}
              </p>
            </div>

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                marginTop: "44px",
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(240,230,214,0.7)",
                  background: "transparent",
                  border: "1px solid rgba(240,230,214,0.2)",
                  borderRadius: "999px",
                  padding: "11px 28px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#f0e6d6";
                  (e.target as HTMLButtonElement).style.borderColor = "rgba(240,230,214,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = "rgba(240,230,214,0.7)";
                  (e.target as HTMLButtonElement).style.borderColor = "rgba(240,230,214,0.2)";
                }}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#0d0b0a",
                  background: "#f0e6d6",
                  border: "none",
                  borderRadius: "999px",
                  padding: "12px 32px",
                  cursor: "pointer",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                  transition: "transform 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.target as HTMLButtonElement).style.background = "#fff8ee";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.target as HTMLButtonElement).style.background = "#f0e6d6";
                }}
              >
                {slideIndex === slides.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLOSING SCREEN */}
      {screen === "closing" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "32px 24px",
            animation: "fadeIn 1s ease both",
          }}
        >
          {/* Closing ambient circles */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            {[200, 340, 500].map((size, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "50%",
                  border: "1px solid rgba(240,230,214,0.08)",
                  animation: `bloom ${3.5 + i * 0.6}s ease infinite`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>

          {/* Subtle sparkles */}
          {[
            { top: "20%", left: "15%", delay: "0.2s" },
            { top: "25%", right: "14%", delay: "1s" },
            { bottom: "22%", left: "18%", delay: "1.6s" },
            { bottom: "20%", right: "16%", delay: "2.2s" },
            { top: "48%", left: "8%", delay: "0.6s" },
            { top: "52%", right: "8%", delay: "1.9s" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(240,230,214,0.7)",
                boxShadow: "0 0 8px rgba(240,230,214,0.5)",
                animation: "sparkle 4.5s ease-in-out infinite",
                animationDelay: pos.delay,
                ...pos,
              }}
            />
          ))}

          <div style={{ position: "relative", zIndex: 5, maxWidth: "700px" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "11px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(240,230,214,0.4)",
                marginBottom: "24px",
              }}
            >
              and so
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(38px, 7vw, 74px)",
                fontWeight: 700,
                lineHeight: 0.97,
                letterSpacing: "-0.04em",
                color: "#fff9f0",
                marginBottom: "28px",
                animation: "textFloat 3s ease-in-out infinite alternate",
              }}
            >
              Thank You
              <br />
              for Reading
            </h2>

            <div
              style={{
                width: "80px",
                height: "1px",
                background: "rgba(240,230,214,0.2)",
                margin: "0 auto 28px",
              }}
            />

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(20px, 3.5vw, 30px)",
                lineHeight: 1.5,
                color: "rgba(255,249,240,0.82)",
                maxWidth: "620px",
                margin: "0 auto 12px",
              }}
            >
              I am happy. Truly, quietly, completely happy — because of you.
              I am proud to have you, grateful you chose me, and I promise
              I will keep showing up for this, for us, every single day.
            </p>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(18px, 3vw, 26px)",
                color: "rgba(255,249,240,0.55)",
                marginBottom: "0",
              }}
            >
              — Zavier
            </p>

            {/* Hidden message unlock */}
            {!secretUnlocked ? (
              <div style={{ marginTop: "36px" }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "13px",
                    letterSpacing: "0.14em",
                    color: "rgba(240,230,214,0.22)",
                    marginBottom: "10px",
                    userSelect: "none",
                  }}
                >
                  there is one more thing, just for you.
                </p>
                <input
                  type="text"
                  placeholder="who are you?"
                  value={secretInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSecretInput(val);
                    if (val.trim().toLowerCase() === "alodie") {
                      setSecretUnlocked(true);
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(240,230,214,0.15)",
                    color: "rgba(240,230,214,0.55)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "16px",
                    letterSpacing: "0.12em",
                    textAlign: "center",
                    width: "180px",
                    padding: "6px 4px",
                    outline: "none",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  marginTop: "36px",
                  animation: "secretReveal 1.1s ease both",
                  padding: "28px 24px",
                  borderRadius: "20px",
                  background: "rgba(240,230,214,0.04)",
                  border: "1px solid rgba(240,230,214,0.1)",
                  maxWidth: "580px",
                  margin: "36px auto 0",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11px",
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    color: "rgba(240,230,214,0.35)",
                    marginBottom: "18px",
                  }}
                >
                  only for you, Alodie
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(20px, 3.4vw, 28px)",
                    lineHeight: 1.55,
                    color: "rgba(255,249,240,0.88)",
                  }}
                >
                  You are the part of my life I will never stop being grateful for.
                  Not just today, not just when it is easy — always.
                  I love you more than I know how to say,
                  so I wrote all of this instead.
                  <br /><br />
                  You deserve every good thing.
                  And I intend to be one of them.
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(16px, 2.6vw, 22px)",
                    color: "rgba(240,230,214,0.4)",
                    marginTop: "18px",
                  }}
                >
                  — yours, completely.
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                marginTop: "40px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleClosingBack}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(240,230,214,0.7)",
                  background: "transparent",
                  border: "1px solid rgba(240,230,214,0.2)",
                  borderRadius: "999px",
                  padding: "11px 28px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#f0e6d6";
                  (e.target as HTMLButtonElement).style.borderColor = "rgba(240,230,214,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = "rgba(240,230,214,0.7)";
                  (e.target as HTMLButtonElement).style.borderColor = "rgba(240,230,214,0.2)";
                }}
              >
                Back
              </button>

              <button
                onClick={handleReadAgain}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#0d0b0a",
                  background: "#f0e6d6",
                  border: "none",
                  borderRadius: "999px",
                  padding: "12px 32px",
                  cursor: "pointer",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                  transition: "transform 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.target as HTMLButtonElement).style.background = "#fff8ee";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.target as HTMLButtonElement).style.background = "#f0e6d6";
                }}
              >
                Read Again
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Playfair+Display:wght@500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; }

        @keyframes coverRise {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bloom {
          0% { transform: scale(0.5); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        @keyframes sparkle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-16px) scale(1.6); opacity: 1; }
        }

        @keyframes textFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-7px); }
        }

        @keyframes centerPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes secretReveal {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        input::placeholder { color: rgba(240,230,214,0.2); }

        button:focus { outline: none; }
      `}</style>
    </div>
  );
}
