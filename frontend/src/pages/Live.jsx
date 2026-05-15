import React from "react"

function Live() {

  return (
    <div style={container}>
      <div className="animate-fade" style={wrapper}>
        
        {/* HEADER */}
        <div style={header}>
          <div style={liveIndicator}>
            <span style={pulseDot}></span> Live Now
          </div>
          <h2 style={title}>Energy Cup Finals</h2>
          <p style={subtitle}>Men's Basketball • Quarter 4</p>
        </div>

        {/* SCOREBOARD */}
        <div style={scoreboard}>
          <div style={teamBlock}>
             <h3 style={teamName}>SOT Demons</h3>
             <div style={scoreBox}>84</div>
          </div>

          <div style={vsBlock}>
             <span style={timeRemaining}>02:15</span>
             <span style={quarter}>4th Qtr</span>
          </div>

          <div style={teamBlock}>
             <h3 style={teamName}>SLS Titans</h3>
             <div style={scoreBoxActive}>89</div>
          </div>
        </div>

        {/* FEED / STATS */}
        <div style={statsContainer}>
          <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px" }}>Recent Plays</h4>
          
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={playItem}>
              <span style={time}>02:15</span>
              <span style={event}><strong>SLS Titans</strong> — 3pt Jump Shot (Made)</span>
            </li>
            <li style={{...playItem, background: "#fbfbfb"}}>
              <span style={time}>02:45</span>
              <span style={event}><strong>SOT Demons</strong> — Personal Foul</span>
            </li>
            <li style={playItem}>
              <span style={time}>03:10</span>
              <span style={event}><strong>SLS Titans</strong> — Free Throw 2 of 2 (Made)</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

// STYLES
const container = {
  minHeight: "85vh",
  background: "#f5f0e6",
  padding: "50px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start"
}

const wrapper = {
  width: "100%",
  maxWidth: "800px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
  overflow: "hidden"
}

const header = {
  background: "#111",
  color: "white",
  padding: "40px 20px",
  textAlign: "center",
  position: "relative"
}

const liveIndicator = {
  position: "absolute",
  top: "20px",
  left: "20px",
  background: "rgba(255,0,0,0.2)",
  color: "#ff4e50",
  padding: "6px 12px",
  borderRadius: "30px",
  fontSize: "12px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid rgba(255,0,0,0.3)"
}

const pulseDot = {
  width: "8px",
  height: "8px",
  background: "#ff4e50",
  borderRadius: "50%",
  display: "inline-block",
  animation: "pulse 1.5s infinite"
}

const title = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "800",
  letterSpacing: "-0.5px"
}

const subtitle = {
  margin: "10px 0 0",
  color: "#aaa",
  fontSize: "16px"
}

const scoreboard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "50px 40px",
  background: "linear-gradient(to bottom, #1a1a1a, #2a2a2a)",
  color: "white"
}

const teamBlock = {
  textAlign: "center",
  flex: 1
}

const teamName = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "15px",
  color: "#ddd"
}

const scoreBox = {
  fontSize: "64px",
  fontWeight: "800",
  fontFamily: "monospace",
  color: "#fff",
  textShadow: "0 0 20px rgba(255,255,255,0.2)"
}

const scoreBoxActive = {
  ...scoreBox,
  color: "#f9d423",
  textShadow: "0 0 20px rgba(249, 212, 35, 0.4)"
}

const vsBlock = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px"
}

const timeRemaining = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#ff4e50",
  background: "rgba(0,0,0,0.5)",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 78, 80, 0.3)"
}

const quarter = {
  fontSize: "14px",
  color: "#aaa",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "1px"
}

const statsContainer = {
  padding: "40px"
}

const playItem = {
  display: "flex",
  gap: "20px",
  padding: "15px 10px",
  borderBottom: "1px solid #f1f1f1"
}

const time = {
  color: "#a6192e",
  fontWeight: "bold",
  width: "60px"
}

const event = {
  color: "#444"
}

export default Live
