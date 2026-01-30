"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import SearchIcon from "@mui/icons-material/Search";

const SearchProducts = () => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate suggestions
  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setSuggestions([]);
      setProducts([]);
      setShowDropdown(false);
      return;
    }

    const s = new Set();
    if (term.includes("men")) {
      s.add("mens jeans under 999");
      s.add("mens shirts under 799");
      s.add("mens joggers under 899");
    }
    if (term.includes("jeans")) s.add("mens slim fit jeans");
    if (term.includes("shirt")) s.add("mens casual shirts");

    setSuggestions(Array.from(s));
    setShowDropdown(true);
  }, [search]);

  const handleSearch = () => {
    const term = search.trim();
    if (!term) return;
    setShowDropdown(false);
    router.push(`/search?search=${encodeURIComponent(term)}`);
  };

  const handleSuggestionClick = (text) => {
    setSearch(text);
    setShowDropdown(false);
    router.push(`/search?search=${encodeURIComponent(text)}`);
  };

  return (
    <div
      ref={containerRef}
      className="position-relative w-100 mx-auto"
      style={{ maxWidth: "700px" }}
    >
      {/* 🔎 Modern Search Bar */}
      <div
        className="d-flex align-items-center shadow-sm"
        style={{
          borderRadius: "40px",
          overflow: "hidden",
          border: "2px solid #f0c14b",
          background: "#fff",
        }}
      >
        <input
          type="text"
          className="form-control border-0 px-4"
          placeholder="Search Kumar Fashion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          style={{
            height: "50px",
            fontSize: "16px",
            boxShadow: "none",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            background: "#f0c14b",
            border: "none",
            height: "50px",
            width: "60px",
          }}
        >
          <SearchIcon />
        </button>
      </div>

      {/* 🔥 Animated Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="position-absolute w-100 bg-white shadow-lg mt-2"
          style={{
            borderRadius: "15px",
            maxHeight: "400px",
            overflowY: "auto",
            animation: "fadeSlide 0.25s ease",
            zIndex: 999,
          }}
        >
          <ul className="list-group list-group-flush">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleSuggestionClick(s)}
              >
                <SearchIcon className="me-2 text-muted" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SearchProducts;
