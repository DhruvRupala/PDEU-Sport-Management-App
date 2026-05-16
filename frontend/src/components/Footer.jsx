function Footer() {
  return (
    <div style={footer}>

      {/* MAIN CONTENT */}
      <div style={container}>

        {/* LEFT */}
        <div style={footerCol}>
          <h4>Sports Portal</h4>
          <p>University event management system.</p>
        </div>

        {/* MIDDLE */}
        <div style={footerCol}>
          <h5>Quick Links</h5>
          <p>Home</p>
          <p>Events</p>
          <p>Login</p>
        </div>

        {/* RIGHT */}
        <div style={footerCol}>
          <h5>Contact</h5>
          <p>Gandhinagar, Gujarat</p>
          <p>Email: info@portal.com</p>
        </div>

      </div>

      {/* BOTTOM LINE */}
      <div style={bottom}>
        © 2026 Sports Committee of PDEU | All Rights Reserved
      </div>

    </div>
  )
}

// 🎨 STYLES

const footer = {
  background: "#2a2a2a",
  color: "white",
  marginTop: "50px"
}

const container = {
  display: "flex",
  justifyContent: "space-around",
  padding: "30px",
  flexWrap: "wrap",
  gap: "20px"
}

const footerCol = {
  minWidth: "180px",
  flex: "1 1 180px",
  textAlign: "center"
}

const bottom = {
  textAlign: "center",
  padding: "10px",
  background: "#a6192e",
  color: "white",
  fontWeight: "500",
  fontSize: "14px"
}
export default Footer