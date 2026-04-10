import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Match() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:5000/api/user/match", {
        headers: { authorization: token }
      }).then(res => {
        setUsers(res.data);
        setLoading(false);
      }).catch(err => {
        setError("No matches or error loading");
        setLoading(false);
      });
    }
  }, [token]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading matches...</div>;
  if (error) return <div>{error} <Link to="/profile">Update skills first</Link></div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Skill Matches 🎯</h2>
      <Link to="/profile" style={{ marginBottom: '20px', display: 'inline-block' }}>← Update Profile</Link>

      {users.length === 0 ? (
        <p>No matches yet. Update your wanted skills and try again!</p>
      ) : (
        users.map(u => (
          <div key={u._id} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
            <h3>{u.name}</h3>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Offers:</strong> {u.skillsOffered.join(', ')}</p>
            <p><strong>Wants:</strong> {u.skillsWanted.join(', ')}</p>
            <button onClick={() => requestSession(u._id, u.skillsOffered[0])} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              Request Session
            </button>
            <button onClick={() => window.location.href = `/chat?userId=${u._id}`} style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }}>
              Chat
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const requestSession = async (userId, skill) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post("http://localhost:5000/api/session/request", {
      providerId: userId,
      skill,
      date: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0] // next week
    }, {
      headers: { authorization: token }
    });
    alert("Session requested! Check /sessions");
  } catch (err) {
    alert("Request failed");
  }
};

export default Match;
