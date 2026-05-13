import { useNavigate, useLocation } from "react-router-dom"

function Payment() {
  const location = useLocation()
  const { sportName = "the sport", eventName = "the event" } = location.state || {}
  const navigate = useNavigate()

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh", maxWidth: "600px" }}>
      <div className="card shadow-lg border-0 rounded p-4 text-center" style={{ background: "white", borderRadius: "12px" }}>
        
        <div className="mb-4">
          <i className="fa-solid fa-circle-check" style={{ fontSize: "60px", color: "#28a745" }}></i>
        </div>

        <h2 className="fw-bold mb-3" style={{ color: "#333" }}>Registration Pending</h2>
        
        <p className="text-muted fs-5 mb-4">
          Your application for <strong>{sportName}</strong> in <strong>{eventName}</strong> has been successfully captured.
        </p>

        <div className="alert p-4 mb-4" style={{ background: "#fdf8e4", border: "1px solid #f0e6cc", color: "#856404", borderRadius: "8px" }}>
          <h4 className="fw-bold mb-2"><i className="fa-solid fa-clock me-2"></i>Payment Coming Soon</h4>
          <p className="mb-0">
            Our online payment gateway is currently under maintenance. Your registration will remain in a <strong>pending</strong> state until you complete the payment once the system is back online. 
          </p>
        </div>

        <button 
          className="btn text-white w-100 py-3 fw-bold fs-5 shadow-sm" 
          style={{ background: "#a6192e", borderRadius: "8px" }}
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default Payment
