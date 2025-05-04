// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FiShoppingCart, FiSearch } from "react-icons/fi";

const bannerImg =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=facearea&w=600&q=80";
const womanImg =
  "https://img.freepik.com/free-photo/portrait-surprised-young-woman-glasses-holding-book_231208-10868.jpg?w=600";

const Header = ({ searchInput, setSearchInput, handleSearch }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* Top Navigation Bar */}
      <div className="header-bar">
        <div className="header-left">
          <span className="brand-name">The Book Haven</span>
          <FiShoppingCart className="nav-cart-icon" size={22} />
        </div>
        <div className="header-center">
          <span className="nav-explorer active">Explorer</span>
          <FiShoppingCart className="nav-cart-icon center-cart" size={22} />
        </div>
        <div className="header-right">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Log in
          </button>
        </div>
      </div>
      {/* Banner Section */}
      <div className="header-banner">
        <div className="banner-content">
          <div className="banner-image-left">
            <img src={womanImg} alt="Woman with book" />
          </div>
          <div className="banner-text-right">
            <h1>
              READ AND ADD
              <br />
              YOUR INSIGHT
            </h1>
            <p>Find Your Favorite Book</p>
            <form className="banner-search" onSubmit={handleSearch}>
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search Book"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search books"
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
