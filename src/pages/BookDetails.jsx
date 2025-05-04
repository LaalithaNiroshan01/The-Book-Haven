import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [modalBook, setModalBook] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        if (!data.volumeInfo) throw new Error("Book not found");
        setBook(data.volumeInfo);
      } catch (err) {
        setError(err.message || "Failed to fetch book details.");
        setBook(null);
      }
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  // Fetch suggestions based on genre/category
  useEffect(() => {
    let interval;
    const fetchSuggestions = async () => {
      if (!book || !book.categories || book.categories.length === 0) return;
      setSuggestionLoading(true);
      try {
        const genre = encodeURIComponent(book.categories[0]);
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=20`
        );
        const data = await res.json();
        let items = (data.items || []).filter(
          (b) =>
            b.id !== id &&
            b.volumeInfo &&
            b.volumeInfo.title &&
            b.volumeInfo.authors &&
            b.volumeInfo.imageLinks
        );
        // Shuffle and pick 4 random suggestions
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
        setSuggestions(items.slice(0, 4));
      } catch (err) {
        setSuggestions([]);
      }
      setSuggestionLoading(false);
    };
    if (book && book.categories && book.categories.length > 0) {
      fetchSuggestions();
      // Refresh suggestions every 30 seconds
      interval = setInterval(fetchSuggestions, 30000);
    }
    return () => interval && clearInterval(interval);
  }, [book, id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    alert("Added to cart!");
  };
  const handleBuyNow = () => {
    alert("Proceed to buy!");
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() !== "") {
      setComments([
        ...comments,
        {
          text: commentInput,
          rating: userRating,
          date: new Date().toLocaleString(),
        },
      ]);
      setCommentInput("");
      setUserRating(0);
    }
  };

  if (loading) {
    return (
      <div className="book-details-skeleton" style={{ padding: "2rem" }}>
        <div
          className="skeleton-img"
          style={{
            width: 200,
            height: 300,
            background: "#eee",
            marginBottom: 16,
          }}
        />
        <div
          className="skeleton-line"
          style={{
            width: "60%",
            height: 24,
            background: "#eee",
            marginBottom: 8,
          }}
        />
        <div
          className="skeleton-line"
          style={{
            width: "40%",
            height: 18,
            background: "#eee",
            marginBottom: 8,
          }}
        />
        <div
          className="skeleton-line"
          style={{
            width: "80%",
            height: 16,
            background: "#eee",
            marginBottom: 8,
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          ← Back
        </button>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!book) return null;

  const {
    title,
    authors,
    imageLinks,
    publishedDate,
    publisher,
    averageRating,
    ratingsCount,
    description,
    categories,
    pageCount,
    previewLink,
    infoLink,
    language,
  } = book;

  const shortDesc =
    description && description.length > 350 && !showFullDesc
      ? description.slice(0, 350) + "..."
      : description;

  return (
    <div className="book-details-main">
      <div className="book-details-left">
        <div className="book-details-card">
          <img
            className="book-details-cover"
            src={
              imageLinks?.thumbnail ||
              "https://via.placeholder.com/200x300?text=No+Cover"
            }
            alt={title}
          />
          <div className="book-details-info">
            <h1>{title}</h1>
            <div className="book-details-meta">
              By {authors?.join(", ")} | {publishedDate}
            </div>
            <div className="book-details-rating">
              ⭐ {averageRating || "N/A"}
              <span className="votes">
                {ratingsCount ? `${ratingsCount} Votes` : ""}
              </span>
            </div>
            <div className="book-details-actions">
              <button className="buy-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="cart-btn" onClick={handleAddToCart}>
                Add To Cart
              </button>
            </div>
          </div>
        </div>
        <div className="book-details-section">
          <h3>Synopsis</h3>
          <p>{description}</p>
        </div>
        <div className="book-details-tags">
          {categories?.map((cat, i) => (
            <span className="tag" key={i}>
              {cat}
            </span>
          ))}
        </div>
        <div className="book-details-table">
          <div>
            <span>Publisher</span>
            <span>{publisher || "N/A"}</span>
          </div>
          <div>
            <span>Published Date</span>
            <span>{publishedDate || "N/A"}</span>
          </div>
          <div>
            <span>Language</span>
            <span>{language?.toUpperCase() || "N/A"}</span>
          </div>
          <div>
            <span>Genre</span>
            <span>{categories?.join(", ") || "N/A"}</span>
          </div>
          <div>
            <span>Pages</span>
            <span>{pageCount ? `${pageCount} pages` : "N/A"}</span>
          </div>
          <div>
            <span>Status</span>
            <span>Completed</span>
          </div>
        </div>
        <button
          className="comment-btn"
          onClick={() =>
            document
              .getElementById("comment-section")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          See Comment
        </button>
        {/* Comment and Rate Section */}
        <div id="comment-section" style={{ marginTop: 32 }}>
          <h3>Leave a Comment & Rate</h3>
          <form
            onSubmit={handleCommentSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: 24,
                    cursor: "pointer",
                    color: userRating >= star ? "#f5a623" : "#ccc",
                  }}
                  onClick={() => setUserRating(star)}
                  role="button"
                  aria-label={`Rate ${star} star`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
            <button
              type="submit"
              style={{
                alignSelf: "flex-start",
                padding: "8px 20px",
                borderRadius: 6,
                background: "#a0520b",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
          {/* Comments List */}
          <div style={{ marginTop: 24 }}>
            {comments.length === 0 ? (
              <div style={{ color: "#888" }}>No comments yet.</div>
            ) : (
              comments.map((c, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    background: "#f7f1e3",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontSize: 18, color: "#f5a623" }}>
                    {"★".repeat(c.rating)}
                    {"☆".repeat(5 - c.rating)}
                  </div>
                  <div style={{ margin: "6px 0" }}>{c.text}</div>
                  <div style={{ fontSize: 12, color: "#a0520b" }}>{c.date}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="book-details-right">
        <div className="related-title">Cerita Serupa</div>
        <div className="related-list">
          {suggestionLoading ? (
            <div style={{ color: "#888" }}>Loading suggestions...</div>
          ) : suggestions.length === 0 ? (
            <div style={{ color: "#888" }}>No suggestions found.</div>
          ) : (
            suggestions.map((sbook) => {
              const v = sbook.volumeInfo;
              return (
                <div
                  className="related-card"
                  key={sbook.id}
                  onClick={() => setModalBook(sbook)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="related-cover"
                    src={v.imageLinks.thumbnail}
                    alt={v.title}
                  />
                  <div className="related-info">
                    <h4>{v.title}</h4>
                    <div className="related-author">
                      By {v.authors?.join(", ")}
                    </div>
                    <div className="related-rating">
                      ⭐ {v.averageRating || "N/A"}{" "}
                      <span className="votes">
                        {v.ratingsCount ? v.ratingsCount + " votes" : ""}
                      </span>
                    </div>
                    <div className="related-desc">
                      {v.description ? v.description.slice(0, 80) + "..." : ""}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Modal for Book Overview */}
        {modalBook && (
          <div className="modal-overlay" onClick={() => setModalBook(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                style={{
                  float: "right",
                  fontSize: 22,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setModalBook(null)}
              >
                &times;
              </button>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                  marginTop: 16,
                }}
              >
                <img
                  src={modalBook.volumeInfo.imageLinks.thumbnail}
                  alt={modalBook.volumeInfo.title}
                  style={{
                    width: 120,
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <div>
                  <h2 style={{ margin: 0 }}>{modalBook.volumeInfo.title}</h2>
                  <div style={{ color: "#a0520b", marginBottom: 8 }}>
                    By {modalBook.volumeInfo.authors?.join(", ")}
                  </div>
                  <div style={{ color: "#f5a623", marginBottom: 8 }}>
                    ⭐ {modalBook.volumeInfo.averageRating || "N/A"}{" "}
                    <span style={{ color: "#888", fontSize: 14 }}>
                      {modalBook.volumeInfo.ratingsCount
                        ? modalBook.volumeInfo.ratingsCount + " votes"
                        : ""}
                    </span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {modalBook.volumeInfo.description
                      ? modalBook.volumeInfo.description.slice(0, 300)
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
