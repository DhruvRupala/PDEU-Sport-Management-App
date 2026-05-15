import { useState, useEffect } from "react"
import API from "../services/api"

function SportsTab() {
  const [events, setEvents] = useState([])
  const [sports, setSports] = useState([])
  const [selectedEventId, setSelectedEventId] = useState("")
  const [newSport, setNewSport] = useState({ sport_name: "", type: "individual", team_size: 1, max_participants: "", substitutes: "" })
  const [msg, setMsg] = useState(null)

  useEffect(() => { API.get("/events").then(r => setEvents(r.data)).catch(console.error) }, [])

  const fetchSports = (id) => {
    if (!id) { setSports([]); return }
    API.get(`/sports/${id}`).then(r => setSports(r.data)).catch(console.error)
  }

  const handleEventSelect = (e) => { const id = e.target.value; setSelectedEventId(id); fetchSports(id) }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selectedEventId) return alert("Select an event first.")
    const payload = {
      sport_name: newSport.sport_name, event_id: selectedEventId, type: newSport.type,
      team_size: newSport.type === "team" ? parseInt(newSport.team_size) : null,
      rules: {
        max_participants_per_uni: newSport.max_participants ? parseInt(newSport.max_participants) : null,
        substitutes_allowed: newSport.type === "team" && newSport.substitutes ? parseInt(newSport.substitutes) : null
      }
    }
    try {
      await API.post("/sports", payload)
      setMsg({ type: "success", text: `${newSport.sport_name} added!` })
      setNewSport({ sport_name: "", type: "individual", team_size: 1, max_participants: "", substitutes: "" })
      fetchSports(selectedEventId)
    } catch (err) { setMsg({ type: "error", text: err.response?.data?.message || "Error" }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleRemove = async (id) => {
    if (!window.confirm("Delete this sport?")) return
    try { await API.delete(`/sports/${id}`); fetchSports(selectedEventId) }
    catch { setMsg({ type: "error", text: "Failed to remove" }); setTimeout(() => setMsg(null), 3000) }
  }

  return (
    <div>
      <h1 style={title}>Sports Configuration</h1>
      <p style={subtitle}>Add sports and rules to events</p>
      {msg && <div style={{ ...toast, background: msg.type === "success" ? "#e8f5e9" : "#fce4ec", color: msg.type === "success" ? "#2e7d32" : "#c62828" }}>{msg.text}</div>}

      <div style={selectorCard}>
        <label style={label}><i className="fa-solid fa-bullseye" style={{ color: "#a6192e", marginRight: 6 }} />Target Event</label>
        <select style={input} value={selectedEventId} onChange={handleEventSelect}>
          <option value="">— Select Event —</option>
          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.event_name}</option>)}
        </select>
      </div>

      {selectedEventId && (
        <div style={grid}>
          <div style={card}>
            <h3 style={cardTitle}><i className="fa-solid fa-plus" style={{ color: "#a6192e", marginRight: 8 }} />Add Sport</h3>
            <form onSubmit={handleAdd}>
              <label style={label}>Sport Name</label>
              <input style={input} required value={newSport.sport_name} onChange={e => setNewSport({ ...newSport, sport_name: e.target.value })} placeholder="e.g. Cricket" />
              <label style={label}>Type</label>
              <select style={input} value={newSport.type} onChange={e => setNewSport({ ...newSport, type: e.target.value })}>
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
              {newSport.type === "team" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={label}>Team Size</label><input type="number" style={input} min="2" required value={newSport.team_size} onChange={e => setNewSport({ ...newSport, team_size: e.target.value })} /></div>
                  <div><label style={label}>Substitutes</label><input type="number" style={input} min="0" value={newSport.substitutes} onChange={e => setNewSport({ ...newSport, substitutes: e.target.value })} placeholder="0" /></div>
                </div>
              )}
              <label style={label}>Max per University</label>
              <input type="number" style={input} min="1" value={newSport.max_participants} onChange={e => setNewSport({ ...newSport, max_participants: e.target.value })} placeholder="Optional cap" />
              <button style={btn} type="submit"><i className="fa-solid fa-bolt" style={{ marginRight: 6 }} />Add Sport</button>
            </form>
          </div>

          <div style={card}>
            <h3 style={cardTitle}><i className="fa-solid fa-list-ul" style={{ color: "#6366f1", marginRight: 8 }} />Sports ({sports.length})</h3>
            {sports.length === 0 ? <p style={noData}>No sports added yet</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sports.map(sp => (
                  <div key={sp._id} style={sportRow}>
                    <div style={{ flex: 1 }}>
                      <strong>{sp.sport_name}</strong>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                        <span style={typeBadge(sp.type)}>{sp.type}</span>
                        {sp.type === "team" && <span> {sp.team_size}v{sp.team_size}</span>}
                        {sp.rules?.max_participants_per_uni ? ` · Cap: ${sp.rules.max_participants_per_uni}` : ""}
                        {sp.rules?.substitutes_allowed ? ` · Subs: ${sp.rules.substitutes_allowed}` : ""}
                      </div>
                    </div>
                    <button onClick={() => handleRemove(sp._id)} style={removeBtn}><i className="fa-solid fa-trash-can" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const typeBadge = (t) => ({
  background: t === "team" ? "rgba(99,102,241,0.1)" : "rgba(236,72,153,0.1)",
  color: t === "team" ? "#6366f1" : "#ec4899",
  padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase"
})

const title = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const subtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 20 }
const selectorCard = { background: "#fff", borderRadius: 14, padding: "18px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 20, maxWidth: 400 }
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }
const card = { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }
const cardTitle = { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px", display: "flex", alignItems: "center" }
const label = { display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, marginTop: 12 }
const input = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0dcd4", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#faf7f2" }
const btn = { width: "100%", padding: "11px", marginTop: 18, background: "linear-gradient(135deg, #a6192e, #d4213d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(166,25,46,0.3)" }
const sportRow = { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#faf7f2", borderRadius: 10, borderLeft: "4px solid #a6192e" }
const removeBtn = { background: "none", border: "1px solid #e53e3e", color: "#e53e3e", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12 }
const noData = { color: "#bbb", textAlign: "center", padding: "32px 0" }
const toast = { padding: "10px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 13 }

export default SportsTab
