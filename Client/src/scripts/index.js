import {
    GoogleGenerativeAI,
   
  } from "@google/generative-ai";
  
  const apikey = process.env.React_App_GEMINI_API_KEY
  const genAI = new GoogleGenerativeAI(apikey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  
  
  export const chatSession = model.startChat();