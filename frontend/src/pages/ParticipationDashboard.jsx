import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

import OverviewTab from "../dashboard/OverviewTab"
import MyEventsTab from "../dashboard/MyEventsTab"
import MyTeamsTab from "../dashboard/MyTeamsTab"
import ScheduleTab from "../dashboard/ScheduleTab"
import LeaderboardTab from "../dashboard/LeaderboardTab"
import NotificationsTab from "../dashboard/NotificationsTab"
import ProfileSettingsTab from "../dashboard/ProfileSettingsTab"

const TABS = [
  { key: "overview",      label: "Overview",      icon: "fa-chart-line" },
  { key: "events",        label: "My Events",     icon: "fa-trophy" },
  { key: "teams",         label: "My Teams",      icon: "fa-users" },
  { key: "schedule",      label: "Schedule",       icon: "fa-calendar-days" },
  { key: "leaderboard",   label: "Leaderboard",   icon: "fa-ranking-star" },
  { key: "notifications", label: "Notifications", icon: "fa-bell" },
  { key: "profile",       label: "Profile",       icon: "fa-user-gear" },
]

function ParticipationDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const name = localStorage.getItem("name")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    fetchDashboard()
  }, [navigate])

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/registrations/dashboard")
      setData(res.data)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) navigate("/login")
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = data?.notifications?.filter(n => !n.read)?.length || 0

  if (loading) {
    return (
      <div style={loaderWrap}>
        <div style={spinner} />
        <p style={{ color: "#888", marginTop: 16, fontFamily: "'Inter', sans-serif" }}>Loading your dashboard…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={loaderWrap}>
        <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 40, color: "#a6192e", marginBottom: 12 }} />
        <p style={{ color: "#a6192e", fontSize: 18, fontFamily: "'Inter', sans-serif" }}>Unable to load dashboard data.</p>
        <button onClick={() => { setLoading(true); fetchDashboard() }} style={retryBtn}>
          <i className="fa-solid fa-rotate-right" style={{ marginRight: 6 }} />Retry
        </button>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case "overview":      return <OverviewTab data={data} />
      case "events":        return <MyEventsTab data={data} />
      case "teams":         return <MyTeamsTab data={data} />
      case "schedule":      return <ScheduleTab data={data} />
      case "leaderboard":   return <LeaderboardTab data={data} />
      case "notifications": return <NotificationsTab data={data} />
      case "profile":       return <ProfileSettingsTab data={data} onRefresh={fetchDashboard} />
      default:              return <OverviewTab data={data} />
    }
  }

  return (
    <div style={wrapper}>
      {/* ── SIDEBAR ── */}
      <aside style={{ ...sidebar, width: sidebarCollapsed ? "68px" : "260px" }}>
        {/* Profile Section */}
        <div style={profileSection}>
          <div style={avatar}>{name?.charAt(0)?.toUpperCase() || "U"}</div>
          {!sidebarCollapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={sidebarName}>{name || "Student"}</div>
              <div style={sidebarRole}>PARTICIPANT</div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={collapseBtn}>
          <i className={`fa-solid fa-angles-${sidebarCollapsed ? "right" : "left"}`} />
        </button>

        {/* Navigation */}
        <nav style={nav}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={activeTab === t.key ? activeNavBtn : navBtn}
              title={t.label}
            >
              <div style={{ position: "relative", width: 18, flexShrink: 0 }}>
                <i className={`fa-solid ${t.icon}`} style={{ width: 18 }} />
                {t.key === "notifications" && unreadCount > 0 && (
                  <div style={notifDot}>{unreadCount > 9 ? "9+" : unreadCount}</div>
                )}
              </div>
              {!sidebarCollapsed && <span>{t.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div style={sidebarFooter}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#a6192e" }}>PDEU Sports</div>
            <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Participant Portal v1.0</div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={main}>
        <div className="animate-fade" key={activeTab}>
          {renderTab()}
        </div>
      </main>
    </div>
  )
}

/* ── Styles ── */
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
  display: "flex", alignItems: "center", gap: 12,
  padding: "24px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)"
}

const avatar = {
  width: 38, height: 38, borderRadius: 10,
  background: "linear-gradient(135deg, #a6192e, #d4213d)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 16, fontWeight: 700, flexShrink: 0,
  boxShadow: "0 4px 12px rgba(166,25,46,0.4)"
}

const sidebarName = { fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }
const sidebarRole = { fontSize: 10, color: "#a6192e", fontWeight: 600, letterSpacing: "0.08em" }

const collapseBtn = {
  background: "none", border: "none", color: "rgba(255,255,255,0.4)",
  padding: "8px 16px", cursor: "pointer", textAlign: "left", fontSize: 12,
  transition: "color 0.2s"
}

const nav = { display: "flex", flexDirection: "column", padding: "8px 8px", flex: 1, gap: 2 }

const navBtnBase = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "11px 14px", border: "none", borderRadius: 10,
  cursor: "pointer", fontSize: 13, fontWeight: 500,
  transition: "all 0.2s", textAlign: "left", whiteSpace: "nowrap"
}

const navBtn = { ...navBtnBase, background: "transparent", color: "rgba(255,255,255,0.6)" }
const activeNavBtn = {
  ...navBtnBase,
  background: "rgba(166,25,46,0.2)", color: "#fff",
  boxShadow: "inset 3px 0 0 #a6192e"
}

const notifDot = {
  position: "absolute", top: -6, right: -8,
  background: "#a6192e", color: "#fff",
  fontSize: 8, fontWeight: 700, borderRadius: 10,
  padding: "1px 4px", minWidth: 14, textAlign: "center",
  lineHeight: "14px"
}

const sidebarFooter = {
  padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center"
}

const main = { flex: 1, padding: "28px 32px", overflowY: "auto", minWidth: 0 }

const loaderWrap = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", minHeight: "60vh", fontFamily: "'Inter', sans-serif"
}

const spinner = {
  width: 40, height: 40, border: "4px solid #eee",
  borderTop: "4px solid #a6192e", borderRadius: "50%",
  animation: "spin 0.8s linear infinite"
}

const retryBtn = {
  display: "flex", alignItems: "center", marginTop: 12,
  padding: "10px 24px", background: "#a6192e", color: "#fff",
  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
  cursor: "pointer"
}

export default ParticipationDashboard
