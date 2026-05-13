import { useNavigate, Link } from "react-router-dom"
import pdeuLogo from "../assets/images/pdeu_new_logo.png"
import sportsLogo from "../assets/images/sports-logo.png"

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    navigate("/login")
  }

  return (
    <nav style={navbar}>
      <div style={left} onClick={() => navigate("/")} className="pointer-link">
        <img src={pdeuLogo} alt="PDEU" style={logo} />
      </div>
      
      <div style={right}>
        {/* Navigation Links */}
        <div style={navLinks}>
          {token && (
            <>
              {(role === "admin" || role === "manager") && (
                <Link to={`/${role}`} style={linkStyle}>Dashboard</Link>
              )}
              <button onClick={handleLogout} style={navBtn}>Logout</button>
            </>
          )}
        </div>

        <img src={sportsLogo} alt="Sports" style={logo2} />
      </div>
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
  zIndex: 1000
}

const left = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer"
}

const right = {
  display: "flex",
  alignItems: "center",
  gap: "30px"
}

const navLinks = {
  display: "flex",
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
  width: "250px",
  height: "80px",
  objectFit: "contain"
}

const logo2 = {
  width: "200px",
  height: "120px",
  objectFit: "contain"
}

export default Navbar