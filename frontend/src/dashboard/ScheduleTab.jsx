function ScheduleTab({ data }) {
  const { upcomingMatches, registrations } = data
  const sportNames = [...new Set(registrations.map(r => r.sport_id?.sport_name).filter(Boolean))]

  const getStatusConfig = (status) => {
    const map = {
      scheduled: { bg: "rgba(99,102,241,0.1)", color: "#6366f1", icon: "fa-clock", label: "Scheduled" },
      ongoing:   { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", icon: "fa-play", label: "Live" },
      completed: { bg: "rgba(46,125,50,0.1)", color: "#2e7d32", icon: "fa-check", label: "Completed" },
    }
    return map[status] || map.scheduled
  }

  const matchesByDate = {}
  upcomingMatches.forEach(m => {
    const date = new Date(m.match_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    if (!matchesByDate[date]) matchesByDate[date] = []
    matchesByDate[date].push(m)
  })
  const dateKeys = Object.keys(matchesByDate)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Match Schedule</h1>
        <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>Upcoming and ongoing matches for your registered sports</p>
      </div>
      {sportNames.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 24, padding: "12px 16px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderRadius: 12, border: "1px solid #f0ebe0" }}>
          <span style={{ fontSize: 12, color: "#888", fontWeight: 600, marginRight: 8 }}>Your Sports:</span>
          {sportNames.map(n => <span key={n} style={{ background: "rgba(166,25,46,0.08)", color: "#a6192e", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{n}</span>)}
        </div>
      )}
      {dateKeys.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <i className="fa-solid fa-calendar-xmark" style={{ fontSize: 52, color: "#ddd", marginBottom: 16 }} />
          <p style={{ fontSize: 18, color: "#888", margin: 0 }}>No upcoming matches</p>
          <p style={{ fontSize: 13, color: "#bbb", marginTop: 6 }}>Matches will appear here once they're scheduled for your sports</p>
        </div>
      ) : (
        <div>
          {dateKeys.map(date => (
            <div key={date} className="animate-fade">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, marginTop: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(166,25,46,0.1)", color: "#a6192e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-calendar-day" style={{ fontSize: 14 }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: 0, flex: 1 }}>{date}</h3>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#f5f0e6", padding: "4px 12px", borderRadius: 20 }}>{matchesByDate[date].length} match{matchesByDate[date].length > 1 ? "es" : ""}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginLeft: 18, paddingLeft: 24, borderLeft: "2px solid #f0ebe0", marginBottom: 24 }}>
                {matchesByDate[date].map(m => {
                  const cfg = getStatusConfig(m.status)
                  return (
                    <div key={m._id} style={{ display: "flex", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.4)" }}>
                      <div style={{ width: 5, background: cfg.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, padding: "18px 22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            <i className="fa-solid fa-basketball" style={{ marginRight: 6, fontSize: 11 }} />{m.sport_id?.sport_name || "—"}
                          </span>
                          <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                            <i className={`fa-solid ${cfg.icon}`} style={{ fontSize: 9, marginRight: 4 }} />{cfg.label}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-end" }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{m.team1?.team_name || "TBD"}</span>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #a6192e, #d4213d)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{m.team1?.team_name?.charAt(0) || "?"}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#a6192e", background: "rgba(166,25,46,0.08)", padding: "4px 10px", borderRadius: 8 }}>VS</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{m.team2?.team_name?.charAt(0) || "?"}</div>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{m.team2?.team_name || "TBD"}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                          <span style={{ fontSize: 12, color: "#888" }}><i className="fa-regular fa-clock" style={{ marginRight: 4 }} />{new Date(m.match_date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                          {m.venue && <span style={{ fontSize: 12, color: "#888" }}><i className="fa-solid fa-location-dot" style={{ marginRight: 4 }} />{m.venue}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScheduleTab
