import { useState, useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
import "./homepage.css";
import Loader from "../../Loader/index";
import Footer from "../../Footer/index";
import { useNotification } from "../../../context/NotificationContext";

const Dashboard = () => {
  const [countdown, setCountdown] = useState(30);
  const { addNotification } = useNotification();
  const [researchNotes, setResearchNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(countdown);
  useEffect(() => {
    // Fetch research notes from API
    const fetchResearchNotes = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API endpoint
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/documents`;
        const response = await fetch(url);
        const data = await response.json();
        setResearchNotes(data);
        setLoading(false);
        addNotification("Data loaded successfully");
      } catch (err) {
        addNotification(
          "Failed to load research notes. Please try again later.",
          err.message
        );
        setLoading(false);
      }
    };

    fetchResearchNotes();
  }, []);


  // Countdown effect for loading
  useEffect(() => {
    if (countdown <= 0) {
      setMessage("Check your internet connection or try again later.");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    setMessage(countdown);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Calculate time left until expiry
  const calculateTimeLeft = (expiryDate) => {
    const expiryTime = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const difference = expiryTime - now;

    if (difference <= 0) {
      return "Expired";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return `${days}d ${hours}h remaining`;
  };

  // Filter notes based on search term
  const filteredNotes = researchNotes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCopy = (e, content) => {
    e.stopPropagation(); // Prevent the link from triggering
    navigator.clipboard
      .writeText(content)
      .then(() => addNotification("Content copied to clipboard"))
      .catch(() => addNotification("Failed to copy content"));
  };
  if (loading) {
    return (
  <div className="loading-container">
    <p className="loading-message description">
      → Our servers rely on free resources, so the first request might take
      up to a <span className="countdown-small"> {countdown} </span>to wake the servers up. Just give it a moment, and we’ll be good to go!
    </p>
    <h1 className="countdown-loading">{message}</h1>
    <Loader/>
  </div>
    );
  }

  if (error && researchNotes.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      <div className="welcome-container">
        <h1 className="heading">One Project That Connects Us!</h1>
        <p className="heading-2">Collaborate. Create. Contribute.</p>
        <p className="heading-2">Write It. Share It. Forget It.</p>
        <p className="heading-2">No Tracking, No User Data Collection</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search research notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Link to="/create-document">
          <button className="create-button"> + Create New Research Note</button>
        </Link>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="no-results">No research notes found</div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div className="note-card" key={note._id}>
              <Link to={`/details/${note._id}`} className="note-content">
                <h2>{note.title}</h2>
                <div className="expiry-badge">
                  {calculateTimeLeft(note.expiryDate)}
                </div>
              </Link>
              <button
                onClick={(e) => handleCopy(e, note.content)}
                className="copy-button"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
