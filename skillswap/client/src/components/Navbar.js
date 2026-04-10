import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token && location.pathname !== '/' && location.pathname !== '/register') {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-4 text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to={token ? "/profile" : "/"} className="text-2xl font-bold hover:text-blue-200">
          SkillSwap
        </Link>
        {token && (
          <div className="flex gap-6">
            <Link to="/profile" className={`hover:text-blue-200 ${location.pathname === '/profile' ? 'border-b-2 border-white' : ''}`}>Profile</Link>
            <Link to="/match" className={`hover:text-blue-200 ${location.pathname === '/match' ? 'border-b-2 border-white' : ''}`}>Matches</Link>
            <Link to="/sessions" className={`hover:text-blue-200 ${location.pathname === '/sessions' ? 'border-b-2 border-white' : ''}`}>Sessions</Link>
            <Link to="/chat" className={`hover:text-blue-200 ${location.pathname === '/chat' ? 'border-b-2 border-white' : ''}`}>Chat</Link>
            <button onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
