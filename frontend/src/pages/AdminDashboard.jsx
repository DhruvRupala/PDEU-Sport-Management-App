import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("events") // 'events' or 'sports'
  
  // -- Event Form State --
  const [newEvent, setNewEvent] = useState({ event_name: "", event_type: "freshers", description: "" })
  
  // -- Sport Form State --
  const [selectedEventId, setSelectedEventId] = useState("")
  const [newSport, setNewSport] = useState({
    sport_name: "", type: "individual", team_size: 1, max_participants: "", substitutes: ""
  })

  const role = localStorage.getItem("role")
  const navigate = useNavigate()

  useEffect(() => {
    if (role !== "admin" && role !== "manager") {
      navigate("/")
    } else {
      fetchEvents()
    }
  }, [role, navigate])

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events")
      setEvents(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const fetchSports = async (eventId) => {
    if (!eventId) {
      setSports([])
      return
    }
    try {
      const res = await API.get(`/sports/${eventId}`)
      setSports(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // --- EVENTS HANDLERS ---
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      await API.post("/events", newEvent)
      alert(`Event ${newEvent.event_name} created successfully!`)
      setNewEvent({ event_name: "", event_type: "freshers", description: "" })
      fetchEvents()
    } catch (err) {
      alert("Error creating event")
    }
  }

  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await API.patch(`/events/${eventId}/status`, { status: newStatus })
      fetchEvents()
    } catch (err) {
      alert("Error updating status")
    }
  }

  // --- SPORTS HANDLERS ---
  const handleEventSelection = (e) => {
    const id = e.target.value
    setSelectedEventId(id)
    fetchSports(id)
  }

  const handleAddSport = async (e) => {
    e.preventDefault()
    if (!selectedEventId) return alert("Select an event first.")

    const payload = {
      sport_name: newSport.sport_name,
      event_id: selectedEventId,
      type: newSport.type,
      team_size: newSport.type === "team" ? parseInt(newSport.team_size) : null,
      rules: {
        max_participants_per_uni: newSport.max_participants ? parseInt(newSport.max_participants) : null,
        substitutes_allowed: newSport.type === "team" && newSport.substitutes ? parseInt(newSport.substitutes) : null
      }
    }
    try {
      await API.post("/sports", payload)
      alert(`Successfully added ${newSport.sport_name}!`)
      setNewSport({ sport_name: "", type: "individual", team_size: 1, max_participants: "", substitutes: "" })
      fetchSports(selectedEventId)
    } catch (err) {
      alert(err.response?.data?.message || "Error adding sport")
    }
  }

  const handleRemoveSport = async (sportId) => {
    if (!window.confirm("Are you sure you want to delete this sport?")) return
    try {
      await API.delete(`/sports/${sportId}`)
      fetchSports(selectedEventId)
    } catch (err) {
      alert("Failed to remove sport")
    }
  }

  if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>

  return (
    <div style={{ display: "flex", minHeight: "90vh", background: "#f5f0e6" }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: "250px", background: "#a6192e", color: "white", padding: "30px 20px" }}>
        <h3 className="fw-bold mb-5">Admin Control</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li className="mb-3">
            <button 
              style={activeTab === "events" ? activeSidebarBtn : sidebarBtn}
              onClick={() => setActiveTab("events")}>
              <i className="fa-solid fa-list-check me-2"></i> Manage Events
            </button>
          </li>
          <li>
            <button 
              style={activeTab === "sports" ? activeSidebarBtn : sidebarBtn}
              onClick={() => setActiveTab("sports")}>
              <i className="fa-solid fa-basketball me-2"></i> Manage Sports
            </button>
          </li>
        </ul>
      </aside>

      {/* MAIN VIEWPORT */}
      <main style={{ flex: 1, padding: "40px" }}>
        {activeTab === "events" && (
           <div className="animate-fade">
             <h2>Event Management</h2>
             <hr className="mb-4"/>
             
             <div className="row">
               <div className="col-md-5 mb-4">
                 <div className="card shadow-sm border-0 p-4">
                   <h5 className="mb-3 fw-bold">Create New Event</h5>
                   <form onSubmit={handleCreateEvent}>
                     <label className="fw-bold">Event Name</label>
                     <input type="text" className="form-control mb-3" required 
                       value={newEvent.event_name} onChange={e=>setNewEvent({...newEvent, event_name: e.target.value})} />
                     <label className="fw-bold">Type</label>
                     <select className="form-control mb-3" 
                       value={newEvent.event_type} onChange={e=>setNewEvent({...newEvent, event_type: e.target.value})}>
                       <option value="freshers">Freshers</option>
                       <option value="intra-university">Intra-University</option>
                       <option value="inter-university">Inter-University</option>
                     </select>
                     <button className="btn w-100 fw-bold text-white shadow-sm" style={{ background: "#a6192e" }}>Launch Event</button>
                   </form>
                 </div>
               </div>

               <div className="col-md-7">
                 <div className="card shadow-sm border-0 p-4">
                   <h5 className="mb-3 fw-bold">Active Tournaments (Control Status)</h5>
                   {events.map(ev => (
                     <div key={ev._id} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded shadow-sm">
                       <div>
                         <strong className="d-block">{ev.event_name}</strong>
                         <small className="text-muted">{ev.event_type}</small>
                       </div>
                       <select 
                         className="form-control w-auto" 
                         value={ev.status}
                         onChange={(e) => handleUpdateStatus(ev._id, e.target.value)}
                         style={{ border: "2px solid #ccc" }}
                       >
                         <option value="open soon">Open Soon</option>
                         <option value="registration open">Reg. Open</option>
                         <option value="ongoing">Ongoing</option>
                         <option value="closed">Closed</option>
                       </select>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
        )}

        {activeTab === "sports" && (
           <div className="animate-fade">
             <h2>Sports & Rules Configuration</h2>
             <hr className="mb-4"/>

             <div className="mb-4 p-3 bg-white shadow-sm rounded" style={{ maxWidth: "400px" }}>
               <label className="fw-bold text-danger">Target Event Database:</label>
               <select className="form-control mt-2" value={selectedEventId} onChange={handleEventSelection}>
                 <option value="">-- Select Event to Manage --</option>
                 {events.map(ev => <option key={ev._id} value={ev._id}>{ev.event_name}</option>)}
               </select>
             </div>

             {selectedEventId && (
               <div className="row">
                 <div className="col-md-6 mb-4">
                   <div className="card shadow-sm border-0 p-4">
                     <h5 className="mb-3 fw-bold">Add Sport to Event</h5>
                     <form onSubmit={handleAddSport}>
                        <div className="mb-3">
                          <label className="fw-bold text-muted">Sport Name</label>
                          <input type="text" className="form-control" required 
                            value={newSport.sport_name} onChange={e=>setNewSport({...newSport, sport_name: e.target.value})} />
                        </div>
                        <div className="mb-3">
                          <label className="fw-bold text-muted">Rules: University Participation Cap</label>
                          <input type="number" className="form-control" placeholder="Optional max students per uni" 
                            min="1" value={newSport.max_participants} onChange={e=>setNewSport({...newSport, max_participants: e.target.value})} />
                        </div>
                        <div className="mb-3">
                          <label className="fw-bold text-muted">Type</label>
                          <select className="form-control" value={newSport.type} onChange={e=>setNewSport({...newSport, type: e.target.value})}>
                            <option value="individual">Individual</option>
                            <option value="team">Team</option>
                          </select>
                        </div>
                        {newSport.type === "team" && (
                          <div className="row mb-3">
                            <div className="col">
                              <label className="fw-bold text-muted">Team Size</label>
                              <input type="number" className="form-control" min="2" required 
                                value={newSport.team_size} onChange={e=>setNewSport({...newSport, team_size: e.target.value})} />
                            </div>
                            <div className="col">
                              <label className="fw-bold text-muted">Rules: Substitutes</label>
                              <input type="number" className="form-control" min="0" placeholder="Bench size" 
                                value={newSport.substitutes} onChange={e=>setNewSport({...newSport, substitutes: e.target.value})} />
                            </div>
                          </div>
                        )}
                        <button className="btn w-100 fw-bold text-white shadow-sm mt-2" style={{ background: "#a6192e" }}>Inject Sport & Rules</button>
                     </form>
                   </div>
                 </div>

                 <div className="col-md-6">
                   <div className="card shadow-sm border-0 p-4">
                     <h5 className="mb-3 fw-bold">Current Active Sports</h5>
                     {sports.length === 0 ? <p className="text-muted">No sports added yet.</p> : null}
                     {sports.map(sp => (
                       <div key={sp._id} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded border-start border-danger border-4">
                         <div>
                           <strong className="d-block">{sp.sport_name}</strong>
                           <small className="text-muted">
                             {sp.type} {sp.type === 'team' && `(${sp.team_size}v${sp.team_size})`}
                             {sp.rules?.max_participants_per_uni ? ` | Cap: ${sp.rules.max_participants_per_uni}/uni` : ''}
                             {sp.rules?.substitutes_allowed ? ` | Subs: ${sp.rules.substitutes_allowed}` : ''}
                           </small>
                         </div>
                         <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveSport(sp._id)}>Remove</button>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </div>
        )}
      </main>
    </div>
  )
}

// STYLES
const sidebarBtn = { width: "100%", textAlign: "left", padding: "12px 15px", background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }
const activeSidebarBtn = { ...sidebarBtn, background: "white", color: "#a6192e", border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }

export default AdminDashboard
