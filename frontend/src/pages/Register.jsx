import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import campusBg from "../assets/images/campus-bg.jpeg"

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    roll_no: "", university_name: "", university_code: "", gender: ""
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isPDEU = form.email.endsWith("@pdpu.ac.in") || form.email.endsWith("@pdeu.ac.in")

  const handleChange = (e) => {
    const { name, value } = e.target
    let updated = { ...form, [name]: value }
    if (name === "email") {
      const pdeu = value.endsWith("@pdpu.ac.in") || value.endsWith("@pdeu.ac.in")
      if (pdeu) {
        updated.university_name = "Pandit Deendayal Energy University"
        updated.university_code = ""
      } else if (form.university_name === "Pandit Deendayal Energy University" || form.university_name === "PDEU") {
        updated.university_name = ""
      }
    }
    setForm(updated)
  }

  const handleSubmit = async () => {
    const { name, email, password, phone, gender, university_name } = form
    if (!name || !email || !password || !phone || !gender || !university_name) {
      return alert("All required fields must be filled")
    }
    if (password !== confirmPassword) return alert("Passwords do not match")
    if (!isPDEU && !form.university_code) return alert("University code is required for non-PDEU students")

    try {
      setLoading(true)
      const res = await API.post("/auth/register", form)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("role", res.data.role)
        localStorage.setItem("name", res.data.name)
        navigate("/")
      } else {
        alert(res.data.message)
        navigate("/login")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const twoColStyle = isMobile
    ? { display: "grid", gridTemplateColumns: "1fr", gap: "5px" }
    : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }

  return (
    <div style={pageWrapper}>
      {/* Full-page background */}
      <div style={bgLayer} />
      <div style={overlayLayer} />

      {/* Centered glass card */}
      <div className="animate-fade" style={glassCard}>
        {/* Brand */}
        <div style={brandRow}>
          <div style={brandDot} />
          <span style={brandText}>PDEU Sports</span>
        </div>

        <h1 style={title}>Create Account</h1>
        <p style={subtitle}>Join the PDEU Sports community</p>

        {/* Two-column row for Name & Phone */}
        <div style={twoColStyle}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Full Name *</label>
            <input name="name" onChange={handleChange} placeholder="John Doe" style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, inputBlur)} />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Phone *</label>
            <input name="phone" onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, inputBlur)} />
          </div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Email Address *</label>
          <input name="email" type="email" onChange={handleChange} placeholder="you@pdeu.ac.in" style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputBlur)} />
          {isPDEU && (
            <p style={pdeuBadge}>
              <i className="fa-solid fa-circle-check" /> PDEU email detected — you'll be auto approved
            </p>
          )}
        </div>

        {/* Two-column row for Roll No & Gender */}
        <div style={twoColStyle}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Roll No</label>
            <input name="roll_no" onChange={handleChange} placeholder="22CE001" style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, inputBlur)} />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Gender *</label>
            <div style={selectWrapper}>
              <select name="gender" onChange={handleChange} style={selectStyle}>
                <option value="" style={optionStyle}>Select</option>
                <option style={optionStyle}>Male</option>
                <option style={optionStyle}>Female</option>
                <option style={optionStyle}>Other</option>
              </select>
              <span style={selectArrow}>▾</span>
            </div>
          </div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>University *</label>
          <input
            name="university_name"
            value={form.university_name}
            onChange={handleChange}
            readOnly={isPDEU}
            placeholder="Your university name"
            style={{ ...inputStyle, background: isPDEU ? "rgba(46,125,50,0.2)" : "rgba(255,255,255,0.08)" }}
            onFocus={(e) => !isPDEU && Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => !isPDEU && Object.assign(e.target.style, inputBlur)}
          />
        </div>

        {!isPDEU && (
          <div style={fieldGroup}>
            <label style={labelStyle}>University Code *</label>
            <input name="university_code" onChange={handleChange} placeholder="Code provided by admin" style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, inputBlur)} />
          </div>
        )}

        {/* Two-column row for passwords */}
        <div style={twoColStyle}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Password *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, inputBlur)}
              />
              <span style={eyeStyle}
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}>
                <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
              </span>
            </div>
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Confirm Password *</label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, inputBlur)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={loading ? { ...btnStyle, opacity: 0.7 } : btnStyle}
          disabled={loading}
        >
          {loading ? "Registering…" : <span>Register &nbsp;<i className="fa-solid fa-arrow-right-long" /></span>}
        </button>

        <p style={footerText}>
          Already have an account?{" "}
          <a href="/login" style={linkStyle}>Sign in</a>
        </p>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────
const pageWrapper = {
  position: "relative",
  minHeight: "calc(100vh - 130px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
  overflow: "auto",
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
  maxWidth: "640px",
  maxHeight: "calc(100vh - 40px)",
  overflowY: "auto",
  background: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "clamp(16px, 3vw, 24px)",
  padding: "clamp(20px, 4vw, 30px)",
  boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
}

const brandRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "6px",
}

const brandDot = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#a6192e",
  boxShadow: "0 0 8px #a6192e",
}

const brandText = {
  fontSize: "12px",
  fontWeight: "600",
  color: "rgba(255,255,255,0.7)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
}

const title = {
  fontSize: "clamp(16px, 3vw, 18px)",
  fontWeight: "700",
  color: "#ffffff",
  letterSpacing: "-0.02em",
  marginBottom: "1px",
  lineHeight: 1.1,
}

const subtitle = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.55)",
  marginBottom: "8px",
}

const fieldGroup = { marginBottom: "5px" }

const labelStyle = {
  display: "block",
  fontSize: "10px",
  fontWeight: "600",
  color: "rgba(255,255,255,0.65)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "3px",
}

const inputStyle = {
  width: "100%",
  padding: "7px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, background 0.2s",
}

const selectWrapper = {
  position: "relative",
  width: "100%",
}

const selectStyle = {
  width: "100%",
  padding: "7px 36px 7px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "#2a1a1e",
  color: "#ffffff",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
}

const optionStyle = {
  background: "#2a1a1e",
  color: "#ffffff",
}

const selectArrow = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "rgba(255,255,255,0.5)",
  pointerEvents: "none",
  fontSize: "14px",
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
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "rgba(255,255,255,0.5)",
  fontSize: "15px",
}

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "16px",
  background: "linear-gradient(135deg, #a6192e, #c0202e)",
  color: "#ffffff",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  letterSpacing: "0.02em",
  boxShadow: "0 8px 24px rgba(166,25,46,0.45)",
  transition: "transform 0.15s, box-shadow 0.15s",
  flexShrink: 0,
}

const footerText = {
  marginTop: "16px",
  paddingBottom: "8px",
  textAlign: "center",
  fontSize: "13px",
  color: "rgba(255,255,255,0.5)",
  flexShrink: 0,
}

const linkStyle = {
  color: "#ff6b7a",
  fontWeight: "600",
  textDecoration: "none",
}

const pdeuBadge = {
  background: "rgba(46,125,50,0.25)",
  color: "#81c784",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  marginTop: "6px",
  border: "1px solid rgba(46,125,50,0.4)",
}

export default Register