import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"

function Results() {
  const { sportId } = useParams()
  const [results, setResults] = useState([])

  useEffect(() => {
    API.get(`/results/${sportId}`)
      .then(res => setResults(res.data))
      .catch(err => console.log(err))
  }, [sportId])

  return (
    <div>
      <h1>Results</h1>

      {results.map(result => (
        <div key={result._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>
            {result.match_id?.team1?.team_name} vs {result.match_id?.team2?.team_name}
          </h3>
          <p>Winner: {result.winner?.team_name}</p>
          <p>Score: {result.score}</p>
        </div>
      ))}
    </div>
  )
}

export default Results