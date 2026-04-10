import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Name" 
          value={data.name}
          onChange={e => setData({...data, name: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <input 
          placeholder="Email" 
          type="email"
          value={data.email}
          onChange={e => setData({...data, email: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={data.password}
          onChange={e => setData({...data, password: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>Register</button>
      </form>
      <p>Already have account? <Link to="/">Login</Link></p>
    </div>
  );
}

export default Register;
