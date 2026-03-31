import { useState, useEffect } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";

const typeIcons = {
  youtube: "▶",
  website: "🌐",
  course: "📚",
  article: "📄",
};

const typeColors = {
  youtube: "#ff4444",
  website: "#4fc3f7",
  course: "#ffd54f",
  article: "#a5d6a7",
};

function StarField() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            background: `rgba(255,255,255,${Math.random() * 0.5 + 0.1})`,
            borderRadius: "50%",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: Math.random() * 4 + "s",
          }}
        />
      ))}
    </div>
  );
}

function InputScreen({ formData, setFormData, onGenerate, loading }) {
  const [focused, setFocused] = useState(null);

  const fields = [
    {
      key: "goal",
      label: "What's your goal?",
      placeholder: "e.g. Learn DSA basics, Build a startup, Get fit in 3 months...",
      type: "textarea",
      required: true,
    },
    {
      key: "currentLevel",
      label: "Your current level / background",
      placeholder: "e.g. Beginner Python coder, No experience, 2 years of gym...",
      type: "textarea",
    },
    {
      key: "timeAvailable",
      label: "Time you can dedicate",
      placeholder: "e.g. 2 hours daily, weekends only, 1 month total...",
      type: "input",
    },
    {
      key: "preferences",
      label: "Preferences or constraints (optional)",
      placeholder: "e.g. Free resources only, prefer videos, have a job...",
      type: "input",
    },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{
          display: "inline-block",
          fontSize: 13,
          letterSpacing: "0.3em",
          color: "#4fc3f7",
          fontFamily: "'Space Mono', monospace",
          marginBottom: 20,
          padding: "6px 16px",
          border: "1px solid rgba(79,195,247,0.3)",
          borderRadius: 2,
          background: "rgba(79,195,247,0.05)",
        }}>
          GOAL NAVIGATOR
        </div>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: "#f0f4f8",
          lineHeight: 1.1,
          margin: "0 0 16px",
          letterSpacing: "-0.02em",
        }}>
          What should you<br />
          <span style={{ color: "#4fc3f7", fontStyle: "italic" }}>do next?</span>
        </h1>
        <p style={{
          color: "rgba(240,244,248,0.5)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          margin: 0,
          lineHeight: 1.6,
        }}>
          Tell us your goal. We'll map the exact path to get there — step by step, with resources at every turn.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {fields.map((field) => {
          const isFocused = focused === field.key;
          const baseStyle = {
            width: "100%",
            background: isFocused ? "rgba(79,195,247,0.06)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${isFocused ? "rgba(79,195,247,0.5)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 8,
            color: "#f0f4f8",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            padding: "14px 18px",
            outline: "none",
            transition: "all 0.2s",
            resize: "none",
            boxSizing: "border-box",
            boxShadow: isFocused ? "0 0 0 3px rgba(79,195,247,0.1), inset 0 1px 3px rgba(0,0,0,0.2)" : "inset 0 1px 3px rgba(0,0,0,0.2)",
          };

          return (
            <div key={field.key}>
              <label style={{
                display: "block",
                color: isFocused ? "#4fc3f7" : "rgba(240,244,248,0.6)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                marginBottom: 8,
                transition: "color 0.2s",
              }}>
                {field.label.toUpperCase()}{field.required && " *"}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={formData[field.key]}
                  placeholder={field.placeholder}
                  onChange={(e) => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused(null)}
                  style={{ ...baseStyle, lineHeight: 1.6 }}
                  className="input-field"
                />
              ) : (
                <input
                  value={formData[field.key]}
                  placeholder={field.placeholder}
                  onChange={(e) => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused(null)}
                  style={{ ...baseStyle, height: 52 }}
                  className="input-field"
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onGenerate}
        disabled={!formData.goal.trim() || loading}
        style={{
          marginTop: 32,
          width: "100%",
          padding: "18px 32px",
          background: formData.goal.trim() ? "linear-gradient(135deg, #4fc3f7, #0288d1)" : "rgba(255,255,255,0.06)",
          border: "none",
          borderRadius: 8,
          color: formData.goal.trim() ? "#000" : "rgba(255,255,255,0.2)",
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          letterSpacing: "0.15em",
          cursor: formData.goal.trim() ? "pointer" : "not-allowed",
          transition: "all 0.3s",
          fontWeight: 700,
          boxShadow: formData.goal.trim() ? "0 4px 24px rgba(79,195,247,0.3)" : "none",
          transform: "translateY(0)",
        }}
        onMouseEnter={(e) => { if (formData.goal.trim()) e.target.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
      >
        {loading ? "CHARTING YOUR PATH..." : "→ GENERATE MY ROADMAP"}
      </button>
    </div>
  );
}

