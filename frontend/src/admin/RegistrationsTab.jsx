import { useState, useEffect } from "react"
import API from "../services/api"

function RegistrationsTab() {
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [filterEvent, setFilterEvent] = useState("")
  const [filterPayment, setFilterPayment] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      API.get("/events"),
      API.get("/admin/analytics")
    ]).then(([evRes, anRes]) => {
      setEvents(evRes.data)
      setRegistrations(anRes.data.recentRegistrations || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = registrations.filter(r => {
    if (filterEvent && r.event_id?._id !== filterEvent) return false
    if (filterPayment && r.payment_status !== filterPayment) return false
    return true
  })

  const payBadge = (s) => {
    const m = { completed: { bg: "rgba(46,125,50,0.12)", c: "#2e7d32" }, pending: { bg: "rgba(237,137,54,0.12)", c: "#ed8936" }, failed: { bg: "rgba(229,62,62,0.12)", c: "#e53e3e" } }
    const v = m[s] || m.pending
    return <span style={{ background: v.bg, color: v.c, padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{s}</span>
  }

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#888" }}>Loading registrations…</div>

  return (
    <div>
      <h1 style={title}>All Registrations</h1>
      <p style={subtitle}>View and filter student registrations</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select style={filterSelect} value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
          <option value="">All Events</option>
          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.event_name}</option>)}
        </select>
        <select style={filterSelect} value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
          <option value="">All Payments</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <span style={{ fontSize: 13, color: "#888", alignSelf: "center" }}>{filtered.length} results</span>
      </div>

      <div style={card}>
        {filtered.length === 0 ? <p style={noData}>No registrations found</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead><tr>
                <th style={th}>#</th><th style={th}>Student</th><th style={th}>University</th>
                <th style={th}>Event</th><th style={th}>Sport</th><th style={th}>Team</th>
                <th style={th}>Payment</th><th style={th}>Date</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r._id} style={i % 2 ? { background: "#fdfbf7" } : {}}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}><strong>{r.user_id?.name || "—"}</strong><br /><span style={{ fontSize: 11, color: "#999" }}>{r.user_id?.email}</span></td>
                    <td style={td}>{r.user_id?.university_name || "—"}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.event_id?.event_name || "—"}</td>
                    <td style={td}>{r.sport_id?.sport_name || "—"}</td>
                    <td style={td}>{r.team_name || "—"}</td>
                    <td style={td}>{payBadge(r.payment_status)}</td>
                    <td style={{ ...td, color: "#999", fontSize: 12 }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
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

const title = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const subtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 20 }
const card = { background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }
const filterSelect = { padding: "8px 14px", borderRadius: 10, border: "1px solid #e0dcd4", fontSize: 13, background: "#fff", cursor: "pointer", fontWeight: 500 }
const table = { width: "100%", borderCollapse: "collapse" }
const th = { textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", background: "#faf7f0", borderBottom: "1px solid #f0ebe0" }
const td = { padding: "12px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f0e6", verticalAlign: "middle" }
const noData = { color: "#bbb", textAlign: "center", padding: "48px 0", fontSize: 15 }

export default RegistrationsTab
