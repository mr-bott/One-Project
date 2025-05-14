import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./detailspage.css";
import Loader from "../../Loader";
import { useNotification } from "../../../context/NotificationContext";

const DetailsPage = () => {
  const { addNotification } = useNotification();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        setLoading(true);
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/documents/${id}`;
        const response = await fetch(url); // Replace with your real API endpoint
        if (!response.ok) {
          throw new Error("Note not found");

          addNotification("Note Not Found!");
        }

        const data = await response.json();
        setNote(data[0]);
        setError(null);
        addNotification("Data Fetched successfully");
      } catch (err) {
        addNotification("Failed to fetch Data", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id]);

  useEffect(() => {
    if (!note) return;

    const calculateTimeLeft = () => {
      const expiryTime = new Date(note.expiryDate).getTime();
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        return "Expired";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    return () => clearInterval(timer);
  }, [note]);

   const handleCopy = (e, content) => {
    e.stopPropagation(); // Prevent the link from triggering
    navigator.clipboard
      .writeText(content)
      .then(() => addNotification("Content copied to clipboard"))
      .catch(() => addNotification("Failed to copy content"));
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">{error}</div>;
  if (!note) return <div className="error">Research note not found</div>;

  return (
    <div className="details-container">
      <div className="back-link">
        <Link to="/">← Back to Home</Link>
      </div>

      <div className="note-header">
        <h1>{note.title}</h1>
        <div className="expiry-container">
          <div className="expiry-label">Time until deletion:</div>
          <div className="expiry-timer">{timeLeft}</div>
        </div>
        <button
                onClick={(e) => handleCopy(e, note.content)}
                className="copy-button-document"
              >
                Copy
              </button>
      </div>

      <div className="note-content">
        <p className="content-preview">{note.content}</p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(note.createdAt).toLocaleString()}
        </p>
        {/* <p>
          <strong>Updated At:</strong>{" "}
          {new Date(note.updatedAt).toLocaleString()}
        </p> */}
      </div>
    </div>
  );
};

export default DetailsPage;
