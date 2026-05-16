import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import campusBg from "../assets/images/campus-bg.jpeg"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [])
  const handleLogin = async () => {
    if (!email || !password) return alert("All fields required")
    try {
      setLoading(true)
      const res = await API.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name)
      if (res.data.role === "admin") navigate("/admin")
      else if (res.data.role === "manager") navigate("/manager")
      else navigate("/")
    } catch (err) {
      alert(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageWrapper}>
      {/* Full-page background */}
      <div style={bgLayer} />
      <div style={overlayLayer} />

      {/* Centered glass card */}
      <div className="animate-fade" style={glassCard}>
        {/* Logo / brand */}
        <div style={brandRow}>
          <div style={brandDot} />
          <span style={brandText}>PDEU Sports</span>
        </div>

        <h1 style={title}>Welcome Back</h1>
        <p style={subtitle}>Sign in to your account to continue</p>

        <div style={fieldGroup}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@pdeu.ac.in"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputBlur)}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, inputBlur)}
            />
            <span
              style={eyeStyle}
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
            >
              <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
            </span>
          </div>
        </div>

        <button
          onClick={handleLogin}
          style={loading ? { ...btnStyle, opacity: 0.7 } : btnStyle}
          disabled={loading}
        >
          {loading ? (
            <span>Signing in…</span>
          ) : (
            <span>Login &nbsp;<i className="fa-solid fa-arrow-right-long" /></span>
          )}
        </button>

        <p style={footerText}>
          Don't have an account?{" "}
          <a href="/register" style={linkStyle}>Create one</a>
        </p>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────
const pageWrapper = {
  position: "relative",
  minHeight: "calc(100vh - 150px)",
  overflow: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
}

const bgLayer = {
  position: "fixed",
  inset: 0,
  backgroundImage: `url(${campusBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 0,
}

const overlayLayer = {
  position: "fixed",
  inset: 0,
  background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(166,25,46,0.35) 100%)",
  backdropFilter: "blur(2px)",
  zIndex: 1,
}

const glassCard = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "440px",
  maxHeight: "calc(100vh - 40px)",
  overflowY: "auto",
  background: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "clamp(16px, 3vw, 24px)",
  padding: "clamp(24px, 5vw, 40px)",
  boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
  scrollbarWidth: "none",
}

const brandRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "28px",
}

const brandDot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#a6192e",
  boxShadow: "0 0 8px #a6192e",
}

const brandText = {
  fontSize: "14px",
  fontWeight: "600",
  color: "rgba(255,255,255,0.7)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
}

const title = {
  fontSize: "clamp(24px, 5vw, 32px)",
  fontWeight: "700",
  color: "#ffffff",
  letterSpacing: "-0.02em",
  marginBottom: "8px",
  lineHeight: 1.1,
}

const subtitle = {
  fontSize: "clamp(13px, 2vw, 15px)",
  color: "rgba(255,255,255,0.55)",
  marginBottom: "32px",
}

const fieldGroup = { marginBottom: "18px" }

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "rgba(255,255,255,0.65)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "8px",
}

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
}

const inputFocus = {
  borderColor: "rgba(166,25,46,0.8)",
  background: "rgba(255,255,255,0.13)",
}

const inputBlur = {
  borderColor: "rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
}

const eyeStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "rgba(255,255,255,0.5)",
  fontSize: "16px",
}

const btnStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  background: "linear-gradient(135deg, #a6192e, #c0202e)",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  letterSpacing: "0.02em",
  boxShadow: "0 8px 24px rgba(166,25,46,0.45)",
  transition: "transform 0.15s, box-shadow 0.15s",
}

const footerText = {
  marginTop: "22px",
  textAlign: "center",
  fontSize: "14px",
  color: "rgba(255,255,255,0.5)",
}

const linkStyle = {
  color: "#ff6b7a",
  fontWeight: "600",
  textDecoration: "none",
}

export default Login