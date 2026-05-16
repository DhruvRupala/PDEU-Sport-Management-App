import { useState, useEffect } from "react"
import API from "../services/api"

function CodesTab() {
  const [codes, setCodes] = useState([])
  const [form, setForm] = useState({ university_name: "", code: "" })
  const [msg, setMsg] = useState(null)

  useEffect(() => { fetch() }, [])
  const fetch = () => API.get("/admin/university-codes").then(r => setCodes(r.data)).catch(console.error)

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await API.post("/admin/university-codes", form)
      setMsg({ type: "success", text: `Code "${form.code}" created!` })
      setForm({ university_name: "", code: "" })
      fetch()
    } catch (err) { setMsg({ type: "error", text: err.response?.data?.message || "Failed" }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleToggle = async (id) => {
    try { await API.patch(`/admin/university-codes/${id}/toggle`); fetch() }
    catch { setMsg({ type: "error", text: "Failed" }); setTimeout(() => setMsg(null), 3000) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this code?")) return
    try { await API.delete(`/admin/university-codes/${id}`); fetch() }
    catch { setMsg({ type: "error", text: "Failed" }); setTimeout(() => setMsg(null), 3000) }
  }

  return (
    <div>
      <h1 style={title}>University Access Codes</h1>
      <p style={subtitle}>Generate and manage registration codes for universities</p>
      {msg && <div style={{ ...toast, background: msg.type === "success" ? "#e8f5e9" : "#fce4ec", color: msg.type === "success" ? "#2e7d32" : "#c62828" }}>{msg.text}</div>}

      <div style={grid}>
        <div style={card}>
          <h3 style={cardTitle}><i className="fa-solid fa-key" style={{ color: "#a6192e", marginRight: 8 }} />Generate Code</h3>
          <form onSubmit={handleCreate}>
            <label style={label}>University Name</label>
            <input style={input} required value={form.university_name} onChange={e => setForm({ ...form, university_name: e.target.value })} placeholder="e.g. Gujarat University" />
            <label style={label}>Access Code</label>
            <input style={input} required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. GU2026" />
            <button style={btn} type="submit"><i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 6 }} />Generate Code</button>
          </form>
        </div>

        <div style={card}>
          <h3 style={cardTitle}><i className="fa-solid fa-list-check" style={{ color: "#14b8a6", marginRight: 8 }} />Active Codes ({codes.length})</h3>
          {codes.length === 0 ? <p style={noData}>No codes generated</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {codes.map(c => (
                <div key={c._id} style={codeRow}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 14 }}>{c.university_name}</strong>
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      <span style={codeBadge}>{c.code}</span>
                      <span style={c.is_active ? activeBadge : inactiveBadge}>{c.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <button onClick={() => handleToggle(c._id)} style={toggleBtn} title={c.is_active ? "Deactivate" : "Activate"}>
                    <i className={`fa-solid fa-toggle-${c.is_active ? "on" : "off"}`} style={{ color: c.is_active ? "#2e7d32" : "#999", fontSize: 20 }} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} style={delBtn}><i className="fa-solid fa-trash" /></button>
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
const card = { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }
const cardTitle = { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 18px", display: "flex", alignItems: "center" }
const label = { display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, marginTop: 12 }
const input = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0dcd4", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#faf7f2" }
const btn = { width: "100%", padding: "11px", marginTop: 18, background: "linear-gradient(135deg, #a6192e, #d4213d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(166,25,46,0.3)" }
const codeRow = { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#faf7f2", borderRadius: 10, border: "1px solid #f0ebe0" }
const codeBadge = { background: "rgba(166,25,46,0.1)", color: "#a6192e", padding: "2px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: "monospace", marginRight: 6 }
const activeBadge = { background: "rgba(46,125,50,0.12)", color: "#2e7d32", padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700 }
const inactiveBadge = { background: "rgba(156,163,175,0.15)", color: "#9ca3af", padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700 }
const toggleBtn = { background: "none", border: "none", cursor: "pointer", padding: "4px" }
const delBtn = { background: "none", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12 }
const noData = { color: "#bbb", textAlign: "center", padding: "32px 0" }
const toast = { padding: "10px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 13 }

export default CodesTab
