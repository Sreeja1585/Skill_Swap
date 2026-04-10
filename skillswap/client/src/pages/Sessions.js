import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:5000/api/session", {
        headers: { authorization: token }
      }).then(res => {
        setSessions(res.data);
        setLoading(false);
      }).catch(err => {
        setError("Failed to load sessions");
        setLoading(false);
      });
    }
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/session/${id}`,
        { status },
        { headers: { authorization: token } }
      );
      // Refresh
      window.location.reload();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading sessions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h2>My Sessions 📅</h2>
      <Link to="/match" style={{ marginBottom: '20px', display: 'inline-block' }}>← Back to Matches</Link>
      
      {sessions.length === 0 ? (
        <p>No sessions. Request one from matches!</p>
      ) : (
        sessions.map(s => (
          <div key={s._id} style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            margin: '15px 0', 
            borderRadius: '8px',
            background: s.status === 'accepted' ? '#d4edda' : s.status === 'rejected' ? '#f8d7da' : '#fff3cd'
          }}>
            <h3>{s.skill} Session</h3>
            <p><strong>Date:</strong> {s.date}</p>
            <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: s.status === 'accepted' ? 'green' : s.status === 'rejected' ? 'red' : 'orange' }}>{s.status.toUpperCase()}</span></p>
            {s.requesterId && s.providerId && (
              <>
                <p><strong>Requester:</strong> {s.requesterId.name}</p>
                <p><strong>Provider:</strong> {s.providerId.name}</p>
              </>
            )}
            {s.status === "pending" && (
              <div>
                <button 
                  onClick={() => updateStatus(s._id, "accepted")}
                  style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', marginRight: '10px', borderRadius: '4px' }}
                >
                  Accept
                </button>
                <button 
                  onClick={() => updateStatus(s._id, "rejected")}
                  style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Sessions;
