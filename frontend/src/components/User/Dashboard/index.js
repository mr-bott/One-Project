import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import Loader from "../../Loader/index";
import Footer from "../../Footer/index";
import { useNotification } from "../../../context/NotificationContext";

const Dashboard = () => {
  const { addNotification } = useNotification();
  const [researchNotes, setResearchNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <>
         <Loader />
        <p className="loading-message">
          → Our servers rely on free resources, so the first request might take
          up to a minute to awake the servers up. Just give it a moment, and
          we’ll be good to go!
        </p>
     
      </>
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
          <button className="create-button">Create New Research Note</button>
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
