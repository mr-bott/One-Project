import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Our Team", "Careers", "News"],
    },
    {
      title: "Support",
      links: ["Help Center", "FAQ", "Contact Us", "Privacy Policy"],
    },
  ];

  const currentYear = new Date().getFullYear();

  const handleAdminClick = () => {
     navigate("/admin/dashboard");
  }
  return (
    <footer className="footer">
      <div className="footer-container">
     
        <div className="footer-sections">
         
          <div className="footer-brand">
            <h2>Just For You</h2>
            <p className="site-footer">
              Developed with ❤️ and care to give you freedom ,to write, reflect, and create without limits.
            </p>
            <button className="copy-button" onClick={()=>handleAdminClick()}><code>&lt;/&gt;</code>  Admin </button>
     
          </div>

         
        </div>

        {/* Mobile Accordion */}
        <div className="footer-accordion">
          <div className="footer-brand mobile">
            <h2>For You </h2>
            <p>
              
           Developed with ❤️ and care to give you freedom ,to write, reflect, and create without limits.
            </p>
            <button className="copy-button" onClick={()=>handleAdminClick()}><code>&lt;/&gt;</code> Admin </button>
          </div>

          
        </div>

        {/* Bottom Line */}
        <div className="footer-bottom">
          <p>© {currentYear} All rights reserved.</p>
          <ul>
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
