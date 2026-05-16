import { useState, useEffect } from "react"
import API from "../services/api"

function EventsTab() {
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ event_name: "", event_type: "freshers", description: "" })
  const [msg, setMsg] = useState(null)

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try { const res = await API.get("/events"); setEvents(res.data) } catch (e) { console.error(e) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await API.post("/events", newEvent)
      setMsg({ type: "success", text: `Event "${newEvent.event_name}" created!` })
      setNewEvent({ event_name: "", event_type: "freshers", description: "" })
      fetchEvents()
    } catch { setMsg({ type: "error", text: "Failed to create event" }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleStatus = async (id, status) => {
    try { await API.patch(`/events/${id}/status`, { status }); fetchEvents() }
    catch { setMsg({ type: "error", text: "Failed to update status" }); setTimeout(() => setMsg(null), 3000) }
  }

  const statusBadge = (s) => {
    const m = { "open soon": "#6366f1", "registration open": "#2e7d32", "ongoing": "#ed8936", "closed": "#9ca3af" }
    return <span style={{ background: `${m[s] || "#999"}18`, color: m[s] || "#999", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{s}</span>
  }

  return (
    <div>
      <h1 style={title}>Event Management</h1>
      <p style={subtitle}>Create tournaments and control event lifecycle</p>
      {msg && <div style={{ ...toast, background: msg.type === "success" ? "#e8f5e9" : "#fce4ec", color: msg.type === "success" ? "#2e7d32" : "#c62828" }}>{msg.text}</div>}

      <div style={grid}>
        {/* Create Form */}
        <div style={card}>
          <h3 style={cardTitle}><i className="fa-solid fa-plus-circle" style={{ color: "#a6192e", marginRight: 8 }} />Create Event</h3>
          <form onSubmit={handleCreate}>
            <label style={label}>Event Name</label>
            <input style={input} required value={newEvent.event_name} onChange={e => setNewEvent({ ...newEvent, event_name: e.target.value })} placeholder="e.g. Freshers Cup 2026" />
            <label style={label}>Type</label>
            <select style={input} value={newEvent.event_type} onChange={e => setNewEvent({ ...newEvent, event_type: e.target.value })}>
              <option value="freshers">Freshers</option>
              <option value="intra-university">Intra-University</option>
              <option value="inter-university">Inter-University</option>
            </select>
            <label style={label}>Description</label>
            <textarea style={{ ...input, minHeight: 60, resize: "vertical" }} value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Optional description" />
            <button style={btn} type="submit"><i className="fa-solid fa-rocket" style={{ marginRight: 6 }} />Launch Event</button>
          </form>
        </div>

        {/* Events List */}
        <div style={card}>
          <h3 style={cardTitle}><i className="fa-solid fa-list" style={{ color: "#6366f1", marginRight: 8 }} />Active Events ({events.length})</h3>
          {events.length === 0 ? <p style={noData}>No events created yet</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {events.map(ev => (
                <div key={ev._id} style={eventRow}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 14, color: "#1a1a1a" }}>{ev.event_name}</strong>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ textTransform: "capitalize" }}>{ev.event_type}</span>
                      {statusBadge(ev.status)}
                    </div>
                  </div>
                  <select style={selectSmall} value={ev.status} onChange={e => handleStatus(ev._id, e.target.value)}>
                    <option value="open soon">Open Soon</option>
                    <option value="registration open">Reg. Open</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const title = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const subtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 20 }
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16, alignItems: "start" }
const card = { background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }
const cardTitle = { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px", display: "flex", alignItems: "center" }
const label = { display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, marginTop: 12 }
const input = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0dcd4", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border 0.2s", background: "#faf7f2" }
const btn = { width: "100%", padding: "11px", marginTop: 18, background: "linear-gradient(135deg, #a6192e, #d4213d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(166,25,46,0.3)" }
const eventRow = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#faf7f2", borderRadius: 10, border: "1px solid #f0ebe0" }
const selectSmall = { padding: "6px 10px", borderRadius: 8, border: "2px solid #e0dcd4", fontSize: 12, fontWeight: 600, background: "#fff", cursor: "pointer", minWidth: 110 }
const noData = { color: "#bbb", textAlign: "center", padding: "32px 0" }
const toast = { padding: "10px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 13 }

export default EventsTab
