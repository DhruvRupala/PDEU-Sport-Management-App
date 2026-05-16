import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import OverviewTab from "../admin/OverviewTab"
import EventsTab from "../admin/EventsTab"
import SportsTab from "../admin/SportsTab"
import UsersTab from "../admin/UsersTab"
import ManagersTab from "../admin/ManagersTab"
import CodesTab from "../admin/CodesTab"
import RegistrationsTab from "../admin/RegistrationsTab"

const TABS = [
  { key: "overview", label: "Overview", icon: "fa-chart-line" },
  { key: "events", label: "Events", icon: "fa-trophy" },
  { key: "sports", label: "Sports", icon: "fa-basketball" },
  { key: "users", label: "Users", icon: "fa-users" },
  { key: "managers", label: "Managers", icon: "fa-user-tie" },
  { key: "codes", label: "Uni Codes", icon: "fa-university" },
  { key: "registrations", label: "Registrations", icon: "fa-clipboard-list" },
]

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const role = localStorage.getItem("role")
  const name = localStorage.getItem("name")
  const navigate = useNavigate()

  useEffect(() => {
    if (role !== "admin" && role !== "manager") navigate("/")
  }, [role, navigate])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleTabClick = (key) => {
    setActiveTab(key)
  }

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />
      case "events": return <EventsTab />
      case "sports": return <SportsTab />
      case "users": return <UsersTab />
      case "managers": return <ManagersTab />
      case "codes": return <CodesTab />
      case "registrations": return <RegistrationsTab />
      default: return <OverviewTab />
    }
  }

  // Mobile: horizontal scrollable tabs
  if (isMobile) {
    return (
      <div style={{ background: "#f5f0e6", minHeight: "calc(100vh - 150px)" }}>
        {/* Mobile tab bar */}
        <div style={mobileTabBar}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => handleTabClick(t.key)}
              style={activeTab === t.key ? mobileTabActive : mobileTab}
            >
              <i className={`fa-solid ${t.icon}`} style={{ fontSize: 15 }} />
              <span style={{ fontSize: 10, marginTop: 2 }}>{t.label}</span>
            </button>
          ))}
        </div>

        <main style={mainMobile}>
          <div className="animate-fade" key={activeTab}>
            {renderTab()}
          </div>
        </main>
      </div>
    )
  }

  // Desktop: sidebar layout
  return (
    <div style={wrapper}>
      {/* ── SIDEBAR ── */}
      <aside style={{ ...sidebar, width: sidebarCollapsed ? "68px" : "260px" }}>
        <div style={profileSection}>
          <div style={avatar}>{name?.charAt(0)?.toUpperCase() || "A"}</div>
          {!sidebarCollapsed && (
            <div>
              <div style={adminName}>{name || "Admin"}</div>
              <div style={adminRole}>{role?.toUpperCase()}</div>
            </div>
          )}
        </div>

        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={collapseBtn}>
          <i className={`fa-solid fa-angles-${sidebarCollapsed ? "right" : "left"}`} />
        </button>

        <nav style={nav}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => handleTabClick(t.key)}
              style={activeTab === t.key ? activeBtn : navBtnStyle}
              title={t.label}
            >
              <i className={`fa-solid ${t.icon}`} style={{ width: "18px", flexShrink: 0 }} />
              {!sidebarCollapsed && <span>{t.label}</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div style={sidebarFooter}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#a6192e" }}>PDEU Sports</div>
            <div style={{ fontSize: "10px", color: "#777", marginTop: 2 }}>Admin Console v2.0</div>
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main style={main}>
        <div className="animate-fade" key={activeTab}>
          {renderTab()}
        </div>
      </main>
    </div>
  )
}

/* ── Styles ────────────────────────────────────────────────────── */
const wrapper = { display: "flex", minHeight: "calc(100vh - 150px)", background: "#f5f0e6" }

const sidebar = {
  background: "linear-gradient(180deg, #1a1520 0%, #231c2b 100%)",
  color: "#fff", display: "flex", flexDirection: "column",
  transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
  overflow: "hidden", position: "sticky", top: 0,
  borderRight: "1px solid rgba(166,25,46,0.15)",
  boxShadow: "4px 0 24px rgba(0,0,0,0.08)"
}

const profileSection = {
  display: "flex", alignItems: "center", gap: "12px",
  padding: "24px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)"
}

const avatar = {
  width: "38px", height: "38px", borderRadius: "10px",
  background: "linear-gradient(135deg, #a6192e, #d4213d)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "16px", fontWeight: 700, flexShrink: 0,
  boxShadow: "0 4px 12px rgba(166,25,46,0.4)"
}

const adminName = { fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }
const adminRole = { fontSize: "10px", color: "#a6192e", fontWeight: 600, letterSpacing: "0.08em" }

const collapseBtn = {
  background: "none", border: "none", color: "rgba(255,255,255,0.4)",
  padding: "8px 16px", cursor: "pointer", textAlign: "left", fontSize: "12px",
  transition: "color 0.2s"
}

const nav = { display: "flex", flexDirection: "column", padding: "8px 8px", flex: 1, gap: "2px" }

const navBtnBase = {
  display: "flex", alignItems: "center", gap: "12px",
  padding: "11px 14px", border: "none", borderRadius: "10px",
  cursor: "pointer", fontSize: "13px", fontWeight: 500,
  transition: "all 0.2s", textAlign: "left", whiteSpace: "nowrap"
}

const navBtnStyle = {
  ...navBtnBase, background: "transparent", color: "rgba(255,255,255,0.6)"
}

const activeBtn = {
  ...navBtnBase,
  background: "rgba(166,25,46,0.2)", color: "#fff",
  boxShadow: "inset 3px 0 0 #a6192e"
}

const sidebarFooter = {
  padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center"
}

const main = { flex: 1, padding: "28px 32px", overflowY: "auto", minWidth: 0 }
const mainMobile = { padding: "16px 12px", minHeight: "calc(100vh - 220px)" }

/* Mobile horizontal tab bar */
const mobileTabBar = {
  display: "flex",
  overflowX: "auto",
  background: "linear-gradient(180deg, #1a1520 0%, #231c2b 100%)",
  padding: "8px 4px",
  gap: 2,
  borderBottom: "1px solid rgba(166,25,46,0.3)",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  msOverflowStyle: "none"
}

const mobileTabBase = {
  display: "flex", flexDirection: "column", alignItems: "center",
  padding: "8px 12px", border: "none", borderRadius: 8,
  cursor: "pointer", fontSize: 11, fontWeight: 500,
  transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
  minWidth: 56
}

const mobileTab = { ...mobileTabBase, background: "transparent", color: "rgba(255,255,255,0.5)" }
const mobileTabActive = {
  ...mobileTabBase,
  background: "rgba(166,25,46,0.25)", color: "#fff",
  borderBottom: "2px solid #a6192e"
}

export default AdminDashboard
