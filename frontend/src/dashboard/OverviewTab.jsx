import { useNavigate } from "react-router-dom"

function OverviewTab({ data }) {
  const navigate = useNavigate()
  const { user, stats, registrations, upcomingMatches } = data

  const kpis = [
    { label: "Registrations", value: stats.total, icon: "fa-clipboard-list", color: "#a6192e", bg: "rgba(166,25,46,0.08)" },
    { label: "Active Events", value: stats.activeEvents, icon: "fa-trophy", color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
    { label: "Upcoming Matches", value: upcomingMatches?.length || 0, icon: "fa-calendar-days", color: "#14b8a6", bg: "rgba(20,184,166,0.08)" },
    { label: "Payments Done", value: stats.completed, icon: "fa-circle-check", color: "#2e7d32", bg: "rgba(46,125,50,0.08)" },
  ]

  const getPaymentBadge = (status) => {
    const map = {
      completed: { bg: "rgba(46,125,50,0.12)", color: "#2e7d32" },
      pending:   { bg: "rgba(237,137,54,0.12)", color: "#ed8936" },
      failed:    { bg: "rgba(229,62,62,0.12)",  color: "#e53e3e" },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ background: s.bg, color: s.color, padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
        {status}
      </span>
    )
  }

  return (
    <div>
      {/* ── Welcome ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={pageTitle}>Welcome back, {user.name?.split(" ")[0]} 👋</h1>
        <p style={pageSubtitle}>Here's your sports dashboard overview</p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...kpiCard, borderTop: `4px solid ${k.color}`, animationDelay: `${i * 0.08}s` }} className="animate-fade">
            <div style={{ ...kpiIcon, background: k.bg, color: k.color }}>
              <i className={`fa-solid ${k.icon}`} />
            </div>
            <div style={kpiValue}>{k.value}</div>
            <div style={kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div style={quickActionsRow}>
        <button style={quickActionBtn} onClick={() => navigate("/events")}>
          <i className="fa-solid fa-plus" style={{ marginRight: 8 }} />Register for Event
        </button>
        <button style={{ ...quickActionBtn, background: "#6366f1" }} onClick={() => navigate("/live")}>
          <i className="fa-solid fa-tv" style={{ marginRight: 8 }} />Watch Live
        </button>
      </div>

      {/* ── Two-Column: Recent Activity + Payment Summary ── */}
      <div style={twoCol}>
        {/* Recent Activity */}
        <div style={{ ...glassCard, flex: 2 }}>
          <h3 style={sectionTitle}>
            <i className="fa-solid fa-clock-rotate-left" style={{ color: "#a6192e", marginRight: 8 }} />
            Recent Activity
          </h3>
          {registrations.length === 0 ? (
            <div style={emptyState}>
              <i className="fa-solid fa-inbox" style={{ fontSize: 40, color: "#ddd", marginBottom: 12 }} />
              <p style={{ color: "#aaa", margin: 0 }}>No registrations yet</p>
            </div>
          ) : (
            <div>
              {registrations.slice(0, 5).map((reg, i) => (
                <div key={reg._id} style={activityItem} className="animate-fade">
                  <div style={activityDot(i)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>
                      {reg.sport_id?.sport_name || "—"}
                      <span style={typeBadge(reg.sport_id?.type)}>{reg.sport_id?.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      {reg.event_id?.event_name} · {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  {getPaymentBadge(reg.payment_status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div style={{ ...glassCard, flex: 1 }}>
          <h3 style={sectionTitle}>
            <i className="fa-solid fa-chart-pie" style={{ color: "#6366f1", marginRight: 8 }} />
            Payment Summary
          </h3>
          <div style={paymentSummary}>
            <PaymentRing completed={stats.completed} pending={stats.pending} failed={stats.failed || 0} total={stats.total} />
            <div style={paymentLegend}>
              <LegendItem color="#2e7d32" label="Completed" value={stats.completed} />
              <LegendItem color="#ed8936" label="Pending" value={stats.pending} />
              <LegendItem color="#e53e3e" label="Failed" value={stats.failed || 0} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Upcoming Matches Preview ── */}
      {upcomingMatches?.length > 0 && (
        <div style={glassCard}>
          <h3 style={sectionTitle}>
            <i className="fa-solid fa-futbol" style={{ color: "#14b8a6", marginRight: 8 }} />
            Upcoming Matches
          </h3>
          <div style={matchGrid}>
            {upcomingMatches.slice(0, 4).map(m => (
              <div key={m._id} style={matchCard} className="animate-fade">
                <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                  {m.sport_id?.sport_name}
                </div>
                <div style={matchTeams}>
                  <span style={teamName}>{m.team1?.team_name || "TBD"}</span>
                  <span style={vsText}>VS</span>
                  <span style={teamName}>{m.team2?.team_name || "TBD"}</span>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 10 }}>
                  <i className="fa-regular fa-calendar" style={{ marginRight: 4 }} />
                  {new Date(m.match_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  {m.venue && <span> · <i className="fa-solid fa-location-dot" style={{ marginRight: 2 }} />{m.venue}</span>}
                </div>
                <span style={matchStatusBadge(m.status)}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Mini Components ── */
function PaymentRing({ completed, pending, failed, total }) {
  const size = 120
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const safeTotal = total || 1

  const segments = [
    { value: completed, color: "#2e7d32" },
    { value: pending, color: "#ed8936" },
    { value: failed, color: "#e53e3e" },
  ]

  let offset = 0
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f0ebe0" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.value / safeTotal) * circumference
        const currentOffset = offset
        offset += dash
        return (
          <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={seg.color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-currentOffset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        )
      })}
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" style={{ fontSize: 22, fontWeight: 800, fill: "#1a1a1a" }}>
        {total}
      </text>
    </svg>
  )
}

function LegendItem({ color, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ color: "#666", flex: 1 }}>{label}</span>
      <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{value}</span>
    </div>
  )
}

/* ── Helpers ── */
const typeBadge = (type) => ({
  background: type === "team" ? "rgba(99,102,241,0.1)" : "rgba(236,72,153,0.1)",
  color: type === "team" ? "#6366f1" : "#ec4899",
  padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600,
  marginLeft: 8, textTransform: "capitalize"
})

const matchStatusBadge = (status) => ({
  display: "inline-block", marginTop: 8,
  background: status === "ongoing" ? "rgba(245,158,11,0.12)" : "rgba(99,102,241,0.1)",
  color: status === "ongoing" ? "#f59e0b" : "#6366f1",
  padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.04em"
})

const activityDot = (i) => ({
  width: 8, height: 8, borderRadius: "50%",
  background: ["#a6192e", "#6366f1", "#14b8a6", "#ed8936", "#ec4899"][i % 5],
  flexShrink: 0, marginTop: 6
})

/* ── Styles ── */
const pageTitle = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const pageSubtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 0 }

const kpiGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }
const kpiCard = { background: "#fff", borderRadius: 14, padding: "22px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s" }
const kpiIcon = { width: 42, height: 42, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }
const kpiValue = { fontSize: 30, fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }
const kpiLabel = { fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 4 }

const quickActionsRow = { display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }
const quickActionBtn = {
  display: "flex", alignItems: "center", padding: "12px 24px",
  background: "#a6192e", color: "#fff", border: "none", borderRadius: 12,
  fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
  boxShadow: "0 4px 14px rgba(166,25,46,0.25)"
}

const glassCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 16, padding: "24px 28px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.4)",
  marginBottom: 20
}

const sectionTitle = { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px", display: "flex", alignItems: "center" }

const twoCol = { display: "flex", gap: 20, marginBottom: 0, flexWrap: "wrap" }

const emptyState = { textAlign: "center", padding: "40px 20px" }

const activityItem = {
  display: "flex", alignItems: "flex-start", gap: 12,
  padding: "14px 0", borderBottom: "1px solid #f5f0e6"
}

const paymentSummary = { display: "flex", flexDirection: "column", gap: 20 }
const paymentLegend = { display: "flex", flexDirection: "column", gap: 10 }

const matchGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }
const matchCard = {
  background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "18px 20px",
  border: "1px solid #f0ebe0", transition: "transform 0.2s, box-shadow 0.2s"
}
const matchTeams = { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }
const teamName = { fontSize: 14, fontWeight: 700, color: "#1a1a1a" }
const vsText = { fontSize: 11, fontWeight: 800, color: "#a6192e", padding: "2px 8px", background: "rgba(166,25,46,0.08)", borderRadius: 6 }

export default OverviewTab
