import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2>BookNest</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <div className="social-icons">
              <span>📘</span> <span>📸</span> <span>▶️</span> <span>🐦</span>
            </div>
          </div>

          <div className="footer-section">
            <h3>About</h3>
            <ul>
              <li>Menu</li>
              <li>Features</li>
              <li>News & Blogs</li>
              <li>Help & Support</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li>How we work</li>
              <li>Terms of service</li>
              <li>Pricing</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div className="footer-section">
            
            <h3>Contact Us</h3>
            <ul>
              <li>Malabe, Sri Lanka</li>
              <li>+94 11 000000</li>
              <li>booknest@gmail.com</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="footer-bottom">
        2025 BookNest. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
