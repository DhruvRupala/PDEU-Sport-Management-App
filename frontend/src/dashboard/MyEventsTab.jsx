import { useState } from "react"

function MyEventsTab({ data }) {
  const { registrations } = data
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Group registrations by event
  const eventMap = {}
  registrations.forEach(reg => {
    const eId = reg.event_id?._id || "unknown"
    if (!eventMap[eId]) {
      eventMap[eId] = {
        event: reg.event_id,
        sports: []
      }
    }
    eventMap[eId].sports.push(reg)
  })

  const events = Object.values(eventMap).filter(e => {
    const name = e.event?.event_name?.toLowerCase() || ""
    const matchSearch = name.includes(search.toLowerCase())
    const matchFilter = filterStatus === "all" || e.event?.status === filterStatus
    return matchSearch && matchFilter
  })

  const getStatusStyle = (status) => {
    const map = {
      "open soon":          { bg: "rgba(99,102,241,0.1)", color: "#6366f1", icon: "fa-clock" },
      "registration open":  { bg: "rgba(16,185,129,0.1)", color: "#10b981", icon: "fa-door-open" },
      "ongoing":            { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", icon: "fa-play-circle" },
      "closed":             { bg: "rgba(156,163,175,0.1)", color: "#9ca3af", icon: "fa-lock" },
    }
    return map[status] || { bg: "#eee", color: "#666", icon: "fa-question" }
  }

  const getEventTypeBadge = (type) => {
    const map = {
      "freshers":          { bg: "rgba(236,72,153,0.1)", color: "#ec4899" },
      "intra-university":  { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
      "inter-university":  { bg: "rgba(20,184,166,0.1)", color: "#14b8a6" },
    }
    const s = map[type] || { bg: "#eee", color: "#666" }
    return (
      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {type}
      </span>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>My Events</h1>
        <p style={pageSubtitle}>Events you've registered for</p>
      </div>

      {/* ── Filter Bar ── */}
      <div style={filterBar}>
        <div style={searchWrap}>
          <i className="fa-solid fa-search" style={{ color: "#aaa", marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>
        <div style={filterBtns}>
          {["all", "registration open", "ongoing", "closed"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={filterStatus === s ? filterBtnActive : filterBtn}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Event Cards ── */}
      {events.length === 0 ? (
        <div style={emptyState}>
          <i className="fa-solid fa-calendar-xmark" style={{ fontSize: 48, color: "#ddd", marginBottom: 16 }} />
          <p style={{ fontSize: 18, color: "#888", margin: 0 }}>No events found</p>
          <p style={{ fontSize: 13, color: "#bbb", marginTop: 6 }}>
            {search || filterStatus !== "all" ? "Try adjusting your filters" : "Register for events to see them here"}
          </p>
        </div>
      ) : (
        <div style={eventGrid}>
          {events.map((item, idx) => {
            const e = item.event
            const statusStyle = getStatusStyle(e?.status)
            return (
              <div key={e?._id || idx} style={eventCard} className="animate-fade">
                {/* Header */}
                <div style={eventCardHeader}>
                  <div style={{ ...statusDot, background: statusStyle.color }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={eventName}>{e?.event_name || "Unknown Event"}</h3>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {getEventTypeBadge(e?.event_type)}
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, textTransform: "capitalize" }}>
                        <i className={`fa-solid ${statusStyle.icon}`} style={{ marginRight: 4 }} />
                        {e?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                {(e?.start_date || e?.end_date) && (
                  <div style={dateRange}>
                    <i className="fa-regular fa-calendar" style={{ color: "#a6192e", marginRight: 6 }} />
                    {e.start_date && new Date(e.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {e.end_date && ` — ${new Date(e.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                  </div>
                )}

                {/* Description */}
                {e?.description && (
                  <p style={eventDesc}>{e.description}</p>
                )}

                {/* Registered Sports */}
                <div style={sportsSection}>
                  <div style={sportsSectionTitle}>
                    <i className="fa-solid fa-basketball" style={{ marginRight: 6, fontSize: 12 }} />
                    Registered Sports ({item.sports.length})
                  </div>
                  {item.sports.map(reg => (
                    <div key={reg._id} style={sportRow}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>{reg.sport_id?.sport_name || "—"}</span>
                        <span style={sportTypeBadge(reg.sport_id?.type)}>{reg.sport_id?.type}</span>
                        {reg.team_name && (
                          <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>
                            <i className="fa-solid fa-users" style={{ marginRight: 3 }} />{reg.team_name}
                          </span>
                        )}
                      </div>
                      <PayBadge status={reg.payment_status} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PayBadge({ status }) {
  const map = {
    completed: { bg: "rgba(46,125,50,0.12)", color: "#2e7d32" },
    pending:   { bg: "rgba(237,137,54,0.12)", color: "#ed8936" },
    failed:    { bg: "rgba(229,62,62,0.12)",  color: "#e53e3e" },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
      {status}
    </span>
  )
}

/* ── Helpers ── */
const sportTypeBadge = (type) => ({
  background: type === "team" ? "rgba(99,102,241,0.08)" : "rgba(236,72,153,0.08)",
  color: type === "team" ? "#6366f1" : "#ec4899",
  padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600,
  marginLeft: 6, textTransform: "capitalize"
})

/* ── Styles ── */
const pageTitle = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const pageSubtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 0 }

const filterBar = { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }
const searchWrap = {
  display: "flex", alignItems: "center", background: "#fff",
  borderRadius: 12, padding: "10px 16px", flex: 1, minWidth: 200,
  border: "1px solid #f0ebe0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
}
const searchInput = {
  border: "none", outline: "none", background: "transparent",
  fontSize: 14, width: "100%", color: "#333", fontFamily: "'Inter', sans-serif"
}
const filterBtns = { display: "flex", gap: 6, flexWrap: "wrap" }
const filterBtn = {
  padding: "8px 16px", borderRadius: 20, border: "1px solid #e5ddd0",
  background: "#fff", color: "#666", fontSize: 12, fontWeight: 600,
  cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap"
}
const filterBtnActive = {
  ...filterBtn, background: "#a6192e", color: "#fff", border: "1px solid #a6192e"
}

const emptyState = { textAlign: "center", padding: "60px 20px" }

const eventGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 16 }

const eventCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 16, padding: "24px", overflow: "hidden",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.4)",
  transition: "transform 0.2s, box-shadow 0.2s"
}

const eventCardHeader = { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }
const statusDot = { width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 6 }
const eventName = { fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.3 }

const dateRange = { fontSize: 13, color: "#666", marginBottom: 8, display: "flex", alignItems: "center" }
const eventDesc = { fontSize: 13, color: "#888", margin: "0 0 12px", lineHeight: 1.5 }

const sportsSection = {
  background: "#faf7f2", borderRadius: 12, padding: "14px 16px", marginTop: 8
}
const sportsSectionTitle = {
  fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase",
  letterSpacing: "0.04em", marginBottom: 10, display: "flex", alignItems: "center"
}
const sportRow = {
  display: "flex", alignItems: "center", padding: "8px 0",
  borderBottom: "1px solid rgba(0,0,0,0.04)"
}

export default MyEventsTab
