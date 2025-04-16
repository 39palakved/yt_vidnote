import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyFavNotes = () => {
  const [favNotes, setFavNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteNotes = async () => {
      setLoading(true);
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
        setFavNotes(data);
      } catch (error) {
        console.error("Error fetching favorite notes: ", error);
      }
      setLoading(false);
    };

    fetchFavoriteNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <h1 onClick={() => navigate("/collection")} className="cursor-pointer">←</h1>
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          ⭐ My Favorite Notes
        </h2>
        {loading ? (
          <div className="text-center text-xl">Loading...</div>
        ) : favNotes.length === 0 ? (
          <div className="text-center text-xl">No favorite notes found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favNotes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="relative my-4">
                  <img
                    src={`http://img.youtube.com/vi/${note.videoId}/0.jpg`}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
                <p className="text-gray-300 mb-4 text-lg">{note.description.slice(0, 100)}...</p>
                <button
                  className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-600 transition"
                  onClick={() => navigate(`/notevid/${note._id}`)}
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

export default MyFavNotes;
