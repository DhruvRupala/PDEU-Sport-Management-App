import { useState, useEffect } from "react"
import API from "../services/api"

function ManagersTab() {
  const [managers, setManagers] = useState([])
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", gender: "Male" })
  const [msg, setMsg] = useState(null)

  useEffect(() => { fetch() }, [])
  const fetch = () => API.get("/admin/managers").then(r => setManagers(r.data)).catch(console.error)

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await API.post("/admin/managers", form)
      setMsg({ type: "success", text: `Manager "${form.name}" created!` })
      setForm({ name: "", email: "", password: "", phone: "", gender: "Male" })
      fetch()
    } catch (err) { setMsg({ type: "error", text: err.response?.data?.message || "Failed" }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove manager "${name}"?`)) return
    try { await API.delete(`/admin/managers/${id}`); setMsg({ type: "success", text: "Manager removed" }); fetch() }
    catch { setMsg({ type: "error", text: "Failed" }) }
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div>
      <h1 style={title}>Manager Accounts</h1>
      <p style={subtitle}>Create and manage event managers</p>
      {msg && <div style={{ ...toast, bg: msg.type === "success" ? "#e8f5e9" : "#fce4ec", background: msg.type === "success" ? "#e8f5e9" : "#fce4ec", color: msg.type === "success" ? "#2e7d32" : "#c62828" }}>{msg.text}</div>}

      <div style={grid}>
        <div style={card}>
          <h3 style={cardTitle}><i className="fa-solid fa-user-plus" style={{ color: "#a6192e", marginRight: 8 }} />Create Manager</h3>
          <form onSubmit={handleCreate}>
            <div style={twoCol}>
              <div><label style={label}>Full Name</label><input style={input} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" /></div>
              <div><label style={label}>Phone</label><input style={input} required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
            </div>
            <label style={label}>Email</label>
            <input type="email" style={input} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="manager@pdeu.ac.in" />
            <div style={twoCol}>
              <div><label style={label}>Password</label><input type="password" style={input} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></div>
              <div><label style={label}>Gender</label>
                <select style={input} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <button style={btn} type="submit"><i className="fa-solid fa-user-shield" style={{ marginRight: 6 }} />Create Manager</button>
          </form>
        </div>

        <div style={card}>
          <h3 style={cardTitle}><i className="fa-solid fa-users-gear" style={{ color: "#8b5cf6", marginRight: 8 }} />Active Managers ({managers.length})</h3>
          {managers.length === 0 ? <p style={noData}>No managers created</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {managers.map(m => (
                <div key={m._id} style={mgrRow}>
                  <div style={mgrAvatar}>{m.name?.charAt(0)?.toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 14 }}>{m.name}</strong>
                    <div style={{ fontSize: 11, color: "#888" }}>{m.email} · {m.phone}</div>
                  </div>
                  <span style={statusBadge(m.status)}>{m.status}</span>
                  <button onClick={() => handleDelete(m._id, m.name)} style={delBtn}><i className="fa-solid fa-trash" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const statusBadge = (s) => ({
  background: s === "active" ? "rgba(46,125,50,0.12)" : "rgba(237,137,54,0.12)",
  color: s === "active" ? "#2e7d32" : "#ed8936",
  padding: "3px 10px", borderRadius: 16, fontSize: 10, fontWeight: 700, textTransform: "uppercase"
})

const title = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const subtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 20 }
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }
const card = { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }
const cardTitle = { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px", display: "flex", alignItems: "center" }
const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }
const label = { display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, marginTop: 12 }
const input = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0dcd4", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#faf7f2" }
const btn = { width: "100%", padding: "11px", marginTop: 18, background: "linear-gradient(135deg, #a6192e, #d4213d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(166,25,46,0.3)" }
const mgrRow = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#faf7f2", borderRadius: 10, border: "1px solid #f0ebe0" }
const mgrAvatar = { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }
const delBtn = { background: "none", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12 }
const noData = { color: "#bbb", textAlign: "center", padding: "32px 0" }
const toast = { padding: "10px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 13 }

export default ManagersTab
