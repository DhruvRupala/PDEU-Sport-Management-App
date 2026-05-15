function MyTeamsTab({ data }) {
  const { registrations, userTeams } = data

  // Build team info from registrations
  const teamRegistrations = registrations.filter(r => r.team_name)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={pageTitle}>My Teams</h1>
        <p style={pageSubtitle}>Teams and rosters you're part of</p>
      </div>

      {teamRegistrations.length === 0 ? (
        <div style={emptyState}>
          <i className="fa-solid fa-users-slash" style={{ fontSize: 52, color: "#ddd", marginBottom: 16 }} />
          <p style={{ fontSize: 18, color: "#888", margin: 0 }}>No team registrations</p>
          <p style={{ fontSize: 13, color: "#bbb", marginTop: 6 }}>
            You haven't registered for any team sports yet
          </p>
        </div>
      ) : (
        <div style={teamGrid}>
          {teamRegistrations.map((reg, idx) => (
            <div key={reg._id} style={teamCard} className="animate-fade">
              {/* Team Header */}
              <div style={teamCardHeader}>
                <div style={teamAvatar}>
                  {reg.team_name?.charAt(0)?.toUpperCase() || "T"}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={teamNameStyle}>{reg.team_name}</h3>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    <span style={sportBadge}>
                      <i className="fa-solid fa-basketball" style={{ marginRight: 4, fontSize: 10 }} />
                      {reg.sport_id?.sport_name || "—"}
                    </span>
                    <span style={typeBadgeStyle(reg.sport_id?.type)}>
                      {reg.sport_id?.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div style={eventInfoRow}>
                <i className="fa-solid fa-trophy" style={{ color: "#a6192e", fontSize: 12, marginRight: 6 }} />
                <span style={{ fontSize: 13, color: "#666" }}>{reg.event_id?.event_name || "—"}</span>
                {reg.event_id?.status && (
                  <span style={eventStatusBadge(reg.event_id.status)}>{reg.event_id.status}</span>
                )}
              </div>

              {/* Team Size Info */}
              {reg.sport_id?.team_size && (
                <div style={teamSizeBar}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Team Composition
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                      {reg.players?.length || 0}/{reg.sport_id.team_size}
                    </span>
                  </div>
                  <div style={progressTrack}>
                    <div style={{
                      ...progressFill,
                      width: `${Math.min(((reg.players?.length || 0) / reg.sport_id.team_size) * 100, 100)}%`
                    }} />
                  </div>
                </div>
              )}

              {/* Player Roster */}
              <div style={rosterSection}>
                <div style={rosterTitle}>
                  <i className="fa-solid fa-users" style={{ marginRight: 6, fontSize: 12 }} />
                  Players ({reg.players?.length || 0})
                </div>
                {(!reg.players || reg.players.length === 0) ? (
                  <p style={{ fontSize: 13, color: "#bbb", margin: "8px 0 0", fontStyle: "italic" }}>No players listed</p>
                ) : (
                  <div style={playerList}>
                    {reg.players.map((player, pIdx) => (
                      <div key={pIdx} style={playerRow}>
                        <div style={playerAvatar}>
                          {player.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{player.name}</div>
                          <div style={{ fontSize: 11, color: "#999", display: "flex", gap: 12, marginTop: 2 }}>
                            {player.roll_no && <span><i className="fa-solid fa-id-badge" style={{ marginRight: 3 }} />{player.roll_no}</span>}
                            {player.phone && <span><i className="fa-solid fa-phone" style={{ marginRight: 3 }} />{player.phone}</span>}
                          </div>
                        </div>
                        <div style={playerIndex}>#{pIdx + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Footer */}
              <div style={teamFooter}>
                <span style={{ fontSize: 12, color: "#888" }}>
                  Registered: {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <PayBadge status={reg.payment_status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Individual Sport Registrations */}
      {registrations.filter(r => !r.team_name).length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
            <i className="fa-solid fa-person-running" style={{ color: "#ec4899", marginRight: 8 }} />
            Individual Registrations
          </h2>
          <div style={individualGrid}>
            {registrations.filter(r => !r.team_name).map(reg => (
              <div key={reg._id} style={individualCard} className="animate-fade">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ ...teamAvatar, width: 38, height: 38, fontSize: 14, background: "linear-gradient(135deg, #ec4899, #f472b6)" }}>
                    <i className="fa-solid fa-person-running" style={{ fontSize: 16 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{reg.sport_id?.sport_name || "—"}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{reg.event_id?.event_name || "—"}</div>
                  </div>
                  <PayBadge status={reg.payment_status} />
                </div>
              </div>
            ))}
          </div>
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
const typeBadgeStyle = (type) => ({
  background: type === "team" ? "rgba(99,102,241,0.1)" : "rgba(236,72,153,0.1)",
  color: type === "team" ? "#6366f1" : "#ec4899",
  padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, textTransform: "capitalize"
})

const eventStatusBadge = (status) => {
  const colors = {
    "open soon": "#6366f1", "registration open": "#10b981",
    "ongoing": "#f59e0b", "closed": "#9ca3af"
  }
  return {
    background: `${colors[status] || "#999"}18`,
    color: colors[status] || "#999",
    padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600,
    textTransform: "capitalize", marginLeft: 8
  }
}

/* ── Styles ── */
const pageTitle = { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }
const pageSubtitle = { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 0 }
const emptyState = { textAlign: "center", padding: "60px 20px" }

const teamGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 }

const teamCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 16, overflow: "hidden",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.4)",
  transition: "transform 0.2s, box-shadow 0.2s"
}

const teamCardHeader = {
  display: "flex", gap: 14, alignItems: "center",
  padding: "22px 24px 14px", borderBottom: "1px solid #f5f0e6"
}

const teamAvatar = {
  width: 48, height: 48, borderRadius: 14,
  background: "linear-gradient(135deg, #a6192e, #d4213d)",
  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 20, fontWeight: 700, flexShrink: 0,
  boxShadow: "0 4px 14px rgba(166,25,46,0.3)"
}

const teamNameStyle = { fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }
const sportBadge = {
  background: "rgba(166,25,46,0.08)", color: "#a6192e",
  padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600
}

const eventInfoRow = {
  display: "flex", alignItems: "center", padding: "10px 24px",
  background: "#faf7f2", flexWrap: "wrap"
}

const teamSizeBar = { padding: "14px 24px 10px" }
const progressTrack = {
  height: 6, borderRadius: 3, background: "#f0ebe0", overflow: "hidden"
}
const progressFill = {
  height: "100%", borderRadius: 3,
  background: "linear-gradient(90deg, #a6192e, #d4213d)",
  transition: "width 0.6s ease"
}

const rosterSection = { padding: "12px 24px" }
const rosterTitle = {
  fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase",
  letterSpacing: "0.04em", display: "flex", alignItems: "center", marginBottom: 8
}

const playerList = { display: "flex", flexDirection: "column", gap: 6 }
const playerRow = {
  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
  borderRadius: 10, background: "#faf7f2", transition: "background 0.2s"
}
const playerAvatar = {
  width: 30, height: 30, borderRadius: 8,
  background: "rgba(166,25,46,0.1)", color: "#a6192e",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 12, fontWeight: 700, flexShrink: 0
}
const playerIndex = {
  fontSize: 11, color: "#bbb", fontWeight: 700
}

const teamFooter = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "12px 24px", borderTop: "1px solid #f5f0e6"
}

const individualGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }
const individualCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 14, padding: "16px 20px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.4)"
}

export default MyTeamsTab
