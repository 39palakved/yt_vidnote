import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Collections = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTag, setSearchTag] = useState(""); // State for search
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFavoriteNotes = async () => {
      try {
        const response = await fetch("https://yt-vidnote.onrender.com/api/auth/favorite-notes", {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch favorite notes");
        }
  
        const data = await response.json();
        setFavoriteNotes(data.map(note => note._id));  // ✅ Only store IDs
      } catch (error) {
        console.error("Error fetching favorite notes: ", error);
      }
    };
  
    fetchFavoriteNotes();
  }, []);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/fetchallnotes", {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes: ", error);
      }
    };
    fetchNotes();
  }, []);

  const handleReadMore = (noteId) => {
    navigate(`/notevid/${noteId}`);
  };
  const toggleFavorite = async (noteId) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/favorite', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({ noteId })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // ✅ Fetch updated favorites list from backend after toggling
      const updatedResponse = await fetch("http://localhost:5000/api/auth/favorite-notes", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
  
      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated favorite notes");
      }
  
      const updatedData = await updatedResponse.json();
      setFavoriteNotes(updatedData.map(note => note._id));  // ✅ Update state with fresh data
  
    } catch (error) {
      console.error("Error updating favorite notes: ", error);
    }
  };
  
  // Filter notes based on searchTag input
  const filteredNotes = searchTag
    ? notes.filter((note) =>
        note.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
      )
    : notes;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <h1 onClick={() => navigate("/Loggin/:feed")}>←</h1>
        <h2 className="text-4xl font-bold text-center text-red-600 mb-8">My Collections</h2>
        <button
          className="bg-yellow-500 text-black px-6 py-2 rounded-md mb-6 hover:bg-yellow-600 transition"
          onClick={() => navigate("/favorites")}
        >
          ⭐ My Favorite Notes
        </button>
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {loading ? (
          <div className="text-center text-xl">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-800 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 w-full max-w-xs"
              >
                {/* 🌟 Favorite Button */}
              <button
                className={`text-2xl ${favoriteNotes.includes(note._id) ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => toggleFavorite(note._id)}
              >
                ★
              </button>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-amber-600 mb-2 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md hover:bg-amber-700 transition duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="relative mb-6">
                  <img
                    src={`http://img.youtube.com/vi/${note.videoId}/0.jpg`}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover rounded-xl opacity-85 hover:opacity-100 transition-all duration-300"
                  />
                </div>

                <p className="text-gray-300 mb-6 text-lg">{note.description.slice(0, 100)}...</p>

                <button
                  className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition duration-300"
                  onClick={() => handleReadMore(note._id)}
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
