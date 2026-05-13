import { Link, useNavigate, useLocation } from "react-router-dom"

function SubBar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const token = localStorage.getItem("token")
  const role  = localStorage.getItem("role")
  const name  = localStorage.getItem("name")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    navigate("/")
    window.location.reload()
  }

  const dashboardLink = () => {
    if (role === "admin")   return { path: "/admin",   label: "Admin Panel" }
    if (role === "manager") return { path: "/manager", label: "Manager Panel" }
    return { path: "/profile", label: "My Profile" }
  }

  const dash = dashboardLink()

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path
    return isActive ? activeLink : link
  }

  return (
    <div style={subBar}>

      {/* LEFT — nav links */}
      <div style={left}>
        <Link to="/" style={getLinkStyle("/")}>Home</Link>
        <Link to="/events" style={getLinkStyle("/events")}>Events</Link>
      </div>

      {/* CENTER — live match badge */}
      <div style={center}>
        <Link to="/live" style={liveBadge}>
          <span style={pulseDot}></span>
          Live Match
        </Link>
      </div>

      {/* RIGHT – auth area */}
      <div style={{ textAlign: "right" }}>
        {!token ? (
          <div style={right}>
            <Link to="/login" style={btnOutline}>Login</Link>
            <Link to="/register" style={btn}>Register</Link>
          </div>
        ) : (
          <div style={right}>
            <span style={greeting}>Hello, {name}</span>
            <Link to={dash.path} style={btnSecondary}>{dash.label}</Link>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </div>
        )}
      </div>

    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────
const subBar = {
  position: "relative",
  background: "#f5f0e6",
  padding: "14px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(166, 25, 46, 0.2)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
}
const left    = { display: "flex", gap: "35px", alignItems: "center", flex: 1 }
const center  = { display: "flex", justifyContent: "center", flex: 1 }
const right   = { display: "flex", gap: "15px", alignItems: "center", flex: 1, justifyContent: "flex-end" }

const link    = { textDecoration: "none", color: "#666", fontWeight: "500", transition: "color 0.2s" }
const activeLink = { ...link, color: "#a6192e", fontWeight: "700", borderBottom: "2px solid #a6192e", paddingBottom: "2px" }

const liveBadge = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textDecoration: "none",
  color: "#ff4e50",
  fontWeight: "700",
  fontSize: "14px",
  background: "rgba(255, 78, 80, 0.08)",
  padding: "6px 14px",
  borderRadius: "30px",
  border: "1px solid rgba(255, 78, 80, 0.2)",
  transition: "all 0.2s",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
}

const pulseDot = {
  width: "8px",
  height: "8px",
  background: "#ff4e50",
  borderRadius: "50%",
  display: "inline-block",
  animation: "pulse 1.5s infinite"
}

const btn     = { background: "#a6192e", color: "white", padding: "8px 18px", borderRadius: "20px", textDecoration: "none", fontWeight: "600", fontSize: "14px", transition: "all 0.2s" }
const btnSecondary = { ...btn, background: "#333" }
const btnOutline = { border: "1px solid #ccc", background: "white", color: "#333", padding: "8px 18px", borderRadius: "20px", textDecoration: "none", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" }

const greeting = { color: "#333", fontWeight: "600", fontSize: "14px" }
const logoutBtn = { background: "transparent", border: "1px solid #a6192e", color: "#a6192e", padding: "8px 18px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s" }

export default SubBar