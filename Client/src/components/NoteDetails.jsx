import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../App.css'
import axios from "axios";
const NoteDetails = () => {
  const { noteId } = useParams();  // Retrieve noteId from URL
  const [note, setNote] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const handleTextSelection = () => {
    const selection = window.getSelection().toString();
    setSelectedText(selection);
  };
  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");

useEffect(() => {
  const fetchComments = async () => {
    const token = localStorage.getItem("token");

    

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/getcomments/${noteId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  fetchComments(); 
}, [noteId]);
const handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to delete a comment.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/auth/deletecomment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }


    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );

  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};
const handleAddComment = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to add a comment.");
    navigate("/Loggin", { state: { from: location.pathname } });
    return;
  }

  if (!newComment.trim()) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/auth/addcomment/${noteId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ commentText: newComment }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    const data = await response.json();


    setComments((prevComments) => [...prevComments, data.comment]);
    setNewComment("");

   
 
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

  const handleHighlight = () => {
    if (!selectedText) return;
    const updatedText = updatedDescription.replace(selectedText, `<span style='background-color:  #aeb6ef;'>${selectedText}</span>`);
    setUpdatedDescription(updatedText);
    setHighlightedText(updatedText);
  };
  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/fetchnote/${noteId}`, {
          method: 'GET',
          headers: {
            "auth-token": localStorage.getItem("token")
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNote(data);
        setUpdatedDescription(data.description);  
      } catch (error) {
        console.error("Error fetching note details: ", error);
      }
    };

    fetchNoteDetails();
  }, [noteId]);
  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/updatenote/${noteId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: updatedDescription })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedNote = await response.json();
      setNote(updatedNote.note);
      alert("Note updated successfully");
    } catch (error) {
      console.error("Error updating note: ", error);
      alert("Failed to update note");
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/deletenote/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Note deleted successfully");
      navigate("/collection"); 
    } catch (error) {
      console.error("Error deleting note: ", error);
      alert("Failed to delete note");
    }
  };
  
  
  const handleWhatsAppShare = () => {
    const message = `📒 *Here's a note I crafted just for you!* ✍️\n\n💡 Dive into this insightful note—whether you're learning something new or just exploring, this might be useful! 🚀\n\n🔗 Check it out now: ${window.location.origin}/notevid/${noteId}\n\n📌 Feel free to share your thoughts, and if you find it helpful, spread the knowledge! 😉✨`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
        <h1 className="ml-36" onClick={()=>{navigate("/collection")}}>←</h1>
      <div className="container mx-auto">
        {note ? (
          <div className="flex justify-center items-start gap-12">
          
            <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-3xl">
              <div className="flex justify-between">
              <h2 className="text-4xl font-bold text-red-600 mb-4">Note Details</h2>
              <div className="flex flex-wrap gap-2 mt-2">
             {note.tags.map((tag, index) => (
             <span
            key={index}
             className="bg-amber-600  mb-2 text-white px-3 py-3 rounded-full text-sm font-medium shadow-md hover:bg-amber-700 transition duration-300"
             >
             #{tag}
              </span>
             ))}
           </div>
              </div>
              <div 
                contentEditable
                dangerouslySetInnerHTML={{ __html: updatedDescription }}
                onBlur={(e) => setUpdatedDescription(e.target.innerHTML)}
                className= "scrollable-container w-full p-4 text-lg bg-gray-700 text-white rounded-lg mb-6 outline-none"
                   onMouseUp={handleTextSelection}
              ></div>
             
              


              <div className="flex justify-between">
             
                <button
                  className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition duration-300"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 mb-2" onClick={handleHighlight}>Highlight</button>
                <button
                 className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
                 onClick={handleWhatsAppShare}
                   >
                   Share
                </button>
                <button
                  className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition duration-300"
                  onClick={handleDelete}
                >
                
                  Delete
                </button>

              </div>
              
            </div>

           
            <div className="w-full max-w-lg">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${note.videoId}`}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              ></iframe>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
     {/* Comment Input Box */}

    <h3 className="text-lg font-semibold text-white ml-10 mt-10 mb-2">Add a Comment</h3>
    <input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-96 ml-10  h-14 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your feedback..."
        rows="3"
    ></input>
    <button 
        onClick={handleAddComment}
        className="mt-3 w-32 bg-blue-600 ml-3 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition duration-300"
    >
        ADD
    </button>


{/* Display Comments */}

    <h3 className="text-lg font-semibold text-white mb-2">Comments</h3>
    {(comments || []).length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className="bg-gray-700 max-w-3xl p-3 rounded-lg mb-3 flex justify-between items-center shadow">
          <p className="text-gray-300"><strong>{comment.userId?.name || "Anonymous"}</strong>: {comment.commentText}</p>
          
          <button 
            onClick={() => handleDeleteComment(comment._id)} 
            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full w-20  hover:bg-red-100"
          >
            🗑️
          </button>
        </div>
        ))
    ) : (
        <p className="text-gray-500 ml-10">No comments yet.</p>
    )}


    </div>
  );
};

export default NoteDetails;
