import React, { useState } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./footer.css";

const Footer = () => {
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

  return (
    <footer className="footer">
      <div className="footer-container">
     
        <div className="footer-sections">
         
          <div className="footer-brand">
            <h2>Just For You</h2>
            <p className="site-footer">
              Crafted with ❤️ and care to give you freedom ,to write, reflect, and create without limits.
            </p>

     
          </div>

         
        </div>

        {/* Mobile Accordion */}
        <div className="footer-accordion">
          <div className="footer-brand mobile">
            <h2>For You </h2>
            <p>
              Creating beautiful digital experiences that transform businesses
              and delight users around the world.
            </p>
          
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
