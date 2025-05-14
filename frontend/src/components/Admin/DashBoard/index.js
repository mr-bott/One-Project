import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  Settings,
  BarChart3,
  ArrowUp,
  Menu,
  X,
  LogOut,
  Package,
} from "lucide-react";
import Loader from "../../Loader";
import "./Dashboard.css";
import { useNotification } from "../../../context/NotificationContext";
import Footer from "../../Footer";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Products", icon: <Package size={20} /> },
    { name: "Billing", icon: <CreditCard size={20} /> },
    { name: "Notifications", icon: <Bell size={20} /> },
    { name: "Profile", icon: <User size={20} /> },
    { name: "Logout", icon: <LogOut size={20} /> },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/admin/stats/documents`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    Cookies.remove("jwt_token"); // Remove token from cookies
    navigate("/login"); // Redirect to login
  };

  const statsCards = [
    {
      title: "Documents",
      value: `${products.totalDocuments}`,
      change: "+3%",
      period: "Total Documents",
      icon: <BarChart3 size={24} />,
      iconClass: "dashboard-icon-blue",
      textColorClass: "text-success",
    },

    {
      title: "24 Hours Documents",
      value: `${products.last24HoursDocuments}`,
      change: "Just updated",
      period: "",
      icon: <CreditCard size={24} />,
      iconClass: "dashboard-icon-green",
      textColorClass: "text-neutral",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this note?");
  if (!confirmDelete) return;

  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/admin/documents/${id}`;
    const response = await fetch(url, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete the note");
    }

    // Optional: notify user
    addNotification("Note deleted successfully");

    // Refresh the list after deletion
    setResearchNotes((prev) => prev.filter((note) => note._id !== id));
  } catch (err) {
    console.error(err);
    addNotification("Error deleting the note");
  }
};

  const renderMainContent = () => {
    if (activeTab === "Orders") {
      // return <OrderManagement />;
    } else if (activeTab === "Products") {
      // return <ProductManagement />;
    } else {
      if (isLoading||loading) {
        return <Loader />;
      }

      return (
        <>
          <div className="dashboard-stats">
            {statsCards.map((card, index) => (
              <div key={index} className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <div className={`dashboard-stat-icon ${card.iconClass}`}>
                    {card.icon}
                  </div>
                  <div className="dashboard-stat-info">
                    <p className="dashboard-stat-title">{card.title}</p>
                    <h3 className="dashboard-stat-value">{card.value}</h3>
                  </div>
                </div>
                <div className="dashboard-stat-footer">
                  <p className="dashboard-stat-change">
                    {card.change.startsWith("+") && (
                      <ArrowUp size={16} className="dashboard-icon-up" />
                    )}
                    <span className={card.textColorClass}>{card.change}</span>
                    <span className="dashboard-stat-period">{card.period}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-content-added">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search research notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Link to="/create-document">
                <button className="create-button">
                  Create New Research Note
                </button>
              </Link>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="no-results">No research notes found</div>
            ) : (
              <div className="notes-grid-added">
                {filteredNotes.map((note) => (
                  <div className="note-card" key={note._id}>
                    <Link to={`/details/${note._id}`} className="note-content">
                      <h2>{note.title}</h2>
                      <div className="expiry-badge">
                        {calculateTimeLeft(note.expiryDate)}
                      </div>
                    </Link>

                    <div className="note-actions">
                      <button
                        onClick={(e) => handleCopy(e, note.content)}
                        className="copy-button"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => handleDelete(note._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Toggle */}
      <button className="dashboard-mobile-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="dashboard-logo-text">Documents Dashboard</h1>
        </div>

        <div className="dashboard-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`dashboard-nav-item ${
                activeTab === item.name ? "dashboard-nav-active" : ""
              }`}
              onClick={() => {
                if (item.name === "Logout") {
                  logoutUser();
                } else {
                  setActiveTab(item.name);
                }
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <span className="dashboard-nav-icon">{item.icon}</span>
              <span className="dashboard-nav-text">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="dashboard-upgrade">
          <button
            className="dashboard-upgrade-button"
            onClick={() => logoutUser()}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header & Navigation */}
        <header className="dashboard-header">
          <div className="dashboard-breadcrumb">
            <a href="#" className="dashboard-breadcrumb-link">
              <LayoutDashboard size={18} />
            </a>
            <span className="dashboard-breadcrumb-separator">/</span>
            <span className="dashboard-breadcrumb-current">{activeTab}</span>
          </div>
          <h1 className="dashboard-title">{activeTab}</h1>
          <div className="dashboard-controls">
            <div className="dashboard-search">
              <input
                type="text"
                placeholder="Search here"
                className="dashboard-search-input"
              />
            </div>
            <button className="dashboard-control-button">
              <User size={20} />
            </button>
            <button className="dashboard-control-button">
              <Settings size={20} />
            </button>
            <button className="dashboard-control-button">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Render dynamic content based on active tab */}
        {renderMainContent()}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