function LoadingScreen({ goal }) {
  const [dots, setDots] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = [
    "Analyzing your goal",
    "Mapping optimal steps",
    "Searching for resources",
    "Building your roadmap",
  ];

  useEffect(() => {
    const d = setInterval(() => setDots(p => (p + 1) % 4), 400);
    const p = setInterval(() => setPhase(p => (p + 1) % phases.length), 2200);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: 24,
      textAlign: "center",
    }}>
      <div style={{ position: "relative", marginBottom: 48 }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "2px solid rgba(79,195,247,0.15)",
          position: "relative",
          animation: "spin 3s linear infinite",
        }}>
          <div style={{
            position: "absolute",
            inset: -2,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#4fc3f7",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{
            position: "absolute",
            inset: 14,
            borderRadius: "50%",
            border: "1px solid rgba(79,195,247,0.3)",
            borderBottomColor: "#ffd54f",
            animation: "spin 2s linear infinite reverse",
          }} />
          <div style={{
            position: "absolute",
            inset: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 28,
          }}>🗺️</div>
        </div>
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12,
        color: "#4fc3f7",
        letterSpacing: "0.2em",
        marginBottom: 12,
      }}>
        {phases[phase]}{"." .repeat(dots + 1)}
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22,
        color: "rgba(240,244,248,0.6)",
        maxWidth: 400,
        fontStyle: "italic",
      }}>
        "{goal}"
      </div>
    </div>
  );
}

