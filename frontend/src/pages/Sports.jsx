import { useEffect, useState } from "react"
import API from "../services/api"
import { useParams, useNavigate } from "react-router-dom"

function Sports() {
  const { eventId } = useParams()
  const [sports, setSports] = useState([])
  const [registrations, setRegistrations] = useState([])
  const navigate = useNavigate()
  
  const token = localStorage.getItem("token")

  useEffect(() => {
    API.get(`/sports/${eventId}`)
      .then(res => setSports(res.data))
      .catch(err => console.log(err))

    if (token) {
      API.get("/registrations/my-registrations")
        .then(res => {
          const registeredSportIds = res.data.map(r => 
            typeof r.sport_id === 'object' ? r.sport_id._id : r.sport_id
          )
          setRegistrations(registeredSportIds)
        })
        .catch(err => console.log(err))
    }
  }, [eventId, token])

  return (
    <div className="container mt-5" style={{ minHeight: "80vh" }}>
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate("/events")}>
        &larr; Back to Events
      </button>

      <h2 className="mb-4">Sports</h2>

      <div className="row">
        {sports.map(sport => {
          
          const eventStatus = sport.event_id?.status || 'closed';
          const isRegistrationOpen = eventStatus === 'registration open';
          const isRegistered = registrations.includes(sport._id);

          return (
            <div className="col-md-4 mb-4" key={sport._id}>
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "10px" }}>
                <div className="card-body">
                  <h4 className="fw-bold mb-3 text-center">{sport.sport_name}</h4>
                  <p className="text-center mb-3">Type: {sport.type} {sport.type === 'team' && `(${sport.team_size} players)`}</p>
                  
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/schedule/${sport._id}`)}>
                      View Schedule
                    </button>
                    <button 
                      className="btn btn-outline-info"
                      onClick={() => navigate(`/results/${sport._id}`)}>
                      View Results
                    </button>

                    <hr />

                    {isRegistered ? (
                       <button className="btn btn-success" disabled>
                         <i className="fa-solid fa-check-circle me-2"></i> Registered
                       </button>
                    ) : (
                       isRegistrationOpen ? (
                         <button 
                         className="btn text-white w-100 fw-bold"
                         style={{ background: "#a6192e" }}
                           onClick={() => {
                             if (!token) {
                               alert("Please login to register.");
                               navigate("/login");
                               return;
                             }
                             navigate(`/sport-registration/${eventId}/${sport._id}`, {
                              state: { sport }
                            })
                           }}
                         >
                           Register Now
                         </button>
                       ) : (
                         <button className="btn btn-secondary w-100" disabled>
                           Registration {eventStatus === 'open soon' ? 'Opens Soon' : 'Closed'}
                         </button>
                       )
                    )}

                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sports.length === 0 && (
         <div className="text-center text-muted mt-5">
           <h5>No sports have been added to this event yet.</h5>
         </div>
      )}
    </div>
  )
}

export default Sports