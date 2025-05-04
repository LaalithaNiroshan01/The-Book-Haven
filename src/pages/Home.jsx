import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BookCard from "../components/BookCard";
import SectionTitle from "../components/SectionTitle";
import TrendingItem from "../components/TrendingItem";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import "./home.css";

const GENRES = [
  "All",
  "Business",
  "Science",
  "Fiction",
  "Philosophy",
  "Biography",
];

const SORT_OPTIONS = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Latest", value: "newest" },
  { label: "Best Rate", value: "rating" },
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("az");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

  // Trending items (static for now)
  const trendingItems = [
    "Trenning Games",
    "Peng Up",
    "Dave Walsh",
    "Ford Tower",
    "Recovery",
    "Haven's Dream",
    "Kompetals Alam",
    "Between Sometime",
    "From home",
    "Veloce Motors",
  ];

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [genre, sort, search, page]);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    let query = search
      ? encodeURIComponent(search)
      : genre !== "All"
      ? `subject:${genre}`
      : "bestseller";
    let orderBy = sort === "newest" ? "newest" : "relevance";
    let startIndex = page * 12;
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=${orderBy}&maxResults=12&startIndex=${startIndex}`
      );
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      let items = data.items || [];
      // Sorting
      if (sort === "az") {
        items.sort((a, b) =>
          (a.volumeInfo.title || "").localeCompare(b.volumeInfo.title || "")
        );
      } else if (sort === "za") {
        items.sort((a, b) =>
          (b.volumeInfo.title || "").localeCompare(a.volumeInfo.title || "")
        );
      } else if (sort === "rating") {
        items.sort(
          (a, b) =>
            (b.volumeInfo.averageRating || 0) -
            (a.volumeInfo.averageRating || 0)
        );
      }
      setBooks(items);
    } catch (err) {
      setError(err.message || "Unknown error");
      setBooks([]);
    }
    setLoading(false);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  // Pagination handlers
  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div
      className="home-page"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
      />

      <main style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar
          genre={genre}
          setGenre={setGenre}
          sort={sort}
          setSort={setSort}
        />

        {/* Main Content */}
        <div style={{ flex: 1, padding: "2rem" }}>
          <SectionTitle title="Recommended" />

          {/* Error State */}
          {error && (
            <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div className="books-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="book-card-skeleton"
                  style={{
                    width: 180,
                    height: 320,
                    background: "#eee",
                    borderRadius: 8,
                  }}
                />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div style={{ margin: "2rem 0" }}>No books found.</div>
          ) : (
            <div className="books-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.volumeInfo.title}
                  author={book.volumeInfo.authors?.join(", ")}
                  thumbnail={book.volumeInfo.imageLinks?.thumbnail}
                  description={book.volumeInfo.description}
                  rating={book.volumeInfo.averageRating}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              margin: "2rem 0",
            }}
          >
            <button onClick={handlePrev} disabled={page === 0}>
              Previous
            </button>
            <span>Page {page + 1}</span>
            <button onClick={handleNext} disabled={books.length < 12}>
              Next
            </button>
          </div>

          {/* Trending Section */}
          <SectionTitle title="Which they like" />
          <div className="trending-grid">
            {trendingItems.map((item, index) => (
              <TrendingItem key={index} title={item} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
