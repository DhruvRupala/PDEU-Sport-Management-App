import { useState, useEffect } from "react"
import API from "../services/api"

function UsersTab() {
  const [pending, setPending] = useState([])
  const [all, setAll] = useState([])
  const [view, setView] = useState("pending")
  const [msg, setMsg] = useState(null)

  useEffect(() => { fetchPending(); fetchAll() }, [])

  const fetchPending = () => API.get("/admin/users/pending").then(r => setPending(r.data)).catch(console.error)
  const fetchAll = () => API.get("/admin/users").then(r => setAll(r.data)).catch(console.error)

  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/admin/users/${id}/status`, { status })
      setMsg({ type: "success", text: `User ${status}!` })
      fetchPending(); fetchAll()
    } catch { setMsg({ type: "error", text: "Failed" }) }
    setTimeout(() => setMsg(null), 3000)
  }

  const sBadge = (s) => {
    const m = { active: { bg: "rgba(46,125,50,0.12)", c: "#2e7d32" }, pending: { bg: "rgba(237,137,54,0.12)", c: "#ed8936" }, rejected: { bg: "rgba(229,62,62,0.12)", c: "#e53e3e" } }
    const v = m[s] || m.pending
    return <span style={{ background: v.bg, color: v.c, padding: "3px 10px", borderRadius: 16, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{s}</span>
  }

  const users = view === "pending" ? pending : all

  return (
    <div>
      <h1 style={title}>User Management</h1>
      <p style={subtitle}>Approve registrations and manage students</p>
      {msg && <div style={{ ...toast, background: msg.type === "success" ? "#e8f5e9" : "#fce4ec", color: msg.type === "success" ? "#2e7d32" : "#c62828" }}>{msg.text}</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setView("pending")} style={view === "pending" ? tabActive : tab}>Pending ({pending.length})</button>
        <button onClick={() => setView("all")} style={view === "all" ? tabActive : tab}>All Students ({all.length})</button>
      </div>

      <div style={card}>
        {users.length === 0 ? <p style={noData}>{view === "pending" ? "No pending approvals 🎉" : "No students found"}</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead><tr>
                <th style={th}>Name</th><th style={th}>Email</th><th style={th}>University</th>
                <th style={th}>Phone</th><th style={th}>Status</th>
                {view === "pending" && <th style={th}>Actions</th>}
              </tr></thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} style={i % 2 ? { background: "#fdfbf7" } : {}}>
                    <td style={td}><strong>{u.name}</strong>{u.roll_no && <span style={{ display: "block", fontSize: 11, color: "#999" }}>{u.roll_no}</span>}</td>
                    <td style={td}>{u.email}</td>
                    <td style={td}>{u.university_name}</td>
                    <td style={td}>{u.phone || "—"}</td>
                    <td style={td}>{sBadge(u.status)}</td>
                    {view === "pending" && (
                      <td style={td}>
                        <button onClick={() => handleStatus(u._id, "active")} style={approveBtn}><i className="fa-solid fa-check" /> Approve</button>
                        <button onClick={() => handleStatus(u._id, "rejected")} style={rejectBtn}><i className="fa-solid fa-xmark" /></button>
                      </td>
                    )}
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
const tab = { padding: "8px 20px", borderRadius: 10, border: "1px solid #e0dcd4", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#666" }
const tabActive = { ...tab, background: "#a6192e", color: "#fff", border: "1px solid #a6192e" }
const table = { width: "100%", borderCollapse: "collapse" }
const th = { textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", background: "#faf7f0", borderBottom: "1px solid #f0ebe0" }
const td = { padding: "12px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f0e6", verticalAlign: "middle" }
const approveBtn = { background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginRight: 6 }
const rejectBtn = { background: "none", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer" }
const noData = { color: "#bbb", textAlign: "center", padding: "48px 0", fontSize: 15 }
const toast = { padding: "10px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 13 }

export default UsersTab
