import React from "react";
import "./bookCard.css";
import { Link } from "react-router-dom";

const BookCard = ({ id, title, author, thumbnail, description, rating }) => {
  return (
    <Link to={`/book/${id}`} className="book-card">
      <div className="book-card-image">
        <img
          src={thumbnail || "https://via.placeholder.com/128x193"}
          alt={title}
        />
      </div>
      <h3 className="book-card-title">{title}</h3>
      {author && <p className="book-card-author">By {author}</p>}
      {rating && <p className="book-card-rating">⭐ {rating}</p>}
      <p className="book-card-description">{description?.slice(0, 80)}...</p>
    </Link>
  );
};

export default BookCard;
