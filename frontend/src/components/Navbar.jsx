import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import pdeuLogo from "../assets/images/pdeu_new_logo.png"
import sportsLogo from "../assets/images/sports-logo.png"

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    setMenuOpen(false)
    navigate("/login")
  }

  return (
    <nav style={navbar}>
      <div style={left} onClick={() => navigate("/")} className="pointer-link">
        <img src={pdeuLogo} alt="PDEU" style={logo} className="navbar-logo-main" />
      </div>
      
      <div style={right}>
        {/* Navigation Links — desktop */}
        <div style={navLinks} className="desktop-only">
          {token && (
            <>
              {(role === "admin" || role === "manager") && (
                <Link to={`/${role}`} style={linkStyle}>Dashboard</Link>
              )}
              <button onClick={handleLogout} style={navBtn}>Logout</button>
            </>
          )}
        </div>

        <img src={sportsLogo} alt="Sports" style={logo2} className="navbar-logo-sports" />

        {/* Hamburger for mobile */}
        {token && (
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={mobileMenu} className="animate-fade">
          {(role === "admin" || role === "manager") && (
            <Link
              to={`/${role}`}
              style={mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-gauge" style={{ marginRight: 8, width: 16 }} />
              Dashboard
            </Link>
          )}
          <button onClick={handleLogout} style={mobileLogoutBtn}>
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 8, width: 16 }} />
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

const navbar = {
  background: "#a6192e",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 30px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  flexWrap: "wrap"
}

const left = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer"
}

const right = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
}

const navLinks = {
  alignItems: "center",
  gap: "20px"
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "opacity 0.2s"
}

const navBtn = {
  background: "white",
  color: "#a6192e",
  border: "none",
  padding: "8px 18px",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s"
}

const logo = {
  maxWidth: "250px",
  width: "100%",
  height: "auto",
  maxHeight: "80px",
  objectFit: "contain"
}

const logo2 = {
  maxWidth: "200px",
  width: "100%",
  height: "auto",
  maxHeight: "120px",
  objectFit: "contain"
}

/* Mobile dropdown */
const mobileMenu = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "12px 0 4px",
  borderTop: "1px solid rgba(255,255,255,0.2)",
  marginTop: "8px"
}

const mobileLink = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "15px",
  padding: "10px 12px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  transition: "background 0.2s"
}

const mobileLogoutBtn = {
  background: "rgba(255,255,255,0.15)",
  color: "white",
  border: "none",
  padding: "10px 12px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  transition: "background 0.2s"
}

export default Navbar