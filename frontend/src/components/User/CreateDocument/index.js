import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./createdocument.css";
import Loader from "../../Loader";
import { useNotification } from "../../../context/NotificationContext";
const CreateDocument = () => {
  const { addNotification } = useNotification();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleExpiryChange = (e) => {
    const option = e.target.value;
    const now = new Date();
    let expiry = new Date(now);

    switch (option) {
      case "1d":
        expiry.setDate(now.getDate() + 1);
        break;
      case "7d":
        expiry.setDate(now.getDate() + 7);
        break;
      case "30d":
        expiry.setDate(now.getDate() + 30);
        break;
      case "6m":
        expiry.setMonth(now.getMonth() + 6);
        break;
      case "1y":
        expiry.setFullYear(now.getFullYear() + 1);
        break;
      default:
        expiry.setMonth(now.getMonth() + 6);
    }

    if (expiry) {
      setExpiryDate(expiry.toISOString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/documents`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, expiryDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create document");
        setLoading(false);
      }
      addNotification(
        "Document Created Successfully , You redirected to home page in 3 seconds"
      );
      setMessage(
        "Document created successfully , You redirected to home page in 3 seconds"
      );
      setTitle("");
      setContent("");
      setExpiryDate("");
      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      addNotification("Failed to create document", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="create-document-container">
      <div className="back-link">
        <Link to="/">← Back to Research Notes</Link>
      </div>
      <h2>Create a New Research Note</h2>

      <form onSubmit={handleSubmit} className="document-form">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Ex- Web Technologies / Week No :- wt9 | wt-9 | wt9 something"
        />

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          placeholder={`
            If the code is HTMl CSS JS Or PHP must and should be COMMENT in the following foramt

            HTML = <!-- comment -->

            JavaScript / TypeScript / CSS / PHP / SQL = /* comment */

            Python = """ comment """  or ''' comment '''
`}
        />

        <label>Expiry Duration</label>
        <select onChange={handleExpiryChange} required>
          <option value="">-- Select Expiry Duration --</option>
          <option value="1d">1 Day</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
        </select>

        <button type="submit">Create Note</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateDocument;
