function LeaderboardTab({ data }) {
  const { leaderboard } = data
  const medals = ["🥇", "🥈", "🥉"]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Leaderboard</h1>
        <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>University rankings based on tournament wins</p>
      </div>

      {/* Podium Top 3 */}
      {leaderboard.length >= 3 && (
        <div style={podiumRow}>
          {[1, 0, 2].map(idx => {
            const entry = leaderboard[idx]
            const isFirst = idx === 0
            return (
              <div key={idx} style={{ ...podiumCard, ...(isFirst ? podiumFirst : {}) }} className="animate-fade">
                <div style={{ fontSize: isFirst ? 48 : 36, marginBottom: 8 }}>{medals[idx]}</div>
                <div style={{ ...podiumAvatar, ...(isFirst ? { width: 64, height: 64, fontSize: 24 } : {}) }}>
                  {entry.university?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <h3 style={{ fontSize: isFirst ? 16 : 14, fontWeight: 700, color: "#1a1a1a", margin: "8px 0 4px", textAlign: "center" }}>
                  {entry.university}
                </h3>
                <div style={{ fontSize: isFirst ? 28 : 22, fontWeight: 800, color: "#a6192e" }}>{entry.wins}</div>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>wins</div>
                <div style={{ ...podiumBase, height: isFirst ? 80 : idx === 1 ? 56 : 40 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>#{idx + 1}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full Table */}
      <div style={tableCard}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0ebe0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: 0, display: "flex", alignItems: "center" }}>
            <i className="fa-solid fa-ranking-star" style={{ color: "#a6192e", marginRight: 8 }} />
            Full Rankings
          </h3>
        </div>
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <i className="fa-solid fa-trophy" style={{ fontSize: 48, color: "#ddd", marginBottom: 16 }} />
            <p style={{ fontSize: 16, color: "#888", margin: 0 }}>No results yet</p>
            <p style={{ fontSize: 13, color: "#bbb", marginTop: 4 }}>Rankings will appear once match results are recorded</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Rank</th>
                  <th style={th}>University</th>
                  <th style={th}>Wins</th>
                  <th style={{ ...th, width: "40%" }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => {
                  const maxWins = leaderboard[0]?.wins || 1
                  const pct = (entry.wins / maxWins) * 100
                  return (
                    <tr key={i} style={i % 2 === 0 ? {} : { background: "#fdfbf7" }}>
                      <td style={td}>
                        {i < 3 ? (
                          <span style={{ fontSize: 20 }}>{medals[i]}</span>
                        ) : (
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#888" }}>#{i + 1}</span>
                        )}
                      </td>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={rankAvatar}>{entry.university?.charAt(0)?.toUpperCase() || "?"}</div>
                          <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{entry.university}</span>
                        </div>
                      </td>
                      <td style={{ ...td, fontWeight: 800, fontSize: 18, color: "#a6192e" }}>{entry.wins}</td>
                      <td style={td}>
                        <div style={barTrack}>
                          <div style={{ ...barFill, width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Styles ── */
const podiumRow = { display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 32, flexWrap: "wrap" }
const podiumCard = {
  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
  borderRadius: 20, padding: "24px 28px 0", textAlign: "center", width: 180,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.4)",
  display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden"
}
const podiumFirst = { transform: "scale(1.08)", boxShadow: "0 8px 30px rgba(166,25,46,0.15)" }
const podiumAvatar = {
  width: 50, height: 50, borderRadius: 14,
  background: "linear-gradient(135deg, #a6192e, #d4213d)",
  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 20, fontWeight: 700, boxShadow: "0 4px 14px rgba(166,25,46,0.3)"
}
const podiumBase = {
  width: "calc(100% + 56px)", marginTop: 12,
  background: "linear-gradient(180deg, #a6192e, #8a1526)",
  display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px 12px 0 0"
}

const tableCard = { background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }
const th = { textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", background: "#faf7f0", borderBottom: "1px solid #f0ebe0" }
const td = { padding: "14px 20px", fontSize: 14, color: "#333", borderBottom: "1px solid #f5f0e6", verticalAlign: "middle" }

const rankAvatar = {
  width: 32, height: 32, borderRadius: 8,
  background: "rgba(166,25,46,0.1)", color: "#a6192e",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 13, fontWeight: 700, flexShrink: 0
}

const barTrack = { height: 8, borderRadius: 4, background: "#f0ebe0", overflow: "hidden" }
const barFill = { height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #a6192e, #d4213d)", transition: "width 0.8s ease" }

export default LeaderboardTab
