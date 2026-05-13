import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"

function Schedule() {
  const { sportId } = useParams()
  const [matches, setMatches] = useState([])

  useEffect(() => {
    API.get(`/matches/${sportId}`)
      .then(res => setMatches(res.data))
      .catch(err => console.log(err))
  }, [sportId])

  return (
    <div>
      <h1>Match Schedule</h1>

      {matches.map(match => (
        <div key={match._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{match.team1?.team_name} vs {match.team2?.team_name}</h3>
          <p>Date: {new Date(match.match_date).toLocaleDateString()}</p>
          <p>Status: {match.status}</p>
        </div>
      ))}
    </div>
  )
}

export default Schedule