function ResourceLink({ resource }) {
  const type = resource.type || "website";
  const color = typeColors[type] || "#4fc3f7";
  const icon = typeIcons[type] || "🔗";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 6,
        textDecoration: "none",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `rgba(${type === "youtube" ? "255,68,68" : "79,195,247"},0.07)`;
        e.currentTarget.style.borderColor = color + "55";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      <span style={{
        fontSize: 11,
        padding: "3px 8px",
        background: color + "22",
        color: color,
        borderRadius: 3,
        fontFamily: "'Space Mono', monospace",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {icon} {type.toUpperCase()}
      </span>
      <div>
        <div style={{
          color: "#f0f4f8",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.3,
          marginBottom: 3,
        }}>
          {resource.title}
        </div>
        {resource.description && (
          <div style={{
            color: "rgba(240,244,248,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            lineHeight: 1.4,
          }}>
            {resource.description}
          </div>
        )}
      </div>
    </a>
  );
}

function StepCard({ step, index, total }) {
  const [expanded, setExpanded] = useState(index === 0);
  const isLast = index === total - 1;

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: expanded ? "linear-gradient(135deg,#4fc3f7,#0288d1)" : "rgba(79,195,247,0.15)",
          border: `2px solid ${expanded ? "#4fc3f7" : "rgba(79,195,247,0.25)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          color: expanded ? "#000" : "#4fc3f7",
          transition: "all 0.3s",
          flexShrink: 0,
          zIndex: 1,
          boxShadow: expanded ? "0 0 16px rgba(79,195,247,0.4)" : "none",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        {!isLast && (
          <div style={{
            width: 1,
            flex: 1,
            minHeight: 20,
            background: "linear-gradient(to bottom, rgba(79,195,247,0.3), rgba(79,195,247,0.05))",
            margin: "4px 0",
          }} />
        )}
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        marginLeft: 16,
        marginBottom: isLast ? 0 : 20,
        background: expanded ? "rgba(79,195,247,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${expanded ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "all 0.3s",
      }}>
        {/* Header */}
        <button
          onClick={() => setExpanded(p => !p)}
          style={{
            width: "100%",
            padding: "16px 20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            textAlign: "left",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#f0f4f8",
              lineHeight: 1.3,
              marginBottom: 4,
            }}>
              {step.title}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {step.duration && (
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "#ffd54f",
                  padding: "2px 8px",
                  background: "rgba(255,213,79,0.1)",
                  borderRadius: 3,
                  letterSpacing: "0.05em",
                }}>
                  ⏱ {step.duration}
                </span>
              )}
              {step.resources?.length > 0 && (
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "rgba(240,244,248,0.35)",
                  padding: "2px 8px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 3,
                }}>
                  {step.resources.length} resources
                </span>
              )}
            </div>
          </div>
          <span style={{
            color: "#4fc3f7",
            fontSize: 18,
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.25s",
            flexShrink: 0,
            marginTop: 2,
          }}>›</span>
        </button>

        {expanded && (
          <div style={{ padding: "0 20px 20px" }}>
            <p style={{
              color: "rgba(240,244,248,0.65)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              lineHeight: 1.7,
              margin: "0 0 16px",
            }}>
              {step.description}
            </p>

            {step.topics?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "rgba(240,244,248,0.3)",
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}>TOPICS COVERED</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {step.topics.map((topic, i) => (
                    <span key={i} style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: "rgba(240,244,248,0.6)",
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step.resources?.length > 0 && (
              <div style={{ marginBottom: step.tips ? 16 : 0 }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "rgba(240,244,248,0.3)",
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}>RESOURCES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {step.resources.map((r, i) => (
                    <ResourceLink key={i} resource={r} />
                  ))}
                </div>
              </div>
            )}

            {step.tips && (
              <div style={{
                marginTop: 16,
                padding: "12px 16px",
                background: "rgba(255,213,79,0.06)",
                border: "1px solid rgba(255,213,79,0.15)",
                borderRadius: 6,
                display: "flex",
                gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>💡</span>
                <div style={{
                  color: "rgba(255,213,79,0.8)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}>
                  {step.tips}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ plan, goal, onReset }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <button
          onClick={onReset}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4,
            color: "rgba(240,244,248,0.4)",
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "6px 14px",
            cursor: "pointer",
            marginBottom: 32,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.target.style.color = "#4fc3f7"; e.target.style.borderColor = "rgba(79,195,247,0.3)"; }}
          onMouseLeave={(e) => { e.target.style.color = "rgba(240,244,248,0.4)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ← NEW GOAL
        </button>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: "#4fc3f7",
          letterSpacing: "0.2em",
          marginBottom: 12,
        }}>
          YOUR ROADMAP
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 4vw, 42px)",
          fontWeight: 700,
          color: "#f0f4f8",
          margin: "0 0 12px",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          {plan.title}
        </h2>
        <p style={{
          color: "rgba(240,244,248,0.5)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          lineHeight: 1.6,
          margin: "0 0 20px",
        }}>
          {plan.summary}
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{
            padding: "8px 16px",
            background: "rgba(255,213,79,0.08)",
            border: "1px solid rgba(255,213,79,0.2)",
            borderRadius: 6,
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: "#ffd54f",
            letterSpacing: "0.08em",
          }}>
            ⏱ {plan.totalDuration}
          </div>
          <div style={{
            padding: "8px 16px",
            background: "rgba(79,195,247,0.08)",
            border: "1px solid rgba(79,195,247,0.2)",
            borderRadius: 6,
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: "#4fc3f7",
            letterSpacing: "0.08em",
          }}>
            {plan.steps?.length} STEPS
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: "linear-gradient(to right, rgba(79,195,247,0.3), transparent)",
        marginBottom: 40,
      }} />

      {/* Steps */}
      <div>
        {plan.steps?.map((step, i) => (
          <StepCard key={step.id || i} step={step} index={i} total={plan.steps.length} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 60,
        padding: "24px",
        background: "rgba(79,195,247,0.04)",
        border: "1px solid rgba(79,195,247,0.12)",
        borderRadius: 10,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 24, marginBottom: 10 }}>🎯</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          color: "#f0f4f8",
          marginBottom: 8,
          fontStyle: "italic",
        }}>
          Your path is set. Now execute.
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "rgba(240,244,248,0.35)",
        }}>
          Consistency beats perfection. Start with Step 01.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("input");
  const [formData, setFormData] = useState({
    goal: "",
    currentLevel: "",
    timeAvailable: "",
    preferences: "",
  });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const generatePlan = async () => {
    setError(null);
    setScreen("loading");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are an expert learning coach and goal planner. Create a detailed, optimized step-by-step roadmap.

You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no explanation. Exactly this structure:
{
  "title": "Short compelling plan title",
  "summary": "2-sentence overview of the plan and approach",
  "totalDuration": "e.g. 8-12 weeks",
  "steps": [
    {
      "id": 1,
      "title": "Step title",
      "description": "2-3 sentences of what to do, why, and how in this step",
      "duration": "e.g. 1 week",
      "topics": ["topic1", "topic2", "topic3"],
      "resources": [
        {
          "title": "Resource name",
          "url": "https://actual-url.com",
          "type": "youtube OR website OR course OR article",
          "description": "One line on why this helps"
        }
      ],
      "tips": "One actionable pro tip for this step"
    }
  ]
}

Rules:
- 5-9 steps total, progressing from basics to advanced
- Use web search to find REAL YouTube videos and websites — include actual working URLs
- 2-3 resources per step
- Be specific and actionable, not generic
- Output ONLY the JSON object`,
          messages: [{
            role: "user",
            content: `Create my roadmap:
Goal: ${formData.goal}
Current level: ${formData.currentLevel || "Not specified"}
Time available: ${formData.timeAvailable || "Not specified"}
Preferences: ${formData.preferences || "None"}

Search for real YouTube videos and actual websites for resources at each step.`,
          }],
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "API error");

      const text = data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON in response");

      const parsed = JSON.parse(jsonMatch[0]);
      setPlan(parsed);
      setScreen("results");
    } catch (err) {
      setError(err.message);
      setScreen("input");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500&family=Space+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          background: #070d17;
          color: #f0f4f8;
          min-height: 100vh;
        }
        
        ::placeholder { color: rgba(240,244,248,0.2) !important; }
        
        .input-field::placeholder { color: rgba(240,244,248,0.2) !important; }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.2); border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 50%, rgba(2,136,209,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(79,195,247,0.05) 0%, transparent 50%), #070d17",
        position: "relative",
      }}>
        <StarField />

        <div style={{ position: "relative", zIndex: 1 }}>
          {error && (
            <div style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,68,68,0.15)",
              border: "1px solid rgba(255,68,68,0.3)",
              borderRadius: 8,
              padding: "12px 20px",
              color: "#ff6b6b",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              zIndex: 100,
              maxWidth: 500,
              textAlign: "center",
            }}>
              ⚠ {error}
            </div>
          )}

          {screen === "input" && (
            <InputScreen
              formData={formData}
              setFormData={setFormData}
              onGenerate={generatePlan}
              loading={false}
            />
          )}

          {screen === "loading" && <LoadingScreen goal={formData.goal} />}

          {screen === "results" && plan && (
            <ResultsScreen
              plan={plan}
              goal={formData.goal}
              onReset={() => { setScreen("input"); setPlan(null); }}
            />
          )}
        </div>
      </div>
    </>
  );
}
