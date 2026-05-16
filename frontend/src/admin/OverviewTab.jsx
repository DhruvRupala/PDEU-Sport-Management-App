import { useState, useEffect } from "react"
import API from "../services/api"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts"

const COLORS = ["#a6192e", "#2e7d32", "#ed8936", "#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6"]
const PIE_COLORS = ["#6366f1", "#2e7d32", "#ed8936", "#9ca3af"]

function OverviewTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/admin/analytics").then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={loaderWrap}><div style={spinner} /><p style={{ color: "#888", marginTop: 12 }}>Loading analytics…</p></div>
  if (!data) return <p style={{ color: "#a6192e", textAlign: "center", marginTop: 60 }}>Failed to load analytics.</p>

  const { users, events, registrations, sports, recentRegistrations, trend, universityDistribution } = data

  const kpis = [
    { label: "Total Students", value: users.totalStudents, icon: "fa-users", color: "#a6192e", bg: "rgba(166,25,46,0.08)" },
    { label: "Pending Approvals", value: users.pendingUsers, icon: "fa-clock", color: "#ed8936", bg: "rgba(237,137,54,0.08)" },
    { label: "Active Events", value: events.totalEvents, icon: "fa-trophy", color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
    { label: "Registrations", value: registrations.totalRegistrations, icon: "fa-clipboard-list", color: "#14b8a6", bg: "rgba(20,184,166,0.08)" },
    { label: "Payments Done", value: registrations.paymentsCompleted, icon: "fa-circle-check", color: "#2e7d32", bg: "rgba(46,125,50,0.08)" },
    { label: "Managers", value: users.totalManagers, icon: "fa-user-tie", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  ]

  const eventPie = [
    { name: "Open Soon", value: events.eventsOpenSoon },
    { name: "Reg. Open", value: events.eventsRegOpen },
    { name: "Ongoing", value: events.eventsOngoing },
    { name: "Closed", value: events.eventsClosed },
  ].filter(e => e.value > 0)

  const sportBar = [
    { name: "Individual", count: sports.individualSports },
    { name: "Team", count: sports.teamSports },
  ]

  const paymentPie = [
    { name: "Completed", value: registrations.paymentsCompleted },
    { name: "Pending", value: registrations.paymentsPending },
    { name: "Failed", value: registrations.paymentsFailed },
  ].filter(e => e.value > 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>Dashboard Overview</h1>
        <p style={pageSubtitle}>Real-time analytics for PDEU Sports Management</p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...kpiCard, borderTop: `4px solid ${k.color}` }}>
            <div style={{ ...kpiIcon, background: k.bg, color: k.color }}>
              <i className={`fa-solid ${k.icon}`} />
            </div>
            <div style={kpiValue}>{k.value}</div>
            <div style={kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={chartsRow}>
        {/* Registration Trend */}
        <div style={{ ...chartCard, flex: 2 }}>
          <h3 style={chartTitle}><i className="fa-solid fa-chart-area" style={{ color: "#a6192e", marginRight: 8 }} />Registration Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a6192e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a6192e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="count" stroke="#a6192e" strokeWidth={2} fill="url(#colorReg)" name="Registrations" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Event Status Pie */}
        <div style={{ ...chartCard, flex: 1 }}>
          <h3 style={chartTitle}><i className="fa-solid fa-chart-pie" style={{ color: "#6366f1", marginRight: 8 }} />Event Status</h3>
          {eventPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={eventPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} style={{ fontSize: 11 }}>
                  {eventPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={noData}>No events yet</p>}
        </div>
      </div>

      {/* ── Second Charts Row ── */}
      <div style={chartsRow}>
        {/* Payment Breakdown */}
        <div style={{ ...chartCard, flex: 1 }}>
          <h3 style={chartTitle}><i className="fa-solid fa-credit-card" style={{ color: "#2e7d32", marginRight: 8 }} />Payment Status</h3>
          {paymentPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={paymentPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} style={{ fontSize: 11 }}>
                  <Cell fill="#2e7d32" />
                  <Cell fill="#ed8936" />
                  <Cell fill="#e53e3e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={noData}>No registrations</p>}
        </div>

        {/* Sport Type Bar */}
        <div style={{ ...chartCard, flex: 1 }}>
          <h3 style={chartTitle}><i className="fa-solid fa-basketball" style={{ color: "#ed8936", marginRight: 8 }} />Sport Types</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sportBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#888" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Sports">
                <Cell fill="#ec4899" />
                <Cell fill="#6366f1" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* University Distribution */}
        <div style={{ ...chartCard, flex: 1 }}>
          <h3 style={chartTitle}><i className="fa-solid fa-university" style={{ color: "#8b5cf6", marginRight: 8 }} />Top Universities</h3>
          {universityDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={universityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#888" }} width={100} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Students">
                  {universityDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={noData}>No data</p>}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div style={chartCard}>
        <h3 style={chartTitle}><i className="fa-solid fa-clock-rotate-left" style={{ color: "#a6192e", marginRight: 8 }} />Recent Registrations</h3>
        {recentRegistrations.length === 0 ? <p style={noData}>No registrations yet</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Student</th><th style={th}>University</th>
                  <th style={th}>Event</th><th style={th}>Sport</th>
                  <th style={th}>Payment</th><th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((r, i) => (
                  <tr key={r._id} style={i % 2 === 0 ? {} : { background: "#fdfbf7" }}>
                    <td style={td}><strong>{r.user_id?.name || "—"}</strong><br /><span style={{ fontSize: 11, color: "#999" }}>{r.user_id?.email}</span></td>
                    <td style={td}>{r.user_id?.university_name || "—"}</td>
                    <td style={td}>{r.event_id?.event_name || "—"}</td>
                    <td style={td}>{r.sport_id?.sport_name || "—"}</td>
                    <td style={td}>{payBadge(r.payment_status)}</td>
                    <td style={{ ...td, color: "#999", fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const payBadge = (s) => {
  const m = { completed: { bg: "rgba(46,125,50,0.12)", c: "#2e7d32" }, pending: { bg: "rgba(237,137,54,0.12)", c: "#ed8936" }, failed: { bg: "rgba(229,62,62,0.12)", c: "#e53e3e" } }
  const v = m[s] || m.pending
  return <span style={{ background: v.bg, color: v.c, padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{s}</span>
}

/* ── Styles ── */
const loaderWrap = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }
const spinner = { width: 36, height: 36, border: "4px solid #eee", borderTop: "4px solid #a6192e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }
const pageTitle = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const pageSubtitle = { fontSize: 14, color: "#888", marginTop: 4 }

const kpiGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))", gap: 12, marginBottom: 24 }
const kpiCard = { background: "#fff", borderRadius: 14, padding: "clamp(14px, 3vw, 20px) clamp(12px, 2vw, 18px)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s" }
const kpiIcon = { width: 40, height: 40, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }
const kpiValue = { fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }
const kpiLabel = { fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 4 }

const chartsRow = { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }
const chartCard = { background: "#fff", borderRadius: 14, padding: "clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", minWidth: 0, flex: "1 1 280px" }
const chartTitle = { fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px", display: "flex", alignItems: "center" }
const noData = { color: "#bbb", textAlign: "center", padding: "40px 0", fontSize: 14 }

const table = { width: "100%", borderCollapse: "collapse" }
const th = { textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", background: "#faf7f0", borderBottom: "1px solid #f0ebe0" }
const td = { padding: "12px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f0e6", verticalAlign: "middle" }

export default OverviewTab
