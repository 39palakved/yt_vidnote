import React, { useState } from 'react';
import {useNavigate,useLocation} from 'react-router-dom'
import { chatSession } from '../scripts';
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
    
    const input = e.target.value;
    setUserInput(input);
    setDesc(input);  
  }
  const submitNote =async() => {
    const tagsArray = tags.split(",").map(tag => tag.trim());
    const response = await fetch("https://yt-vidnote.onrender.com/api/auth/addnote", {
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
    
   
    setLoading(true);
      const response = await fetch(
        `https://youtube-summarizer2.p.rapidapi.com/transcript?id=${id}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": process.env.React_App_YOUTUBE_KEY,
            "x-rapidapi-host":"youtube-summarizer2.p.rapidapi.com",
          },
        }
      );
     
  
      const data = await response.json();
      const trimmedTranscript = data.transcript;

       setTrancscript(trimmedTranscript);
       
      
      
     
      setLoading(false);
      const geminiResponse = async () => {
        try {
          const prompt = `You are a helpful assistant.

I will give you a YouTube video transcript. Your task is to generate student-style notes based on that transcript.

The output should have:

1.Start with a short 2-3 line paragraph that explains the topic being discussed in a natural tone. Do NOT mention the video or any time-related words 
2. Then, convert the transcript into concise, point-wise notes — just like a student would write while studying.
3. Focus on important concepts only. Avoid repetition or unnecessary words.

4. Include small code snippets (if any) and break complex ideas into simple short points:\n\n${trimmedTranscript}`;
      
          const result = await chatSession.sendMessage(prompt);
          const response = await result.response.text(); 
      
         // console.log("Generated Summary:", response);
      
          return response; 
        } catch (error) {
          console.error("Error generating summary:", error);
          return null;
        }
      };
      
      const summary = await geminiResponse(); 
      setUserInput(summary);
      setDesc(summary)
      
  
     
      
       
      
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
