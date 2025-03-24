import React, { useState } from 'react';
import {useNavigate,useLocation} from 'react-router-dom'
function Notes({id}) {
  console.log("received id", id)
  const navigate = useNavigate();
  const location = useLocation();
  const [transcript,setTrancscript] = useState("")
  const [tags, setTags] = useState("");
  const[desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");  
  const handleChange = (e)=>{
    
    setUserInput(e.target.value);
    setDesc(userInput)
  }
  const submitNote =async() => {
    const tagsArray = tags.split(",").map(tag => tag.trim());
    const response = await fetch("http://localhost:5000/api/auth/addnote", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token") 
      },
      body: JSON.stringify({ "videoId": id, "description": desc ,tags: tagsArray })
     
  });

  const json = await response.json();
  
  navigate('/collection');
};


    
  const handleAiClick =async()=>{
    
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    setLoading(true);
      const response = await fetch(
        `https://youtube-summarizer2.p.rapidapi.com/transcript?id=${id}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":"95212c340amsh19a957a484f408ep1159a4jsn802368683e2f",
            "x-rapidapi-host":"youtube-summarizer2.p.rapidapi.com",
          },
        }
      );
     
  
      const data = await response.json();
      const trimmedTranscript = data.transcript.split(" ").slice(30, 150).join(" ") + ".";

       setTrancscript(trimmedTranscript);
       setUserInput(data?.transcript || "");
      
      setDesc(transcript);
      setLoading(false);
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `Summarize this transcript:\n${transcript}`}],
              },
            ],
          }),
        }
      );
  
      const geminiData = await geminiResponse.json();
     
      
  
     
      
       
      
  };
  
  

  return (
   <div>
      <div className="max-w-full w-full bg-white p-10 rounded-md shadow-md">
      <div className='flex justify-between'>
      <h2 className="text-lg font-semibold mb-4">Notepad</h2>
      <img src='https://cdn-icons-png.flaticon.com/128/4616/4616809.png' className='w-12 h-12 mb-4' onClick={handleAiClick}/>
      </div>
    
      <textarea
    id="noteInput"
    className="w-full max-w-full h-80  border border-gray-300 rounded-md p-2 mb-4 resize-none text-left "
    value={loading ? "Loading..." : userInput}  
  
    placeholder="Write your note here..."
    onChange={handleChange}
  ></textarea>
  
    <input
  type="text"
  className="w-full border border-gray-300 rounded-md p-2 mb-4"
  placeholder="Enter tags (comma separated)"
  value={tags}
  onChange={(e) => setTags(e.target.value)}
/>
    <button onClick={submitNote} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit Note</button>
    <p id="noteDisplay" className="mt-4"></p>
  </div>  
    </div>
  );
}

export default Notes;