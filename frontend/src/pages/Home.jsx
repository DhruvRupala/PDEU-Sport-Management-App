import { useNavigate } from "react-router-dom"
import campusBg from "../assets/images/campus-bg.jpeg"

function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ background: "#f5f0e6", minHeight: "100vh" }}>

      {/* APPLE-STYLE HERO SECTION */}
      <div style={hero}>
        <div style={heroContent} className="animate-fade">
          <h2 style={kicker}>The All-New Portal.</h2>
          <h1 style={title}>PDEU Sports</h1>
          <p style={subtitle}>
            Pro-level management. <br /> For pro-level tournaments.
          </p>
          <div style={actionRow}>
            <button style={primaryBtn} onClick={() => navigate("/events")}>
              Explore Events <i className="fa-solid fa-chevron-right ms-2" style={{ fontSize: "12px" }}></i>
            </button>
          </div>
        </div>
      </div>

      {/* APPLE-STYLE FEATURE CARDS (GRID) */}
      <div style={section}>
        <div style={gridContainer}>
          
          <div style={{ ...card, background: "#fff" }} className="animate-fade">
             <h3 style={cardTitle}>Energy Cup.</h3>
             <p style={cardDesc}>The ultimate Inter-University showdown.</p>
             <button style={textBtn} onClick={() => navigate("/events")}>Learn more <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }}></i></button>
          </div>

          <div style={{ ...card, background: "#a6192e", color: "white" }} className="animate-fade">
             <h3 style={{ ...cardTitle, color: "white" }}>Freshers Cup.</h3>
             <p style={{ ...cardDesc, color: "rgba(255,255,255,0.8)" }}>Where new legends begin their journey here.</p>
             <button style={{ ...textBtn, color: "white" }} onClick={() => navigate("/events")}>Learn more <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }}></i></button>
          </div>

          <div style={{ ...card, background: "#111", color: "white" }} className="animate-fade">
             <h3 style={{ ...cardTitle, color: "white" }}>Intra Cup. Pro.</h3>
             <p style={{ ...cardDesc, color: "#888" }}>
                Fierce internal competition pushing limits across all departments. Designed for absolute peak performance.
             </p>
             <button style={{ ...textBtn, color: "#a6192e" }} onClick={() => navigate("/events")}>Learn more <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }}></i></button>
          </div>

        </div>
      </div>

    </div>
  )
}

// 🎨 APPLE-MINIMALIST STYLES

const hero = {
  height: "100vh",
  backgroundImage: `linear-gradient(to top, #f5f0e6 0%, rgba(245, 240, 230, 0.4) 30%, rgba(0,0,0,0.7) 100%), url(${campusBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#333",
  textAlign: "center",
  paddingTop: "60px"
}

const heroContent = {
  background: "transparent",
  padding: "40px",
  textAlign: "center"
}

const kicker = {
  color: "#ffc107", 
  fontWeight: "600",
  fontSize: "22px",
  marginBottom: "10px",
  letterSpacing: "1px"
}

const title = {
  fontSize: "clamp(3rem, 8vw, 6rem)", // responsive huge text
  fontWeight: "700",
  color: "white",
  letterSpacing: "-0.04em", // tight tracking like apple
  marginBottom: "15px",
  lineHeight: "1"
}

const subtitle = {
  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
  fontWeight: "400",
  color: "#ccc",
  marginBottom: "40px",
  letterSpacing: "-0.01em"
}

const actionRow = {
  display: "flex",
  gap: "20px",
  justifyContent: "center"
}

const primaryBtn = {
  padding: "14px 28px",
  background: "#a6192e", // PDEU red
  color: "white",
  border: "none",
  borderRadius: "30px", // pill shape
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
}



const section = {
  padding: "80px 20px",
  background: "#f5f0e6", // exact theme match
  display: "flex",
  justifyContent: "center"
}

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "24px",
  width: "100%",
  maxWidth: "1100px"
}

const card = {
  padding: "50px 40px",
  borderRadius: "24px", // large smooth radi
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}

const cardTitle = {
  fontSize: "36px",
  fontWeight: "700",
  letterSpacing: "-0.03em",
  color: "#111",
  marginBottom: "10px"
}

const cardDesc = {
  fontSize: "18px",
  color: "#555",
  marginBottom: "25px",
  fontWeight: "400"
}

const textBtn = {
  background: "none",
  border: "none",
  color: "#a6192e",
  fontSize: "17px",
  fontWeight: "600",
  cursor: "pointer",
  padding: 0
}

export default Home