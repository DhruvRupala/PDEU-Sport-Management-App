import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

function Events() {
  const [events, setEvents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/events").then(res => setEvents(res.data))
  }, [])

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Events</h1>

      <div className="row">
        {events.map(event => (
          <div className="col-md-4" key={event._id}>
            <div className="card shadow p-3 mb-4 border-0" style={{ borderRadius: "10px" }}>
              <h4>{event.event_name}</h4>
              <p>Type: {event.event_type}</p>
              <p>Status: <span className="fw-bold">{event.status}</span></p>

              <button
                className="btn text-white w-100"
                style={{ background: "#a6192e" }}
                onClick={() => navigate(`/sports/${event._id}`)}
              >
                View Sports
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Events