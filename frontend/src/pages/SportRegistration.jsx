import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function SportRegistration() {
  const { eventId, sportId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const sport = location.state?.sport;

  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState(
    sport?.type === "team" 
      ? Array.from({ length: Math.max(0, (sport.team_size || 1) - 1) }, () => ({ name: "", roll_no: "", phone: "" }))
      : []
  );
  const [loading, setLoading] = useState(false);

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/registrations", {
        event_id: eventId,
        sport_id: sportId,
        team_name: teamName,
        players: players
      });
      // Navigate to Payment
      navigate(`/payment/${eventId}/${sportId}`, {
        state: { sportName: sport?.sport_name, eventName: sport?.event_id?.event_name }
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!sport) {
    return (
        <div className="container mt-5 text-center">
            <p>Loading sport details... Please navigate from the sports page.</p>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
  }

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh", maxWidth: "700px" }}>
      <div className="card shadow-lg border-0 p-4" style={{ borderRadius: "12px", background: "white" }}>
        <h2 className="mb-4 text-center fw-bold" style={{ color: "#a6192e" }}>
            Register for {sport.sport_name}
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="alert alert-info fw-bold" style={{ background: "#f8f9fa", border: "1px solid #dee2e6", color: "#333" }}>
            <i className="fa-solid fa-user me-2" style={{ color: "#a6192e" }}></i>
            You will be registered as {sport.type === "team" ? "Captain" : "Participant"}.
          </div>

          {sport.type === "team" && (
            <>
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: "#5a4a42" }}>Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: "#faf7f2", border: "1px solid #d6cfc7" }}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  required
                />
              </div>

              <h5 className="fw-bold mt-4 mb-3" style={{ color: "#333" }}>Team Members details</h5>
              {players.map((player, index) => (
                <div key={index} className="p-3 mb-3 rounded" style={{ background: "#fdfbf7", border: "1px solid #e9e4dc" }}>
                  <p className="fw-bold mb-2" style={{ color: "#a6192e" }}>Player {index + 2}</p>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        value={player.name}
                        onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                        required
                        style={{ background: "#fff" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Roll No"
                        value={player.roll_no}
                        onChange={(e) => handlePlayerChange(index, "roll_no", e.target.value)}
                        required
                        style={{ background: "#fff" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        value={player.phone}
                        onChange={(e) => handlePlayerChange(index, "phone", e.target.value)}
                        required
                        style={{ background: "#fff" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <hr className="my-4" />
          
          <button 
            type="submit" 
            className="btn text-white w-100 py-3 fw-bold fs-5 shadow-sm"
            style={{ background: "#a6192e", borderRadius: "8px" }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SportRegistration;
