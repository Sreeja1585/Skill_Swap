import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get('userId'); // ?userId=xxx
  const token = localStorage.getItem("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // GET messages
  useEffect(() => {
    if (token && receiverId) {
      axios.get(`http://localhost:5000/api/message/${receiverId}`, {
        headers: { authorization: token }
      }).then(res => {
        setMessages(res.data);
        setLoading(false);
      }).catch(err => {
        setError("Failed to load messages");
        setLoading(false);
      });
    } else {
      setError("No user selected");
      setLoading(false);
    }
    scrollToBottom();
  }, [receiverId, token]);

  // SEND message
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/message/send",
        { receiverId, text },
        { headers: { authorization: token } }
      );
      setText("");
      // Reload messages
      window.location.reload();
    } catch (err) {
      alert("Send failed");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading chat...</div>;
  if (error || !receiverId) return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Chat</h2>
      <p>{error || "Select a user from matches to chat"}</p>
      <Link to="/match">Go to Matches</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        <h2>Chat</h2>
        <Link to="/match">← Back to Matches</Link>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f9f9f9' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            marginBottom: '10px',
            padding: '10px',
            background: m.senderId === token ? '#007bff' : '#e9ecef',
            color: m.senderId === token ? 'white' : 'black',
            borderRadius: '10px',
            alignSelf: m.senderId === token ? 'flex-end' : 'flex-start',
            maxWidth: '70%'
          }}>
            <p>{m.text}</p>
            <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type message..."
          style={{ width: '70%', padding: '10px' }}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px', marginLeft: '10px' }}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
