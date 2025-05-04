import React from "react";
import "./Sidebar.css";

const GENRES = [
  "All",
  "Business",
  "Science",
  "Fiction",
  "Philosophy",
  "Biography",
];

const Sidebar = ({ genre, setGenre, sort, setSort }) => (
  <aside className="sidebar">
    <div className="sort-section">
      <label>Sort</label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="az">A - Z</option>
        <option value="za">Z - A</option>
        <option value="newest">Latest</option>
        <option value="rating">Best Rate</option>
      </select>
    </div>
    <div className="genre-section">
      <label>Book by Genre</label>
      <ul>
        {GENRES.map((g) => (
          <li key={g}>
            <button
              className={genre === g ? "active" : ""}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default Sidebar;
