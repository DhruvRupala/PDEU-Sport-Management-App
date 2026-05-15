import { useState } from "react"
import API from "../services/api"

function ProfileSettingsTab({ data, onRefresh }) {
  const { user } = data
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "", gender: user.gender || "" })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const handleSave = async () => {
    setSaving(true)
    setMsg(null)
    try {
      await API.patch("/registrations/profile", form)
      setMsg({ type: "success", text: "Profile updated successfully!" })
      setEditing(false)
      if (onRefresh) onRefresh()
      // Update localStorage name
      localStorage.setItem("name", form.name)
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  const infoRows = [
    { icon: "fa-user", label: "Full Name", value: user.name },
    { icon: "fa-envelope", label: "Email", value: user.email },
    { icon: "fa-phone", label: "Phone", value: user.phone || "—" },
    { icon: "fa-venus-mars", label: "Gender", value: user.gender || "—" },
    { icon: "fa-id-badge", label: "Roll Number", value: user.roll_no || "—" },
    { icon: "fa-university", label: "University", value: user.university_name || "—" },
    { icon: "fa-shield-halved", label: "Role", value: user.role },
    { icon: "fa-calendar", label: "Member Since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Profile & Settings</h1>
        <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div style={profileCard}>
        <div style={profileHeader}>
          <div style={avatarLarge}>{user.name?.charAt(0)?.toUpperCase() || "U"}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{user.name}</h2>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span style={roleBadge}>{user.role}</span>
              <span style={user.status === "active" ? statusActive : statusPending}>
                <i className={`fa-solid ${user.status === "active" ? "fa-circle-check" : "fa-clock"}`} style={{ marginRight: 4 }} />
                {user.status}
              </span>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={editBtn}>
              <i className="fa-solid fa-pen" style={{ marginRight: 6 }} />Edit Profile
            </button>
          )}
        </div>

        {/* Status Message */}
        {msg && (
          <div style={{ ...msgBox, background: msg.type === "success" ? "rgba(46,125,50,0.08)" : "rgba(229,62,62,0.08)", color: msg.type === "success" ? "#2e7d32" : "#e53e3e" }}>
            <i className={`fa-solid ${msg.type === "success" ? "fa-circle-check" : "fa-circle-xmark"}`} style={{ marginRight: 6 }} />
            {msg.text}
          </div>
        )}

        {/* View Mode */}
        {!editing ? (
          <div style={infoGrid}>
            {infoRows.map((row, i) => (
              <div key={i} style={infoItem}>
                <div style={infoIconWrap}>
                  <i className={`fa-solid ${row.icon}`} />
                </div>
                <div>
                  <div style={infoLabel}>{row.label}</div>
                  <div style={infoValue}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Edit Mode */
          <div style={editForm}>
            <div style={formGroup}>
              <label style={formLabel}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={formInput}
              />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                style={formInput}
              />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Gender</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                style={formInput}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={formNote}>
              <i className="fa-solid fa-info-circle" style={{ marginRight: 6 }} />
              Email, Roll Number, and University cannot be changed. Contact admin for assistance.
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={handleSave} disabled={saving} style={saveBtn}>
                {saving ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 6 }} />Saving...</> : <><i className="fa-solid fa-check" style={{ marginRight: 6 }} />Save Changes</>}
              </button>
              <button onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone, gender: user.gender }) }} style={cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Security */}
      <div style={securityCard}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px", display: "flex", alignItems: "center" }}>
          <i className="fa-solid fa-lock" style={{ color: "#a6192e", marginRight: 8 }} />Account Security
        </h3>
        <div style={securityRow}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>Password</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Last changed: Unknown</div>
          </div>
          <button style={changePassBtn}>
            <i className="fa-solid fa-key" style={{ marginRight: 6 }} />Change Password
          </button>
        </div>
        <div style={securityRow}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>Two-Factor Auth</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Not available yet</div>
          </div>
          <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Coming Soon</span>
        </div>
      </div>
    </div>
  )
}

/* ── Styles ── */
const profileCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 16, overflow: "hidden",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.4)",
  marginBottom: 24
}

const profileHeader = {
  display: "flex", alignItems: "center", gap: 20,
  padding: "28px 28px 20px", borderBottom: "1px solid #f5f0e6",
  flexWrap: "wrap"
}

const avatarLarge = {
  width: 72, height: 72, borderRadius: 18,
  background: "linear-gradient(135deg, #a6192e, #d4213d)",
  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 30, fontWeight: 700, flexShrink: 0,
  boxShadow: "0 6px 20px rgba(166,25,46,0.35)"
}

const roleBadge = {
  background: "rgba(166,25,46,0.1)", color: "#a6192e",
  padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.05em"
}

const statusActive = {
  background: "rgba(46,125,50,0.1)", color: "#2e7d32",
  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
  textTransform: "capitalize"
}

const statusPending = {
  background: "rgba(237,137,54,0.1)", color: "#ed8936",
  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
  textTransform: "capitalize"
}

const editBtn = {
  display: "flex", alignItems: "center", padding: "10px 20px",
  background: "#fff", color: "#a6192e", border: "1px solid rgba(166,25,46,0.2)",
  borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
}

const msgBox = {
  margin: "0 28px", padding: "10px 16px", borderRadius: 10,
  fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center"
}

const infoGrid = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 0, padding: "8px 0"
}

const infoItem = {
  display: "flex", gap: 14, alignItems: "center",
  padding: "16px 28px", borderBottom: "1px solid #f5f0e6"
}

const infoIconWrap = {
  width: 38, height: 38, borderRadius: 10,
  background: "rgba(166,25,46,0.06)", color: "#a6192e",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 14, flexShrink: 0
}

const infoLabel = { fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }
const infoValue = { fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginTop: 2 }

const editForm = { padding: "20px 28px" }
const formGroup = { marginBottom: 16 }
const formLabel = { display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }
const formInput = {
  width: "100%", padding: "12px 16px", borderRadius: 10,
  border: "1px solid #e5ddd0", fontSize: 14, fontFamily: "'Inter', sans-serif",
  color: "#333", background: "#faf7f2", boxSizing: "border-box",
  transition: "border 0.2s, box-shadow 0.2s"
}

const formNote = {
  fontSize: 12, color: "#888", background: "#faf7f2",
  padding: "10px 14px", borderRadius: 8, display: "flex", alignItems: "center"
}

const saveBtn = {
  display: "flex", alignItems: "center", padding: "12px 24px",
  background: "#a6192e", color: "#fff", border: "none", borderRadius: 10,
  fontSize: 14, fontWeight: 600, cursor: "pointer",
  boxShadow: "0 4px 14px rgba(166,25,46,0.25)", transition: "all 0.2s"
}

const cancelBtn = {
  padding: "12px 24px", background: "#fff", color: "#666",
  border: "1px solid #e5ddd0", borderRadius: 10, fontSize: 14,
  fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
}

const securityCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 16, padding: "24px 28px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.4)"
}

const securityRow = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "14px 0", borderBottom: "1px solid #f5f0e6", flexWrap: "wrap", gap: 8
}

const changePassBtn = {
  display: "flex", alignItems: "center", padding: "8px 16px",
  background: "#f5f0e6", color: "#666", border: "none", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
}

export default ProfileSettingsTab
