import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // GET PROFILE
  useEffect(() => {
    if (token) {
      axios.get("http://localhost:5000/api/user/profile", {
        headers: { authorization: token }
      }).then(res => {
        setUser(res.data);
        setLoading(false);
      }).catch(err => {
        setError("Failed to load profile");
        setLoading(false);
      });
    }
  }, [token]);

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      await axios.put("http://localhost:5000/api/user/profile", user, {
        headers: { authorization: token }
      });
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error} <Link to="/">Login</Link></div>;

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Profile</h2>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>← Back to Login</Link>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Name:</label>
        <input
          value={user.name || ""}
          onChange={e => setUser({...user, name: e.target.value})}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Email:</label>
        <input
          value={user.email || ""}
          onChange={e => setUser({...user, email: e.target.value})}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Skills Offered (comma separated):</label>
        <input
          placeholder="JavaScript, Python, Design"
          value={user.skillsOffered ? user.skillsOffered.join(', ') : ''}
          onChange={e =>
            setUser({...user, skillsOffered: e.target.value.split(',').map(s => s.trim()).filter(s => s)})
          }
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Skills Wanted (comma separated):</label>
        <input
          placeholder="React, DevOps, Marketing"
          value={user.skillsWanted ? user.skillsWanted.join(', ') : ''}
          onChange={e =>
            setUser({...user, skillsWanted: e.target.value.split(',').map(s => s.trim()).filter(s => s)})
          }
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <button onClick={updateProfile} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none' }}>Update Profile</button>
    </div>
  );
}

export default Profile;
