import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({ question: "Loading..." })

  const fetchQuestion = () => {
    axios.get('http://localhost:8080/api/question')
      .then(res => setData(res.data))
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Interview Dojo</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>{data.question}</h3>
        <p>Category: {data.category}</p>
        <button onClick={fetchQuestion}>New Question</button>
      </div>
    </div>
  )
}
export default App