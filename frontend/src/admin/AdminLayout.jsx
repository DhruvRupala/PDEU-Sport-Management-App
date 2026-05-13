import { NavLink, useNavigate } from "react-router-dom"

const navItems = [
  { path: "/admin",              label: "📊 Dashboard"         },
  { path: "/admin/users",        label: "👥 Users"             },
  { path: "/admin/managers",     label: "🧑‍💼 Managers"          },
  { path: "/admin/universities", label: "🏫 University Codes"   },
  { path: "/admin/events",       label: "🏆 Events"            },
  { path: "/admin/sports",       label: "⚽ Sports"            },
  { path: "/admin/matches",      label: "📅 Matches"           },
  { path: "/admin/results",      label: "🥇 Results"           },
]

function AdminLayout({ children }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
    window.location.reload()
  }

  return (
    <div style={wrapper}>

      {/* ── SIDEBAR ── */}
      <div style={sidebar}>
        <div style={sidebarTop}>
          <h3 style={sidebarTitle}>⚙️ Admin Panel</h3>
          <p style={sidebarSub}>PDEU Sports Portal</p>
        </div>

        <nav style={nav}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              style={({ isActive }) => isActive ? activeLink : navLink}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} style={logoutBtn}>
          🚪 Logout
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={main}>
        {children}
      </div>

    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────
const wrapper     = { display: "flex", minHeight: "100vh", background: "#f5f0e6" }
const sidebar     = { width: "240px", background: "#2a2a2a", color: "white", display: "flex", flexDirection: "column", padding: "0", minHeight: "100vh", position: "sticky", top: "0", height: "100vh" }
const sidebarTop  = { padding: "24px 20px 16px", borderBottom: "1px solid #444" }
const sidebarTitle= { margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "white" }
const sidebarSub  = { margin: "0", fontSize: "11px", color: "#aaa" }
const nav         = { display: "flex", flexDirection: "column", padding: "16px 0", flex: "1" }
const navLink     = { padding: "11px 20px", color: "#ccc", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "all 0.2s", borderLeft: "3px solid transparent" }
const activeLink  = { ...navLink, background: "rgba(166,25,46,0.2)", color: "white", borderLeft: "3px solid #a6192e" }
const main        = { flex: "1", padding: "30px", overflowY: "auto" }
const logoutBtn   = { margin: "16px", padding: "10px", background: "#a6192e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }

export default AdminLayout